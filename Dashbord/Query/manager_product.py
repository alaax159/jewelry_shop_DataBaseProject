from databaseConnect import connect_db
from datetime import datetime
from fastapi import HTTPException

# ################################################################## add new product to the database #########################################

def get_managerBranches(manager_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select jb.branch_id
                            FROM manager m
                            JOIN jewelry_branch jb ON jb.Manager_id = m.Manager_id
                            WHERE
                            m.Manager_id = %s""", (manager_id,))
        rows = cursor.fetchall()

        if rows is None:
            raise HTTPException(status_code=404,detail="No branches found")

        Branches = [
            {
                "branch": row[0]
            }
            for row in rows
        ]
        cursor.close()
        conn.close()
        return {
            "Branches": Branches
        }
    except Exception as e:
        raise HTTPException(status_code=404,detail=str(e))




def add_new_product(product):
    conn = connect_db()
    cursor = conn.cursor()
    print(product)
    try:
        cursor.execute("""INSERT INTO product 
                    (Product_name, product_type, kerat, main_factor_type, weight, price_per_gram, total_price, labour_cost, discount, deleted) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) """, (
            product.product_name,
            product.product_type,
            product.kerat,
            product.main_factor_type,
            product.weight,
            product.price_per_gram,
            product.calculate_total_price(),
            product.labour_cost,
            0,
            0
        ))

        product_id = cursor.lastrowid
        if product_id is None:
            raise HTTPException(status_code=500, detail="Failed to insert product.")

        cursor.execute("""INSERT INTO product_image (product_id,image_path) VALUES (%s,%s)""",(product_id, product.image_path))
        image_id = cursor.lastrowid

        if image_id is None:
            raise HTTPException(status_code=500, detail="Failed to insert product.")

        cursor.execute("""
        SELECT j.storage_id 
        FROM jewelry_branch j
        WHERE j.branch_id = %s
            """, (product.branch_id,))

        result = cursor.fetchone()
        if result is None:
            raise HTTPException(status_code=404, detail="Manager's storage not found.")

        storage_id = result[0]

        cursor.execute("""
            INSERT INTO store_product (storge_id, product_id, quantity)
            VALUES (%s, %s, %s)
        """, (storage_id, product_id, 0))

        conn.commit()

        return {"message": "Product added successfully", "product_id": product_id}

    except HTTPException as http_err:
        conn.rollback()
        raise http_err
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")



# ##########################################################################################################################################################

# ################################################################## get all the product ###################################################################

async def retrieve_all_products(manager_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT distinct P.product_id,P.Product_name,P.product_type,pi.image_path,p.deleted
            FROM product P, manager M, jewelry_branch JP, b_storage S, store_product SP,product_image pi
            WHERE 
            M.Manager_id = JP.Manager_id AND
            JP.storage_id = S.storage_id AND
            S.storage_id = SP.storge_id AND
            P.product_id = SP.product_id AND
            P.product_id = pi.product_id AND
            m.Manager_id = %s;
        """, (manager_id,))
        rows = cursor.fetchall()

        if not rows:
            raise HTTPException(status_code=404, detail="Manager's storage not found.")
        products = [
            {
                "product_id": row[0],  # if needed, else remove from schema
                "product_name": row[1],
                "product_type": row[2],
                "image_path": row[3],
                "deleted": row[4]
            }
            for row in rows
        ]

        return {
            "products": products
        }

    except HTTPException as http_err:
        conn.rollback()
        raise http_err
    finally:
        cursor.close()
        conn.close()


# ##########################################################################################################################################################

# ##################################################################get element by id ######################################################################

def get_product_by_id(product_id: int):
    conn = connect_db()
    cursor = conn.cursor(buffered=True)

    try:
        cursor.execute("""
            SELECT P.product_id, P.Product_name, P.product_type, P.kerat,
                   P.main_factor_type, P.weight, P.price_per_gram,
                   P.total_price, P.labour_cost, SP.quantity, pi.image_path,P.discount
            FROM product P, store_product SP, product_image pi
            WHERE P.product_id = SP.product_id
              AND P.product_id = pi.product_id
              AND P.product_id = %s;
        """, (product_id,))

        row = cursor.fetchone()

        if row is None:
            raise HTTPException(status_code=404, detail="Product not found.")

        result = {
            "product_id": row[0],
            "product_name": row[1],
            "product_type": row[2],
            "kerat": row[3],
            "main_factor_type": row[4],
            "weight": row[5],
            "price_per_gram": row[6],
            "total_price": row[7],
            "labour_cost": row[8],
            "quantity": row[9],
            "image_path": row[10],
            "discount": row[11]
        }
        cursor.close()
        conn.close()
        return result

    except HTTPException as http_err:
        conn.rollback()
        raise http_err

