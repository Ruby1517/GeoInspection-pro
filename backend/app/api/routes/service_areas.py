from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.auth_deps import get_current_user
from app.api.deps import get_db
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.inspection import InspectionRead
from app.schemas.service_area import ServiceAreaRead

router = APIRouter(prefix="/service-areas", tags=["Service Areas"])


@router.get("/", response_model=list[ServiceAreaRead])
def list_service_areas(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sql = """
        SELECT
            id,
            name,
            description,
            ST_AsText(boundary) AS boundary_wkt,
            created_at
        FROM service_areas
        ORDER BY id ASC
    """
    rows = db.execute(text(sql)).mappings().all()
    return [ServiceAreaRead(**row) for row in rows]


@router.get("/{service_area_id}/inspections", response_model=list[InspectionRead])
def get_inspections_in_service_area(
    service_area_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service_area_exists = db.execute(
        text("SELECT id FROM service_areas WHERE id = :id"),
        {"id": service_area_id},
    ).first()

    if not service_area_exists:
        raise HTTPException(status_code=404, detail="Service area not found.")

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
            i.updated_at
        FROM inspections i
        JOIN service_areas sa
          ON ST_Within(i.location, sa.boundary)
        WHERE sa.id = :service_area_id
    """

    params = {"service_area_id": service_area_id}

    if current_user.role == UserRole.INSPECTOR:
        sql += " AND i.created_by = :current_user_id "
        params["current_user_id"] = current_user.id

    elif current_user.role == UserRole.CONTRACTOR:
        sql += " AND i.assigned_to = :current_user_id "
        params["current_user_id"] = current_user.id

    sql += " ORDER BY i.id DESC "

    rows = db.execute(text(sql), params).mappings().all()
    return [InspectionRead(**row) for row in rows]