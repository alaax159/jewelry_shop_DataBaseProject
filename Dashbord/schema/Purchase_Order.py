from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime, date
from schema.Purchase_order_line import purchase_order_line

class purchase_order(BaseModel):
    Purchase_Order_id: Optional[int] = None
    Purchase_Order_status: str
    total_cost: Optional[float] = None
    expected_delivery: date
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    branch_id: Optional[int] = None

class makeOrder(purchase_order):
    order_line: list[purchase_order_line]