from pydantic import BaseModel, Field
from typing import Literal
from datetime import date, datetime

# THE  three point (...) it will induct that the filed is required
class account(BaseModel):
    user_name: str = Field(..., max_length=32)
    first_name: str =Field(..., max_length=32)
    last_name: str =Field(..., max_length=32)
    email: str #checking if the input is email format
    gender: Literal["male", "female"]
    date_of_birth: date


    @property
    def age(self) -> int:
        today = date.today()
        return (
                today.year - self.date_of_birth.year
                - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
        )
class account_create(account):
    acc_password: str = Field(..., max_length=16)


class account_returned(account):
    acc_id: int
    role: str =Field(..., max_length=16)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    street_num: int
    street_name: str = Field(max_length=32)
    city: str =Field( max_length=32)
    zip_code: int

class account_login(BaseModel):
    email: str
    password: str
class account_id_returned(BaseModel):
    acc_id: int

class customer(BaseModel):
    acc_id: str
    amount: int