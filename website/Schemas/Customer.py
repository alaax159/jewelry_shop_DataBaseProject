from pydantic import BaseModel, Field
from datetime import date
from Schemas.account import account_create
from typing import Optional

class customer_creation(account_create):
    pass


class customer_returned(customer_creation):
    customer_id: int = Field(...)
    is_verified: bool = Field(default=False)
    wallet_balance: float = Field(default=0.0)
    visa_num: str = Field(max_length=16, min_length=16)
    vcc: int
    name_on_card: str
    Expiration_date: date
class customer_payment(BaseModel):
    acc_id_n: int
    fullName: str
    email: str
    phone: Optional[str] = None
    address: str
    cardNumber: str
    expiry: str
    cvv: str

class add_customer_balance(BaseModel):
    acc_id_n: int
    fullName: str
    email: str
    phone: Optional[str] = None
    address: str
    cardNumber: str
    expiry: str
    cvv: str
    amount_n: int

class rating_customer(BaseModel):
    order_id: str
    product_id: str