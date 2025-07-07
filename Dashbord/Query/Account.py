from datetime import datetime
from databaseConnect import connect_db
from fastapi import HTTPException
# ################################################## register a new account #################################################################
def create_customer(customer):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """INSERT INTO p_account 
            (user_name, first_name, last_name, age, email, acc_password,
              gender, date_of_birth, created_at,role)
             VALUES ( %s, %s, %s, %s, %s, %s, %s, %s, %s,%s)""",
            (
                customer.user_name,
                customer.first_name,
                customer.last_name,
                customer.age,
                customer.email,
                customer.acc_password,
                customer.gender,
                customer.date_of_birth,
                datetime.utcnow(),
                'customer'
            ))

        acc_id = cursor.lastrowid
        cursor.execute(
            """INSERT INTO customer (acc_id) VALUES (%s)""",
            (acc_id,)
        )
        conn.commit()
        return "customer created"
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}
    finally:
        cursor.close()
        conn.close()
#################################################################################################################################################
# ################################################################ login ########################################################################

async def login(account):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        email = account.email
        password = account.password
        cursor.execute("""SELECT * FROM p_account A WHERE A.email = %s""", (email,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Email not found.")
        if row[6] == password:
            return row
        else:
            raise HTTPException(status_code=401, detail="Incorrect password.")
    except HTTPException as he:
        raise he
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()