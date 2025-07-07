from pydantic import BaseModel

class store_product(BaseModel):
    storge_id: int
    product_id: int
    quantity: int