def get_ProductByIdAndBranch(branch_id, product_id):
    conn = connect_db()
    cursor = conn.cursor()
    print(product_id)
    print(branch_id)
    try:
        cursor.execute("""SELECT 
                            P.product_id, 
                            P.product_name, 
                            P.product_type, 
                            P.kerat,
                            P.main_factor_type, 
                            P.weight, 
                            P.price_per_gram,
                            P.total_price, 
                            P.labour_cost, 
                            SP.quantity, 
                            PI.image_path,
                            P.discount
                        FROM 
                            product P
                        JOIN 
                            store_product SP ON P.product_id = SP.product_id
                        JOIN 
                            b_storage S ON S.storage_id = SP.storge_id
                        JOIN 
                            jewelry_branch J ON J.storage_id = S.storage_id
                        LEFT JOIN 
                            product_image PI ON P.product_id = PI.product_id
                        WHERE 
                            P.product_id = %s AND J.branch_id = %s;
        """, (product_id,branch_id))

        row = cursor.fetchone()

        if row is None:
            raise HTTPException(status_code=404, detail="Product not found.")

        result = {
            "product_id": row[0],
            "product_name": row[1],
            "product_type": row[2],
            "kerat": row[3],
            "main_factor_type": row[4],
            "weight": row[5],
            "price_per_gram": row[6],
            "total_price": row[7],
            "labour_cost": row[8],
            "quantity": row[9],
            "image_path": row[10],
            "discount": row[11]
        }
        cursor.close()
        conn.close()
        return result

    except HTTPException as http_err:
        conn.rollback()
        raise http_err



def get_productBranches(product_id, manager_id):
    conn = connect_db()
    cursor = conn.cursor(buffered=True)
    try:
        cursor.execute("""
            SELECT DISTINCT jp.branch_id
            FROM jewelry_branch jp
            JOIN b_storage sp ON sp.storage_id = jp.storage_id
            JOIN store_product s ON s.storge_id = sp.storage_id
            JOIN product p ON p.Product_id = s.product_id
            WHERE p.Product_id = %s AND jp.Manager_id = %s
        """, (product_id, manager_id))

        branches = cursor.fetchall()
        if not branches:
            raise HTTPException(status_code=404, detail="Product not found.")
        result = [{"branch_id": branch[0]} for branch in branches]
        cursor.close()
        conn.close()
        return {"branches": result}

    except HTTPException as http_err:
        conn.rollback()
        raise http_err


# ######################################### change Product_name ########################################################
def update_product(product_id, product):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        update_fields = []
        values = []

        cursor.execute("""SELECT weight, price_per_gram, labour_cost,discount FROM product P 
        WHERE Product_id = %s""", (product_id,))  # here i take the old value of the weight, price_per_gram, labour_cost

        row = cursor.fetchone()

        if row is None:
            raise HTTPException(status_code=404, detail="Product not found.")
        # here to see the weight, price_per_gram, labour_cost have a new value if they have then take the new value
        new_weight = product.weight if product.weight is not None else row[0]
        new_price_per_gram = product.price_per_gram if product.price_per_gram is not None else row[1]
        new_labour_cost = product.labour_cost if product.labour_cost is not None else row[2]
        new_discount = product.discount if product.discount is not None else row[3]

        if product.name is not None:
            update_fields.append("Product_name = %s")
            values.append(product.name)
        if product.weight is not None:
            update_fields.append("weight = %s")
            values.append(product.weight)
        if product.price_per_gram is not None:
            update_fields.append("price_per_gram = %s")
            values.append(product.price_per_gram)
        if product.labour_cost is not None:
            update_fields.append("labour_cost = %s")
            values.append(product.labour_cost)
        if product.discount is not None:
            update_fields.append("discount = %s")
            values.append(product.discount)

        new_total_price = ((new_weight * new_price_per_gram) + new_labour_cost) * (1 - new_discount / 100)
        update_fields.append("total_price = %s")
        values.append(new_total_price)

        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update.")

        query = f"UPDATE product SET {', '.join(update_fields)} WHERE Product_id = %s"
        values.append(product_id)

        cursor.execute(query, values)
        conn.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Product not found.")

        return {"message": "Product updated successfully"}
    except HTTPException as http_err:
        conn.rollback()
        raise http_err
    finally:
        cursor.close()
        conn.close()


