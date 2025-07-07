from typing import Optional, List
from pydantic import BaseModel, Field


class product(BaseModel):
    product_name: str = Field(max_length=32)
    product_type: str = Field(max_length=32)
    kerat: int
    main_factor_type: str = Field(max_length=32)
    weight: float
    price_per_gram: float
    labour_cost: float
    image_path: str

    def calculate_total_price(self):
        if self.price_per_gram is not None and self.labour_cost is not None and self.weight is not None:
            total_price = (self.price_per_gram * self.weight) + self.labour_cost
        else:
            total_price = None
        return total_price


class addNewProduct(product):
    quantity: int
    branch_id: int


class search_productById(product):
    quantity: int
    discount: float


class productsList(BaseModel):
    product_id: int
    product_name: str = Field(max_length=32)
    product_type: str = Field(max_length=32)
    image_path: str
    deleted: bool


class get_All_product(BaseModel):
    products: List[productsList]

class UpdateProductModel(BaseModel):
    name: Optional[str] = None
    weight: Optional[float] = None
    price_per_gram: Optional[float] = None
    labour_cost: Optional[float] = None
    discount: Optional[float] = None

class FilterProduct(BaseModel):
    type: Optional[List[str]] = None
    max_price: Optional[float] = None
    min_price: Optional[float] = None