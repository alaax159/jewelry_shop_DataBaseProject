from datetime import datetime
from databaseConnect import connect_db


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
        conn.commit()
        acc_id = cursor.lastrowid
        cursor.execute(
            """INSERT INTO customer (acc_id, wallet_balance, points) VALUES (%s, 0, 0)""",
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