# ########################################## Delete Product ############################################################
def delete_product(product_id: int):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""UPDATE product
                        SET deleted = 1
                         WHERE
                         Product_id = %s""", (product_id,))
        conn.commit()
    except HTTPException as http_err:
        conn.rollback()
        raise http_err
    finally:
        cursor.close()
        conn.close()


# ############################################ Supply products #########################################################



def supply_products(order):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        # Insert purchase order
        cursor.execute("""
            INSERT INTO purchase_order (Purchase_Order_status, total_cost, expected_delivery, created_at, branch_id) VALUES (%s, %s, %s, %s, %s)
        """,(order.Purchase_Order_status, order.total_cost, order.expected_delivery, order.created_at, order.branch_id))

        order_id = cursor.lastrowid
        total_cost = 0
        quantity = 0

        for product in order.order_line:
            subtotal = product.unit_price * product.quantity
            quantity = quantity + product.quantity

            cursor.execute("""
                INSERT INTO purchase_order_line (Purchase_Order, Product_id, quantity, unit_price, subtotal)
                VALUES (%s, %s, %s, %s, %s)
            """, (order_id, product.Product_id, product.quantity, product.unit_price, subtotal))

            # Update store_product quantity without using JOIN

            cursor.execute("""
                    UPDATE store_product SET quantity = quantity + %s
                    WHERE product_id = %s
                    AND storge_id IN (
                        SELECT storage_id FROM jewelry_branch WHERE branch_id = %s
                    )
                """, (product.quantity, product.Product_id, order.branch_id))
            total_cost += subtotal

        cursor.execute("""SELECT amount,capacity FROM b_storage s 
                         JOIN jewelry_branch j on j.storage_id = s.storage_id
                          WHERE j.branch_id = %s""",(order.branch_id,))
        row = cursor.fetchone()
        amount = row[0]
        capacity = row[1]
        quantity = quantity + amount

        if capacity >= quantity:
            cursor.execute("""
                UPDATE purchase_order SET total_cost = %s WHERE Purchase_Order_id = %s
            """, (total_cost, order_id))
            # update the amount of the storage
            cursor.execute("""UPDATE b_storage s 
                                JOIN jewelry_branch j on j.storage_id = s.storage_id
                                SET s.amount = (
                                    SELECT SUM(sp.quantity)
                                    FROM store_product sp
                                    WHERE sp.storge_id = s.storage_id)
                                    where j.branch_id = %s;""", (order.branch_id,))
            # update the last inventory check
            cursor.execute("""UPDATE b_storage s 
                                JOIN jewelry_branch j on j.storage_id = s.storage_id
                                SET s.last_inventory_check = date_format(curdate(),'%Y-%m-%d')
                                    where j.branch_id = %s;""",(order.branch_id,))
            conn.commit()
        else:
            raise HTTPException(status_code=400, detail="Not enough storage.")

    except HTTPException as http_err:
        conn.rollback()
        raise http_err
    finally:
        cursor.close()
        conn.close()
# ################################################# filter #############################################################

def get_products_filtered(manager_id, filter_data):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        filter_list = []
        values = []

        if filter_data.max_price is not None:
            filter_list.append("p.total_price <= %s")
            values.append(filter_data.max_price)

        if filter_data.min_price is not None:
            filter_list.append("p.total_price >= %s")
            values.append(filter_data.min_price)

        if filter_data.type is not None and len(filter_data.type) > 0:
            placeholders = ', '.join(['%s'] * len(filter_data.type))
            filter_list.append(f"p.product_type IN ({placeholders})")
            values.extend(filter_data.type)

        if not filter_list:
            raise HTTPException(status_code=400, detail="No filters provided.")

        filter_con = " AND ".join(filter_list)

        query = (
            f"SELECT distinct P.product_id, P.product_name, P.product_type, pi.image_path,p.deleted "
            f"FROM product P, manager M, jewelry_branch JP, b_storage S, store_product SP, product_image PI "
            f"WHERE {filter_con} AND "
            f"M.manager_id = %s AND "
            f"M.manager_id = JP.Manager_id AND "
            f"JP.storage_id = S.storage_id AND "
            f"S.storage_id = SP.storge_id AND "
            f"P.product_id = SP.product_id AND "
            f"P.product_id = PI.product_id"
        )

        values.append(manager_id)
        cursor.execute(query, values)
        rows = cursor.fetchall()

        if not rows:
            raise HTTPException(status_code=404, detail="Manager's storage not found or no products matched the filter.")

        products = [
            {
                "product_id": row[0],
                "product_name": row[1],
                "product_type": row[2],
                "image_path": row[3],
                "deleted": row[4]
            }
            for row in rows
        ]

        return {"products": products}

    except HTTPException as http_err:
        conn.rollback()
        raise http_err
    finally:
        cursor.close()
        conn.close()
# ######################################################################################################################
# ######################################################################################################################
def get_productsBranch(branch_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select distinct p.Product_id,p.Product_name,p.product_type,sp.quantity from product p 
                        join store_product sp on p.Product_id = sp.product_id
                        join b_storage s on s.storage_id = sp.storge_id
                        join jewelry_branch j on j.storage_id = s.storage_id
                        where
                        j.branch_id = %s""",(branch_id,))
        rows = cursor.fetchall()
        if not rows:
            raise HTTPException(status_code=404, detail="error fetching products.")
        result = [
            {
                "Product_id":row[0],
                "Product_name":row[1],
                "product_type":row[2],
                "quantity":row[3],

            }
            for row in rows
        ]
        return {"products":result}
    except HTTPException as http_err:
        conn.rollback()
        raise http_err
    finally:
        cursor.close()
        conn.close()

