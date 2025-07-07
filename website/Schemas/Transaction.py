from datetime import date
from pydantic import BaseModel


class Transaction(BaseModel):
    Transaction_id: int
    Transaction_type: str
    Transaction_amount: float
    related_table: str
    transaction_method: str
    transaction_status: str
    transaction_date: date
