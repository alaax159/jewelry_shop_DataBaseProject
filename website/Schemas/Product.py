from typing import Optional
from pydantic import BaseModel


class Product(BaseModel):
    product_id: int
    product_name: str
    kerat: int
    main_factory_type: str
    weight: float
    labour_cost: Optional[float]
    product_type: str
class product_type(BaseModel):
    product_type_defined: str

class Product_returned(Product):
    image_id: int
    product_id: Optional[int]
    image_path: Optional[str]

class product_id_returned(BaseModel):
    product_id: int