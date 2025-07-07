from pydantic import BaseModel


class branch_phone(BaseModel):
    phone_id: int
    branch_id: int
    phone_num: int
