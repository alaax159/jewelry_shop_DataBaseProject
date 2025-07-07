from datetime import date, datetime
from pydantic import BaseModel, Field

class supplier(BaseModel):
    Supplier_id: int
    first_name: str
    middle_name: str
    last_name: str
    email: str
    sup_password: int
    street_num: int
    street_name: str
    city: str
    zip_code: str

