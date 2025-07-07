from datetime import datetime, date
from databaseConnect import connect_db
from fastapi import HTTPException

# ################################################### endpoint to get all the order #####################################
def get_orders(start,end):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""SELECT o.order_id,DATE_FORMAT(o.created_at, '%Y-%m-%d') as created_at,o.order_price,o.delivery_data,o.order_status FROM order_ o""")
        rows = cursor.fetchall()
        start_index = start
        end_index = end
        paginated_rows = rows[start_index:end_index]
        orders = [
            {
                "order_id": row[0],
                "created_at": row[1],
                "order_price": row[2],
                "delivery_data": row[3],
                "order_status": row[4]

            }
            for row in paginated_rows
        ]

        result = {
            "orders": orders
        }
        return result
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

# ######################################################################################################################
# ####################################### endpoint to get the order in a spasfic Y###############################
def get_YMorder(Year):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""SELECT DATE_FORMAT(o.created_at, '%Y-%m') AS order_month,
                                COUNT(*) AS total_orders, SUM(o.order_price) AS price
                            FROM 
                                order_ o
                            WHERE
                                DATE_FORMAT(o.created_at, '%Y') = %s
                            GROUP BY 
                                order_month
                            ORDER BY 
                                order_month;""", (Year,))
        rows = cursor.fetchall()
        if rows is None:
            raise HTTPException(status_code=404, detail="manager not found")
        YMOrder = [
            {
                "order_month": row[0],
                "total_orders": row[1],
                "price": row[2]
            }
            for row in rows
        ]
        result = {
            "YMOrder": YMOrder
        }
        return result
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()
# ######################################################################################################################
# ################################################### get the number of order based on the status ######################

def get_order_status():
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select o.order_status,count(*) as number_order from order_ o
                            group by
                            o.order_status;""")
        rows = cursor.fetchall()
        if rows is None:
            raise HTTPException(status_code=404, detail="manager not found")
        order_status = [
            {
                "order_status": row[0],
                "number_order": row[1]
            }
            for row in rows
        ]
        result = {
            "order_status": order_status
        }
        return result
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()
# ######################################################################################################################
# ################################################# Query to maek the order delivered ##################################
def make_deliver(order_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""update order_ set order_status = 'Delivered'
                            where
                            order_id = %s AND
                            order_status = 'Shipped' AND
                            delivery_data <= CURDATE();""",(order_id,))
        conn.commit()
        if cursor.rowcount > 0:
            return True
        else:
            return False
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()
# ######################################################################################################################
# #################################### Query to make the status Completed ##############################################
def make_Completed(order_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""update order_ set order_status = 'Completed'
                            where
                            order_id = %s AND
                            order_status = 'Delivered' AND
                            delivery_data + INTERVAL '7 day' <= CURDATE();""",(order_id,))
        conn.commit()
        if cursor.rowcount > 0:
            return True
        else:
            return False
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

# ######################################################################################################################
# #################################### Query to make the status shipped ##############################################
def make_shipping(order_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""update order_ set order_status = 'Shipped'
                            where
                            order_id = %s AND
                            order_status = 'Pending'""",(order_id,))
        conn.commit()
        if cursor.rowcount > 0:
            cursor.close()
            conn.close()
            return True
        else:
            cursor.close()
            conn.close()
            return False
    except HTTPException as e:
        conn.rollback()
        raise e

# ######################################################################################################################
# ############################################### get_allBorders ######################################################
def get_allBranch_order(manager_id,start,end):
    conn = connect_db()
    cursor = conn.cursor()
    print(manager_id)
    print(start)
    print(end)
    try:
        cursor.execute("""select po.Purchase_Order_id,po.Purchase_Order_status,po.total_cost,po.expected_delivery,DATE_FORMAT(po.created_at, '%Y-%m-%d') as created_at from purchase_order po
         join jewelry_branch j on po.branch_id = j.branch_id 
         join manager m on m.Manager_id = j.Manager_id
        where 
        m.Manager_id = %s;""",(manager_id,))
        rows = cursor.fetchall()
        if rows is None:
            raise HTTPException(status_code=404, detail="manager not found")
        start_index = start
        end_index = end
        paginated_rows = rows[start_index:end_index]
        orders = [
            {
                "Purchase_Order_id": row[0],
                "Purchase_Order_status": row[1],
                "total_cost": row[2],
                "expected_delivery": row[3],
                "created_at": row[4]

            }
            for row in paginated_rows
        ]
        print(orders)
        return {
            "orders": orders
        }
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