def mostExpinsevProduct(manager_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select max(p.total_price*(1-deleted)) from product p
                        join store_product sp on p.Product_id = sp.product_id
                        join b_storage s on s.storage_id = sp.storge_id
                        join jewelry_branch j on j.storage_id = s.storage_id
                         WHERE  j.Manager_id = %s;""",(manager_id,))
        row = cursor.fetchone()
        if row is None:
            return {
                "maxPrice":0,
            }
        return {"maxPrice":row[0]}
    except HTTPException as http_err:
        conn.rollback()
        raise http_err
    finally:
        cursor.close()
        conn.close()


def mostSillingProductPerType(manager_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""SELECT p.product_id,
                        p.product_name,
                        p.product_type,
                        SUM(ol.quantity) AS QuantitySold
                    FROM product p
                    JOIN order_line ol ON p.product_id = ol.Product_id
                    JOIN store_product sp ON p.product_id = sp.product_id
                    JOIN b_storage s ON sp.storge_id = s.storage_id
                    JOIN jewelry_branch jb ON jb.storage_id = s.storage_id
                    WHERE 
                        jb.Manager_id = %s
                    GROUP BY 
                        p.product_id, p.product_name, p.product_type
                    HAVING 
                        QuantitySold = (SELECT MAX(sub.total_quantity)
                            FROM (SELECT p2.product_id,
                                    p2.product_type,
                                    SUM(ol2.quantity) AS total_quantity
                                FROM product p2
                                JOIN order_line ol2 ON p2.product_id = ol2.Product_id
                                JOIN store_product sp2 ON p2.product_id = sp2.product_id
                                JOIN b_storage s2 ON sp2.storge_id = s2.storage_id
                                JOIN jewelry_branch jb2 ON jb2.storage_id = s2.storage_id
                                WHERE 
                                    jb2.Manager_id = %s
                                    AND p2.product_type = p.product_type
                                GROUP BY 
                                    p2.product_id
                            ) AS sub
                        )
                    ORDER BY 
                        p.product_type, QuantitySold DESC;""",(manager_id, manager_id))
        rows = cursor.fetchall()
        if not rows:
            raise HTTPException(status_code=404, detail="error fetching products.")
        result = [
            {
                "product_id": row[0],
                "product_name": row[1],
                "product_type": row[2],
                "QuantitySold": row[3],
            }
            for row in rows
        ]
        return {"products": result}
    except HTTPException as http_err:
        conn.rollback()
        raise http_err
    finally:
        cursor.close()
        conn.close()

# ######################################################################################################################
# ######################################################################################################################

