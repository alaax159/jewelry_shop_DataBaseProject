from pydantic import BaseModel


class Payroll(BaseModel):
    payroll_id: int
    emp_id: int
    amount: float
    month_year: str
    payment_status: str
    Transaction_id: int
