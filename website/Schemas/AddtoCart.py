from pydantic import BaseModel


class AddToCartRequest(BaseModel):
    product_id: str
    acc_id: int