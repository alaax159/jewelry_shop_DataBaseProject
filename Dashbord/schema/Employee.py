from datetime import datetime, date
from typing import Optional, List

from pydantic import BaseModel, Field
from schema.account import account_create,account_returned


class employee(account_create):
    position: str = Field(..., max_length=32)
    salary: float = Field(...)
    hired_date: date = Field(...)



class employee_create(employee):
    Branch_id: int = Field(...)



class employee_returned(account_returned):
    position: str = Field(..., max_length=32)
    salary: float = Field(...)
    hired_date: date = Field(...)
    branch_id: int
    Manager_id: int
    phone_num: str
    age: int


class EmployeeList(BaseModel):
    emp_id: int = Field(...)
    user_name: str = Field(...)
    position: str = Field(...)

class get_All_employee(BaseModel):
    employeeList: List[EmployeeList]

class update_employee(BaseModel):
    position : Optional[str] = None

class maxSalary(BaseModel):
    emp_id: int = Field(...)
    user_name: str = Field(...)
    position: str = Field(...)
    salary: float = Field(...)

class get_maxSalaryPos(BaseModel):
    employeeList: List[maxSalary]

class sumAndAverage_salary(BaseModel):
    position: str
    sumSalary: float
    avgSalary: float
    numEmployees: int
class get_sum_and_average_salary(BaseModel):
    sumAndAverageList: List[sumAndAverage_salary]

class EditEmployee(BaseModel):
    user_name: Optional[str] = None
    email: Optional[str] = None
    position: Optional[str] = None
    salary: Optional[float] = None
    street_num: Optional[int] = None
    street_name: Optional[str] = None
    city: Optional[str] = None
    zip_code: Optional[str] = None
    phone_num: Optional[str] = None