def MostPopularProduct(manager_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""SELECT p.product_id,
                           p.product_name,
                           p.product_type,
                           SUM(ol.quantity) AS QuantitySold,
                           SUM(ol.subtotal) AS TotalPrice
                    FROM product p
                    JOIN order_line ol ON p.product_id = ol.Product_id
                    JOIN store_product sp ON p.product_id = sp.product_id
                    JOIN b_storage s ON sp.storge_id = s.storage_id
                    JOIN jewelry_branch jb ON jb.storage_id = s.storage_id
                    WHERE jb.Manager_id = %s
                    GROUP BY p.product_id, p.product_name, p.product_type
                    HAVING SUM(ol.quantity) = (
                        SELECT MAX(sub.total_quantity)
                        FROM (
                            SELECT p2.product_id,
                                   SUM(ol2.quantity) AS total_quantity
                            FROM product p2
                            JOIN order_line ol2 ON p2.product_id = ol2.Product_id
                            JOIN store_product sp2 ON p2.product_id = sp2.product_id
                            JOIN b_storage s2 ON sp2.storge_id = s2.storage_id
                            JOIN jewelry_branch jb2 ON jb2.storage_id = s2.storage_id
                            WHERE jb2.Manager_id = %s
                            GROUP BY p2.product_id
                        ) AS sub
                    )
                    ORDER BY TotalPrice DESC;""", (manager_id, manager_id))
        rows = cursor.fetchall()
        if not rows:
            raise HTTPException(status_code=404, detail="error fetching products.")
        result = [
            {
                "product_id": row[0],
                "product_name": row[1],
                "product_type": row[2],
                "QuantitySold": row[3],
                "TotalPrice": row[4],
            }
            for row in rows
        ]
        return {"products": result}
    except HTTPException as http_err:
        conn.rollback()
        raise http_err
    finally:
        cursor.close()
        conn.close()

def numberOfQuantitySoldPerType(manager_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select p.product_type,SUM(ol.quantity) AS QuantitySold 
                        FROM product p
                        JOIN order_line ol ON p.product_id = ol.Product_id
                        JOIN store_product sp ON p.product_id = sp.product_id
                        JOIN b_storage s ON sp.storge_id = s.storage_id
                        JOIN jewelry_branch jb ON jb.storage_id = s.storage_id
                        WHERE jb.Manager_id = %s
                        GROUP BY p.product_type ORDER BY SUM(ol.quantity) DESC ;""",(manager_id,))
        rows = cursor.fetchall()
        if not rows:
            raise HTTPException(status_code=404, detail="error fetching products.")
        result = [
            {
                "product_type":row[0],
                "QuantitySold":row[1]
            }
            for row in rows
        ]
        return {"products": result}
    except HTTPException as http_err:
        conn.rollback()
        raise http_err

# #####################################################################################################################
# ##################################### list product ordered ##########################################################

def lastProductSupply(manager_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select p.Product_id,p.Product_name,p.product_type,ol.quantity,sum(p.total_price*(1-p.deleted)) as total_price from product p
                            JOIN purchase_order_line ol on p.Product_id = ol.Product_id
                            JOIN purchase_order o on o.Purchase_Order_id = ol.Purchase_Order
                            JOIN jewelry_branch j on j.branch_id = o.branch_id
                            where
                            j.Manager_id = %s AND
                            o.created_at >= (select max(o2.created_at) from purchase_order o2)
                            group by p.Product_id,p.Product_name,p.product_type,ol.quantity;""",(manager_id,))
        rows = cursor.fetchall()
        if not rows:
            raise HTTPException(status_code=404, detail="error fetching products.")
        result = [
            {
                "Product_id": row[0],
                "Product_name": row[1],
                "product_type": row[2],
                "total_price": row[4],
                "quantity": row[3]
            }
            for row in rows
        ]
        return {"products": result}
    except HTTPException as http_err:
        conn.rollback()
        raise http_err
    finally:
        cursor.close()
        conn.close()

def lastProductOrdered(manager_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select p.Product_id,p.Product_name,p.product_type,ol.quantity,sum(p.total_price*(1-p.deleted)) as total_price from product p
                            JOIN order_line ol on p.Product_id = ol.Product_id
                            JOIN order_ o on o.order_id = ol.Order_id
                            JOIN store_product sp on sp.product_id = p.Product_id
                            JOIN b_storage s on s.storage_id = sp.storge_id
                            join jewelry_branch j on j.storage_id = s.storage_id 
                            where
                            j.Manager_id = %s and
                            o.created_at >= (select max(o2.created_at) from order_ o2)
                            group by p.Product_id,p.Product_name,p.product_type,ol.quantity;""",(manager_id,))
        rows = cursor.fetchall()
        if not rows:
            raise HTTPException(status_code=404, detail="error fetching products.")
        result = [
            {
                "Product_id": row[0],
                "Product_name": row[1],
                "product_type": row[2],
                "total_price": row[4],
                "quantity": row[3]
            }
            for row in rows
        ]
        return {"products": result}
    except HTTPException as http_err:
        conn.rollback()
        raise http_err
    finally:
        cursor.close()
        conn.close()