# ######################################################################################################################
# ####################################### endpoint to get the order in a spasfic Y###############################
def get_YMorderB(manager_id,Year):
    conn = connect_db()
    cursor = conn.cursor()
    print(Year)
    print(manager_id)
    try:
        cursor.execute("""SELECT DATE_FORMAT(bo.created_at, '%Y-%m') AS order_month,
                                COUNT(*) AS total_orders, SUM(bo.total_cost) AS price
                            FROM 
                                purchase_order bo
                                join jewelry_branch j on bo.branch_id = j.branch_id 
                                join manager m on m.Manager_id = j.Manager_id 
                            WHERE
                                DATE_FORMAT(bo.created_at, '%Y') = %s AND
                                 m.Manager_id = %s
                            GROUP BY 
                                order_month
                            ORDER BY 
                                order_month;""", (Year, manager_id))
        rows = cursor.fetchall()
        print(rows)
        if rows is None:
            raise HTTPException(status_code=404, detail="manager not found")
        YMOrder = [
            {
                "order_month": row[0],
                "total_orders": row[1],
                "price": row[2]
            }
            for row in rows
        ]
        result = {
            "YMOrder": YMOrder
        }
        return result
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

# ######################################################################################################################
# ############################################# get Total Number OF Orders #############################################
def get_TotalNumberOFOrders():
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("select count(*) from order_")
        rows = cursor.fetchall()
        if rows is None:
            raise HTTPException(status_code=404, detail="order not found")
        cursor.close()
        conn.close()
        return {"numberOfOrders": rows[0][0]}
    except HTTPException as e:
        conn.rollback()
        raise e


def get_TotalNumberOFOrdersBranch():
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("select count(*) from purchase_order")
        rows = cursor.fetchall()
        if rows is None:
            raise HTTPException(status_code=404, detail="order not found")
        cursor.close()
        conn.close()
        return {"numberOfOrders": rows[0][0]}
    except HTTPException as e:
        conn.rollback()
        raise e
# ######################################################################################################################
# ################################################# Query to maek the order delivered ##################################
def make_deliver_BranchOrder(Purchase_Order_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""update purchase_order set Purchase_Order_status = 'Delivered'
                            where
                            Purchase_Order_id = %s AND
                            Purchase_Order_status = 'Shipped' AND
                            expected_delivery <= CURDATE();""",(Purchase_Order_id,))
        conn.commit()
        if cursor.rowcount > 0:
            return True
        else:
            return False
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()
# ######################################################################################################################
# #################################### Query to make the status Completed ##############################################
def make_Completed_BranchOrder(Purchase_Order_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""update purchase_order set Purchase_Order_status = 'Completed'
                            where
                            Purchase_Order_id = %s AND
                            Purchase_Order_status = 'Delivered' AND
                            expected_delivery + INTERVAL '7 day' <= CURDATE();""",(Purchase_Order_id,))
        conn.commit()
        if cursor.rowcount > 0:
            return True
        else:
            return False
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

# ######################################################################################################################
# #################################### Query to make the status shipped ##############################################
def make_shipping_BranchOrder(Purchase_Order_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""update purchase_order set Purchase_Order_status = 'Shipped'
                            where
                            Purchase_Order_id = %s AND
                            Purchase_Order_status = 'Pending'""",(Purchase_Order_id,))
        conn.commit()
        if cursor.rowcount > 0:
            cursor.close()
            conn.close()
            return True
        else:
            cursor.close()
            conn.close()
            return False
    except HTTPException as e:
        conn.rollback()
        raise e

# ######################################################################################################################
# ############################################# ###################################
def numberOfOrderGraterThanAvg(year):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""SELECT 
                        COUNT(o.order_id) AS numberOrder,
                        SUM(o.order_price) AS price,
                        AVG(o.order_price) AS avg_price,
                        DATE_FORMAT(o.created_at, '%Y-%m') AS order_month
                    FROM 
                        order_ o
                    WHERE
                        DATE_FORMAT(o.created_at, '%Y') = %s
                        AND o.order_price >= (
                            SELECT AVG(order_price) FROM order_
                        )
                    GROUP BY 
                        DATE_FORMAT(o.created_at, '%Y-%m')""",(year,))
        rows = cursor.fetchall()
        if rows is None:
            raise HTTPException(status_code=404, detail="order not found")
        countOrder = [
            {
                "numberOrder": row[0],
                "price": row[1],
                "avg_price": row[2],
                "order_month": row[3]
            }
            for row in rows
        ]
        cursor.close()
        conn.close()
        return {
            "countOrder": countOrder,
        }
    except HTTPException as e:
        conn.rollback()
        raise e
# ######################################################################################################################
# ############################################### #############################################

