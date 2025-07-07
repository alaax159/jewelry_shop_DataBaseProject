from datetime import datetime
from pydantic import BaseModel, Field
from account import account


class manager(BaseModel, account):
    salary: float


class manager_create(manager):
    branch_id: int = Field(...)#manage this branch
    hire_date: datetime = Field(default_factory=datetime.utcnow)


class manager_returned(manager):
    manager_id: int
