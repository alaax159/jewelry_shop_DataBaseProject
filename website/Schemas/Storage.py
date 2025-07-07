from datetime import date, datetime

from pydantic import BaseModel, Field


class b_storage(BaseModel):
    storage_id: int
    capacity: int
    amount: int
    last_inventory_check: datetime = Field(default_factory=datetime.utcnow)