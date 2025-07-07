from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class order_(BaseModel):
    order_id: int
    order_status: str
    order_price: float
    payment_method: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

