from pydantic import BaseModel, Field
from typing import Literal
from datetime import date, datetime



class Cart(BaseModel):
    total: float
    last_modified: date

class cart_creation(Cart):
    acc_id: int


class cart_returned(cart_creation):
    cart_id: int
    class Config:
        from_attributes = True