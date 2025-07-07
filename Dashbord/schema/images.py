from pydantic import BaseModel

class image(BaseModel):
    product_id: int
    image_path: str
