from typing import Optional
from pydantic import BaseModel

class purchase_order_line(BaseModel):
    Purchase_Order: Optional[int] = None
    Product_id: int
    quantity: int
    unit_price: float

    def calculate_subtotal(self):
        if self.quantity is not None and self.unit_price is not None:
            self.subtotal = self.quantity * self.unit_price
        return self.subtotal

