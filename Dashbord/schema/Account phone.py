from pydantic import BaseModel

class account_phone(BaseModel):
    phone_id: int
    acc_id: int
    phone_num: int

    