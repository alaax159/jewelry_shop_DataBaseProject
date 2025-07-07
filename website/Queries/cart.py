from datetime import datetime
from databaseConnect import connect_db
from fastapi import HTTPException, FastAPI, Request, Depends
def create_cart(cart):
    # customer_id = Request.cookies.get("customer_id")
    # if not customer_id:

    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            f"""INSERT INTO cart 
            (acc_id, 0, NOW())
             VALUES ({cart.acc_id}, {cart.total}, {cart.last_modified})""")
        conn.commit()
        cart_id = cursor.lastrowid
        cursor.execute(f"""INSERT INTO cart VALUES ({cart.cart_id})values({cart.cart_id})""")
        conn.commit()
        return cart
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}
    finally:
        cursor.close()
        conn.close()