def numberOfOrderGraterThanAvgBramch(manager_id,year):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""SELECT 
                        COUNT(o.Purchase_Order_id) AS numberOrder,
                        SUM(o.total_cost) AS price,
                        AVG(o.total_cost) AS avg_price,
                        DATE_FORMAT(o.created_at, '%Y-%m') AS order_month
                    FROM 
                        purchase_order o join jewelry_branch j on o.branch_id = j.branch_id 
                    WHERE
                        DATE_FORMAT(o.created_at, '%Y') = %s
                        AND j.Manager_id = %s
                        AND o.total_cost >= (
                            SELECT AVG(total_cost) FROM purchase_order
                        )
                    GROUP BY 
                        DATE_FORMAT(o.created_at, '%Y-%m');""", (year, manager_id))
        rows = cursor.fetchall()
        print(rows)
        if rows is None:
            raise HTTPException(status_code=404, detail="order not found")
        countOrder = [
            {
                "numberOrder": row[0],
                "price": row[1],
                "avg_price": row[2],
                "order_month": row[3]
            }
            for row in rows
        ]
        cursor.close()
        conn.close()
        return {
            "countOrder": countOrder,
        }
    except HTTPException as e:
        conn.rollback()
        raise e
# ######################################################################################################################
# ######################################################################################################################
def get_order_statusB(manager_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select o.Purchase_Order_status,count(*) as number_order from purchase_order o join jewelry_branch j on o.branch_id = j.branch_id
                            where
                            j.Manager_id = %s
                            group by
                            o.Purchase_Order_status""", (manager_id,))
        rows = cursor.fetchall()
        if rows is None:
            raise HTTPException(status_code=404, detail="manager not found")
        order_status = [
            {
                "order_status": row[0],
                "number_order": row[1]
            }
            for row in rows
        ]
        result = {
            "order_status": order_status
        }
        cursor.close()
        conn.close()
        return result
    except HTTPException as e:
        conn.rollback()
        raise e
# ######################################################################################################################
# ######################################## #######################################
def totalProfitToday():
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""SELECT 
                                date_format(created_at,'%Y-%m-%d') AS day,
                                SUM(order_price) AS daily_revenue
                            FROM 
                                order_
                            WHERE 
                                date_format(created_at,'%Y-%m-%d') = date_format(CURRENT_DATE(),'%Y-%m-%d')
                            GROUP BY 
                               date_format(created_at,'%Y-%m-%d');""")
        row = cursor.fetchone()
        print(row)
        if row is None:
            if row is None:
                return {
                    "day": date.today().isoformat(),
                    "ProfitToday": 0
                }
        cursor.close()
        conn.close()
        return {
            "day": row[0],
            "ProfitToday": row[1]
        }
    except HTTPException as e:
        conn.rollback()
        raise e
# ######################################################################################################################
# ######################################## #######################################
def totalProfitThisMonth():
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""SELECT 
                            date_format(created_at,'%Y-%m') AS Month,
                            SUM(order_price) AS daily_revenue
                        FROM 
                            order_
                        WHERE 
                            date_format(created_at,'%Y-%m') = date_format(CURRENT_DATE(),'%Y-%m')
                        GROUP BY 
                           date_format(created_at,'%Y-%m');""")
        row = cursor.fetchone()
        if row is None:
            return {
                "Month": date.today().isoformat(),
                "ProfitMonth": 0
            }
        cursor.close()
        conn.close()
        return {
            "Month": row[0],
            "ProfitMonth": row[1]
        }
    except HTTPException as e:
        conn.rollback()
        raise e
# ######################################################################################################################
# ######################################## #######################################
def totalProfitThisYear():
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""SELECT 
                            date_format(created_at,'%Y') AS Year,
                            SUM(order_price) AS daily_revenue
                        FROM 
                            order_
                        WHERE 
                            date_format(created_at,'%Y') = date_format(CURRENT_DATE(),'%Y')
                        GROUP BY 
                           date_format(created_at,'%Y');""")
        row = cursor.fetchone()
        if row is None:
            return {
                "Year": date.today().isoformat(),
                "ProfitYear": 0
            }
        cursor.close()
        conn.close()
        return {
            "Year": row[0],
            "ProfitYear": row[1]
        }
    except HTTPException as e:
        conn.rollback()
        raise e

# ######################################################################################################################
# ######################################## Order Data #######################################

def get_order_data(order_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select o.order_id,ol.Product_id,ol.quantity,ol.unit_price,ol.subtotal,p.Product_name,p.product_type,p.weight,
        a.user_name,a.first_name,a.email,ap.phone_num,o.created_at,o.order_price,o.delivery_data,o.order_status,o.payment_method,a.acc_id from order_ o 
                            join order_line ol on o.order_id = ol.Order_id
                            join product p on ol.Product_id = p.Product_id
                            join customer c on c.acc_id = o.customer_id
                            join p_account a on a.acc_id = c.acc_id
                            join account_phone ap on a.acc_id = ap.acc_id
                            where
                            o.order_id = %s;""",(order_id,))
        rows = cursor.fetchall()  # Fetch all rows
        if not rows:
            raise HTTPException(status_code=404, detail="Order not found")

        result = {
            "order_id": rows[0][0],
            "created_at": rows[0][12],
            "order_price": rows[0][13],
            "delivery_data": rows[0][14],
            "order_status": rows[0][15],
            "payment_method": rows[0][16],
            "customer_id": rows[0][17],
            "user_name": rows[0][8],
            "first_name": rows[0][9],
            "email": rows[0][10],
            "phone_num": rows[0][11],
            "products": [
                {
                    "product_id": row[1],
                    "quantity": row[2],
                    "unit_price": row[3],
                    "subtotal": row[4],
                    "Product_name": row[5],
                    "product_type": row[6],
                    "weight": row[7]
                }
                for row in rows
            ]
        }

        return {
            "result": result
        }
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

