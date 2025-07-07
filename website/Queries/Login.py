from datetime import datetime
from databaseConnect import connect_db


def login(account):
    conn = connect_db()
    cursor = conn.cursor()

    try:
        email = account.email
        print(email)
        cursor.execute(
            """SELECT * FROM p_account A where A.email = %s""", (email,))
        conn.commit()
        row = cursor.fetchone()
        if not row:
            return "account does not exist"
        else:
            response.set_cookie("acc_id", str(row[0]), httponly=False)
            response.set_cookie("role", row[14], httponly=False)
            return {"message": f"Logged in as {row[0]}, {row[14]}"}
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}
    finally:
        cursor.close()
        conn.close()

