from datetime import date
from pydantic import BaseModel


class expense_tracking(BaseModel):
    expense_id: int
    expense_type: str
    amount: float
    expense_date: date
    Transaction_id: int
    branch_id: int
