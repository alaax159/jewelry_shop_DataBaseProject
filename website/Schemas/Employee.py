from datetime import datetime, date
from pydantic import BaseModel, Field
from account import account


class employee(BaseModel, account):
    position: str = Field(..., max_length=32)
    salary: float = Field(..., max_length=64)
    hired_date: date = Field(...)
    branch_id: int = Field(...)
    Manager_id: int = Field(...)


class employee_create(employee):
    branch_id: int = Field(...)#work at this branch
    hire_date: datetime = Field(default_factory=datetime.utcnow)


class employee_returned(employee):
    emp_id: int = Field(...)
