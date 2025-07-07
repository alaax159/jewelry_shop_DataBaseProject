from pydantic import BaseModel, Field
from datetime import date
from schema.account import account_create

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
