from pydantic import BaseModel, Field
from datetime import datetime

class jewelry_branch(BaseModel):
    street_num: int = Field(...)
    street_name: str = Field(...)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class jewelry_branch_create(jewelry_branch):
    storage_id: int = Field(...)
