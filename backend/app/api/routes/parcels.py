from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.auth_deps import get_current_user
from app.api.deps import get_db
from app.models.user import User
from app.schemas.parcel import ParcelRead

router = APIRouter(prefix="/parcels", tags=["Parcels"])


@router.get("/", response_model=list[ParcelRead])
def list_parcels(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = db.execute(
        text(
            """
            SELECT
                id,
                apn,
                zoning_code,
                owner_name,
                address,
                description,
                ST_AsText(boundary) AS boundary_wkt,
                created_at
            FROM parcels
            ORDER BY id ASC
            """
        )
    ).mappings().all()

    return [ParcelRead(**row) for row in rows]