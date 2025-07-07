from typing import Optional

from pydantic import BaseModel


class order_line(BaseModel):
    order_id: int
    product_id: int
    quantity: int
    unit_price: float
    subtotal: float

    def calculate_subtotal(self):
        if self.quantity is not None and self.unit_price is not None:
            self.subtotal = self.quantity * self.unit_price
        return self.subtotal
