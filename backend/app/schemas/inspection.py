from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.models.enums import InspectionPriority, InspectionStatus


class InspectionCreate(BaseModel):
    title: str
    description: str | None = None
    category_id: int
    priority: InspectionPriority = InspectionPriority.MEDIUM
    status: InspectionStatus = InspectionStatus.OPEN
    address: str | None = None
    latitude: Decimal | None = None
    longitude: Decimal | None = None
    assigned_to: int | None = None


class InspectionUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category_id: int | None = None
    priority: InspectionPriority | None = None
    status: InspectionStatus | None = None
    address: str | None = None
    latitude: Decimal | None = None
    longitude: Decimal | None = None
    assigned_to: int | None = None


class InspectionRead(BaseModel):
    id: int
    inspection_number: str
    title: str
    description: str | None = None
    category_id: int
    parcel_id: int | None = None
    priority: InspectionPriority
    status: InspectionStatus
    address: str | None = None
    latitude: Decimal | None = None
    longitude: Decimal | None = None
    created_by: int
    assigned_to: int | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class NearbyInspectionRead(BaseModel):
    id: int
    inspection_number: str
    title: str
    description: str | None = None
    category_id: int
    parcel_id: int | None = None
    priority: InspectionPriority
    status: InspectionStatus
    address: str | None = None
    latitude: Decimal | None = None
    longitude: Decimal | None = None
    created_by: int
    assigned_to: int | None = None
    created_at: datetime
    updated_at: datetime
    distance_meters: float

    model_config = ConfigDict(from_attributes=True)