from datetime import datetime
from pydantic import BaseModel, Field


class order_(BaseModel):
    order_id: int
    order_status: str
    order_price: float
    discount: int
    payment_method: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    customer_id: int

class order_Item(BaseModel):
    order_id: int

class order_ratings(BaseModel):
    order_id: int
    product_id: int
    rating: int