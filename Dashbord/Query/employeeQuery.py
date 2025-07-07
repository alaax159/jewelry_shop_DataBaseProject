from datetime import datetime, date
from databaseConnect import connect_db
from fastapi import HTTPException

async def retrieve_all_productsEmp(branch_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT DISTINCT P.product_id, P.Product_name, P.product_type, pi.image_path
            FROM product P
            JOIN store_product SP ON P.product_id = SP.product_id
            JOIN product_image pi ON P.product_id = pi.product_id
            JOIN b_storage S ON S.storage_id = SP.storge_id
            JOIN jewelry_branch JP ON JP.storage_id = S.storage_id
            WHERE JP.branch_id = %s;
        """, (branch_id,))
        rows = cursor.fetchall()

        if not rows:
            raise HTTPException(status_code=404, detail="No products found for this branch.")

        products = [
            {
                "product_id": row[0],
                "product_name": row[1],
                "product_type": row[2],
                "image_path": row[3],
            }
            for row in rows
        ]

        return {
            "products": products
        }

    except HTTPException as http_err:
        conn.rollback()
        raise http_err
    except Exception as db_err:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(db_err)}")
    finally:
        cursor.close()
        conn.close()

def get_Employee_id(emp_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""SELECT 
                            e.position,
                            e.salary,
                            e.hired_at,
                            e.branch_id,
                            e.Manager_id 
                            FROM employee eWHERE e.emp_id = %s""",
                       (emp_id,))
        row = cursor.fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="employee not found")
        print(row)
        result = {
            "position": row[0],
            "salary": row[1],
            "hired_date": row[2],
            "branch_id": row[3],
            "Manager_id": row[4]
        }
        return result
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()