# ######################################################################################################################
# ############################################### total profit #########################################################
def total_profitAndCost(manager_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""SELECT SUM(order_price) FROM order_""")
        profit = cursor.fetchone()[0]
        cursor.execute("""SELECT SUM(po.total_cost) FROM purchase_order po 
        join jewelry_branch j on j.branch_id= po.branch_id WHERE j.Manager_id = %s""",(manager_id,))
        cost = cursor.fetchone()[0]
        if cost is None and profit is None:
            return {
                "profit": 0,
                "cost": 0
            }
        elif cost is None:
            return {
                "profit": profit,
                "cost": 0
            }
        elif profit is None:
            return {
                "profit": 0,
                "cost": cost
            }
        return {
            "profit": profit,
            "cost": cost
        }
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

# ######################################################################################################################
# ############################################## number of quantity per day/month/year #################################

def number_of_quantity_perDay_month_year():
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select sum(ol.quantity) as numberOfProduct,DATE_FORMAT(o.created_at, '%Y') AS orderYear from product p
                            JOIN order_line ol on p.Product_id = ol.Product_id
                            JOIN order_ o on o.order_id = ol.Order_id
                            where
                            date_format(o.created_at,'%Y') = date_format(CURDATE(),'%Y')
                            group by date_format(o.created_at,'%Y');""")
        year = cursor.fetchall()
        if not year:
            yearQ =  0
        else:
            yearQ = year[0][0]
        cursor.execute("""select sum(ol.quantity) as numberOfProduct,DATE_FORMAT(o.created_at, '%Y-%m') AS orderYear from product p
                            JOIN order_line ol on p.Product_id = ol.Product_id
                            JOIN order_ o on o.order_id = ol.Order_id
                            where
                            date_format(o.created_at,'%Y-%m') = date_format(CURDATE(),'%Y-%m')
                            group by date_format(o.created_at,'%Y-%m');""")
        month = cursor.fetchall()
        if not month:
            monthQ = 0
        else:
            monthQ = month[0][0]
        cursor.execute("""select sum(ol.quantity) as numberOfProduct,DATE_FORMAT(o.created_at, '%Y-%m-%d') AS orderYear from product p
                            JOIN order_line ol on p.Product_id = ol.Product_id
                            JOIN order_ o on o.order_id = ol.Order_id
                            where
                            date_format(o.created_at,'%Y-%m-%d') = date_format(CURDATE(),'%Y-%m-%d')
                            group by date_format(o.created_at,'%Y-%m-%d');""")
        day = cursor.fetchall()
        if not day:
            dayQ = 0
        else:
            dayQ = year[0][0]
        result = {
            "dayQ": dayQ,
            "monthQ": monthQ,
            "yearQ": yearQ
        }
        return {
            "result": result
        }
    except HTTPException as http_err:
        conn.rollback()
        raise http_err
    finally:
        cursor.close()
        conn.close()

def topNcoustomersBasedOnMoney(numCustomer):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        numCustomer = int(numCustomer)
        if numCustomer <= 0:
            raise HTTPException(status_code=400, detail="Number of customers must be positive")
        cursor.execute("""SELECT c.acc_id, a.user_name, a.city, SUM(o.order_price) as totalPrice 
                          FROM order_ o 
                          JOIN customer c ON o.customer_id = c.acc_id
                          JOIN p_account a ON a.acc_id = c.acc_id
                          GROUP BY c.acc_id, a.user_name, a.city 
                          ORDER BY totalPrice DESC""")
        customers = cursor.fetchall()
        if not customers:
            raise HTTPException(status_code=404, detail="No customers found")
        numberToStop = customers[:numCustomer]
        result = [
            {
                "acc_id": customer[0],
                "user_name": customer[1],
                "city": customer[2],
                "totalPrice": float(customer[3]) if customer[3] is not None else 0.0,
            }
            for customer in numberToStop
        ]
        return {"result": result}
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid number of customers specified")
    except HTTPException as e:
        conn.rollback()
        raise e
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()