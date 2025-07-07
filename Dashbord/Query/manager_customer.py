from datetime import datetime
from databaseConnect import connect_db
from fastapi import HTTPException


# ############################################################## get all customer ######################################
def get_all_customers(start, end):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """select c.acc_id,p.user_name,p.first_name,p.last_name,c.Blocked from customer c join p_account p on c.acc_id = p.acc_id;""")
        rows = cursor.fetchall()
        if rows is None:
            raise HTTPException(status_code=404, detail="Error fetching customers.")
        start_index = start
        end_index = end
        paginated_rows = rows[start_index:end_index]
        result = [
            {
                "acc_id": row[0],
                "user_name": row[1],
                "first_name": row[2],
                "last_name": row[3],
                "Blocked": row[4]
            }
            for row in paginated_rows
        ]
        return {
            "customers": result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()


# ######################################################################################################################
# ############################################ get customer by id ######################################################

def get_customersByID(customer_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select c.acc_id,p.user_name,p.first_name,p.last_name,p.age,p.email,p.acc_password,p.street_name,p.street_num,p.city,p.gender,
p.date_of_birth,c.is_verified,c.wallet_balance,c.visa_num,c.vcc,p.zip_code,ap.phone_num from customer c join p_account p on c.acc_id = p.acc_id
      JOIN account_phone ap on ap.acc_id = p.acc_id   where c.acc_id = %s;""",
                       (customer_id,))
        rows = cursor.fetchone()
        if rows is None:
            raise HTTPException(status_code=404, detail="Error fetching customer.")
        return {
            "acc_id": rows[0],
            "user_name": rows[1],
            "first_name": rows[2],
            "last_name": rows[3],
            "age": rows[4],
            "email": rows[5],
            "acc_password": rows[6],
            "street_name": rows[7],
            "street_num": rows[8],
            "city": rows[9],
            "gender": rows[10],
            "date_of_birth": rows[11],
            "is_verified": rows[12],
            "wallet_balance": rows[13],
            "visa_num": rows[14],
            "vcc": rows[15],
            "zip_code": rows[16],
            "phone_num": rows[17],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()


# ######################################################################################################################
# ################################### number of customer for every city ################################################

def customerCity():
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select count(*) as numberOfCustomer, p.city from customer c join p_account p on c.acc_id = p.acc_id
                            group by p.city;""")
        rows = cursor.fetchall()
        if rows is None:
            raise HTTPException(status_code=404, detail="Error fetching customerCity.")
        result = [
            {
                "city": row[1],
                "numberOfCustomer": row[0]
            }
            for row in rows
        ]
        return {
            "result": result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()


# #####################################################################################################################
# #########################################total number of customer####################################################

def total_numberOfCustomers():
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select count(*) as numberOfCustomer FROM customer""")
        row = cursor.fetchone()
        if row is None:
            return {"result": 0, }
        return {"result": row[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()


# ######################################################################################################################
# ################################# number of new customer #############################################
def number_of_Newcustomers():
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select count(*) from customer c 
                        join p_account a on c.acc_id = a.acc_id
                        where
                        date_format(a.created_at,'%Y-%m') = date_format(CURDATE(),'%Y-%m');""")
        count = cursor.fetchone()
        if count is None:
            return {"result": 0}
        return {"result": count[0]}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()


def number_of_customers():
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select count(*) from customer""")
        row = cursor.fetchone()
        if row is None:
            return {"result": 0}
        return {"result": row[0]}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()


# ######################################################################################################################
# ########################################## find the number of customer per gender ####################################################

def count_customersGender():
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select count(*),a.gender from customer c 
                        join p_account a on a.acc_id = c.acc_id
                        group by a.gender;""")
        rows = cursor.fetchall()
        if rows is None:
            return {
                "result": [
                    {
                        "gender": "male",
                        "count": 0
                    },
                    {
                        "gender": "Female",
                        "count": 0
                    },
                ],
            }
        result = [
            {
                "gender": rows[0][1],
                "count": rows[0][0]
            }, {
                "gender": rows[1][1],
                "count": rows[1][0]
            }
        ]
        return {
            "result": result,
        }
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

# ######################################################################################################################
# ############################################## number verified #######################################################

def count_customersVerified_OrNot():
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""SELECT count(*),c.is_verified from customer c
        GROUP BY c.is_verified order by c.is_verified;""")
        rows = cursor.fetchall()
        if rows is None:
            return {
                "not_verified": 0,
                "is_verified": 0
            }
        return {
            "not_verified": rows[0][0],
            "is_verified": rows[1][0]
        }
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

# ######################################################################################################################
# #################################### find the unique Customer ########################################################

def uniqueCustomer():
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""SELECT DISTINCT c.acc_id, a.first_name,a.last_name, a.city,SUM(o.order_price) as orderPrice
                            FROM customer c
                            join p_account a ON a.acc_id = c.acc_id
                            JOIN order_ o ON c.acc_id = o.customer_id
                            GROUP BY c.acc_id, a.first_name, a.city
                            HAVING SUM(o.order_price) > (
                                SELECT AVG(order_price)
                                FROM order_
                            ) ORDER BY a.city;""")
        rows = cursor.fetchall()
        if rows is None:
            return {"result": 0}
        result = [
            {
                "customer_id": row[0],
               "first_name": row[1],
               "last_name": row[2],
               "city": row[3],
               "order_price": row[4],
            }
            for row in rows
        ]
        return {"result": result}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

# ######################################################################################################################
# ############################################ get customer Orders #####################################################

def customerOrders(customer_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select  o.order_id,o.order_price,o.order_status,o.payment_method,o.delivery_data,o.created_at from customer c join order_ o on c.acc_id = o.customer_id 
                        where c.acc_id = %s; """,(customer_id,))
        rows = cursor.fetchall()
        if rows is None:
            return {"result": 0}
        result = [
            {
                "order_id": row[0],
                "order_price": row[1],
                "order_status": row[2],
                "payment_method": row[3],
                "delivery_data": row[4],
                "created_at": row[5]
            }
            for row in rows
        ]
        return {"result": result}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()
# ######################################################################################################################
# ######################################### get customer total money spent #############################################

def get_totalMoney(customer_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select sum(o.order_price) from customer c join order_ o on c.acc_id = o.customer_id 
                            where c.acc_id = %s; """, (customer_id,))
        row = cursor.fetchone()
        if row is None:
            return {"result": 0}

        return {"result": row[0]}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

# ######################################################################################################################
# ################################################ Block/unBlock customer ######################################################

def BlockOrUnBlock(customer_id,action):
    conn = connect_db()
    cursor = conn.cursor()
    print(customer_id)
    print(action)
    try:
        if action == "block":
            cursor.execute("""UPDATE customer SET Blocked = 1 
            WHERE acc_id = %s""", (customer_id,))
            conn.commit()
            if cursor.rowcount > 0:
                return True
            else:
                return False
        elif action == "unblock":
            cursor.execute("""UPDATE customer SET Blocked = 0 
            WHERE acc_id = %s""",(customer_id,))
            conn.commit()
            if cursor.rowcount > 0:
                return True
            else:
                return False
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

