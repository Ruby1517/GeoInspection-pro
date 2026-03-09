from fastapi import APIRouter, Depends, HTTPException, Query, status
from geoalchemy2.elements import WKTElement
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.api.auth_deps import get_current_user, require_roles
from app.api.deps import get_db
from app.models.category import Category
from app.models.enums import UserRole
from app.models.inspection import Inspection
from app.models.user import User
from app.schemas.inspection import InspectionCreate, InspectionRead, InspectionUpdate, NearbyInspectionRead
from app.utils.inspection_number import generate_inspection_number

router = APIRouter(prefix="/inspections", tags=["Inspections"])


@router.post(
    "/",
    response_model=InspectionRead,
    status_code=status.HTTP_201_CREATED,
)
def create_inspection(
    payload: InspectionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN, UserRole.INSPECTOR, UserRole.SUPERVISOR)
    ),
):
    category = db.query(Category).filter(Category.id == payload.category_id).first()
    if not category:
        raise HTTPException(status_code=400, detail="Invalid category_id.")

    if payload.assigned_to is not None:
        assignee = db.query(User).filter(User.id == payload.assigned_to).first()
        if not assignee:
            raise HTTPException(status_code=400, detail="Invalid assigned_to user id.")

    if payload.latitude is None or payload.longitude is None:
        raise HTTPException(status_code=400, detail="latitude and longitude are required.")

    existing_inspection = db.query(Inspection).filter(
        Inspection.title == payload.title,
        Inspection.category_id == payload.category_id,
        Inspection.latitude == payload.latitude,
        Inspection.longitude == payload.longitude,
        Inspection.created_by == current_user.id,
    ).first()

    if existing_inspection:
        raise HTTPException(status_code=400, detail="A similar inspection already exists.")

    point = WKTElement(
        f"POINT({float(payload.longitude)} {float(payload.latitude)})",
        srid=4326,
    )

    inspection = Inspection(
        inspection_number="TEMP",
        title=payload.title,
        description=payload.description,
        category_id=payload.category_id,
        priority=payload.priority,
        status=payload.status,
        address=payload.address,
        latitude=payload.latitude,
        longitude=payload.longitude,
        location=point,
        created_by=current_user.id,
        assigned_to=payload.assigned_to,
    )

    db.add(inspection)
    db.flush()

    inspection.inspection_number = generate_inspection_number(inspection.id)

    db.commit()
    db.refresh(inspection)

    return inspection

@router.get("/", response_model=list[InspectionRead])
def list_inspections(
    status_filter: str | None = Query(default=None, alias="status"),
    priority: str | None = None,
    category_id: int | None = None,
    created_by: int | None = None,
    assigned_to: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Inspection)

    if current_user.role == UserRole.INSPECTOR:
        query = query.filter(Inspection.created_by == current_user.id)

    elif current_user.role == UserRole.CONTRACTOR:
        query = query.filter(Inspection.assigned_to == current_user.id)

    if status_filter:
        query = query.filter(Inspection.status == status_filter)

    if priority:
        query = query.filter(Inspection.priority == priority)

    if category_id:
        query = query.filter(Inspection.category_id == category_id)

    if created_by:
        query = query.filter(Inspection.created_by == created_by)

    if assigned_to:
        query = query.filter(Inspection.assigned_to == assigned_to)

    inspections = query.order_by(Inspection.id.desc()).all()
    return inspections


@router.get("/nearby", response_model=list[NearbyInspectionRead])
def get_nearby_inspections(
    lat: float,
    lng: float,
    radius_meters: float = Query(default=1000, gt=0, le=50000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sql = """
        SELECT
            i.id,
            i.inspection_number,
            i.title,
            i.description,
            i.category_id,
            i.priority,
            i.status,
            i.address,
            i.latitude,
            i.longitude,
            i.created_by,
            i.assigned_to,
            i.created_at,
            i.updated_at,
            ST_DistanceSphere(
                i.location,
                ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)
            ) AS distance_meters
        FROM inspections i
        WHERE ST_DWithin(
            i.location::geography,
            ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
            :radius_meters
        )
    """

    params = {
        "lat": lat,
        "lng": lng,
        "radius_meters": radius_meters,
    }

    if current_user.role == UserRole.INSPECTOR:
        sql += " AND i.created_by = :current_user_id "
        params["current_user_id"] = current_user.id

    elif current_user.role == UserRole.CONTRACTOR:
        sql += " AND i.assigned_to = :current_user_id "
        params["current_user_id"] = current_user.id

    sql += " ORDER BY distance_meters ASC "

    result = db.execute(text(sql), params)
    rows = result.mappings().all()

    return [NearbyInspectionRead(**row) for row in rows]

@router.get("/{inspection_id}", response_model=InspectionRead)
def get_inspection(
    inspection_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    inspection = db.query(Inspection).filter(Inspection.id == inspection_id).first()
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found.")

    if current_user.role == UserRole.INSPECTOR and inspection.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this inspection.")

    if current_user.role == UserRole.CONTRACTOR and inspection.assigned_to != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this inspection.")

    return inspection


@router.patch("/{inspection_id}", response_model=InspectionRead)
def update_inspection(
    inspection_id: int,
    payload: InspectionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    inspection = db.query(Inspection).filter(Inspection.id == inspection_id).first()
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found.")

    if current_user.role == UserRole.INSPECTOR and inspection.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this inspection.")

    if current_user.role == UserRole.CONTRACTOR:
        if inspection.assigned_to != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to update this inspection.")
        allowed_fields = {"status", "description"}
        update_data = payload.model_dump(exclude_unset=True)
        for field in update_data:
            if field not in allowed_fields:
                raise HTTPException(
                    status_code=403,
                    detail="Contractors can only update status and description."
                )
    else:
        update_data = payload.model_dump(exclude_unset=True)

    if "category_id" in update_data:
        category = db.query(Category).filter(Category.id == update_data["category_id"]).first()
        if not category:
            raise HTTPException(status_code=400, detail="Invalid category_id.")

    if "assigned_to" in update_data and update_data["assigned_to"] is not None:
        assignee = db.query(User).filter(User.id == update_data["assigned_to"]).first()
        if not assignee:
            raise HTTPException(status_code=400, detail="Invalid assigned_to user id.")

    for field, value in update_data.items():
        if field not in {"latitude", "longitude"}:
            setattr(inspection, field, value)

    new_latitude = update_data.get("latitude", inspection.latitude)
    new_longitude = update_data.get("longitude", inspection.longitude)

    if "latitude" in update_data:
        inspection.latitude = update_data["latitude"]

    if "longitude" in update_data:
        inspection.longitude = update_data["longitude"]

    if new_latitude is not None and new_longitude is not None:
        inspection.location = WKTElement(
            f"POINT({float(new_longitude)} {float(new_latitude)})",
            srid=4326
        )

    db.commit()
    db.refresh(inspection)

    return inspection


@router.delete("/{inspection_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inspection(
    inspection_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.SUPERVISOR)),
):
    inspection = db.query(Inspection).filter(Inspection.id == inspection_id).first()
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found.")

    db.delete(inspection)
    db.commit()