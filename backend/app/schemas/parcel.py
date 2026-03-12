from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ParcelRead(BaseModel):
    id: int
    apn: str
    zoning_code: str | None = None
    owner_name: str | None = None
    address: str | None = None
    description: str | None = None
    boundary_wkt: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)