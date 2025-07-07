from pydantic import BaseModel,Field
from datetime import datetime,date


class purchase_order(BaseModel):
    Purchase_Order_id: int
    Order_date: date
    Purchase_Order_status: str
    total_cost: float
    expected_delivery: date
    created_at: datetime = Field(default_factory=datetime.utcnow)
    Supplier_id: int
    branch_id: int
