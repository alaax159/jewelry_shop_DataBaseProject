import re
from starlette.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Response
from starlette.responses import JSONResponse, RedirectResponse
from typing import List
from Schemas.Customer import *
from Schemas.Product import product_id_returned
from Queries.create_Account import create_customer
from Schemas.account import account_login
from Schemas.account import account_id_returned, customer
from Schemas.AddtoCart import AddToCartRequest
from Schemas.Order import order_Item, order_ratings
from Queries.cart import *
from databaseConnect import connect_db
from datetime import date, timedelta
from Schemas.rank import find_rank, next_rank

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/customerCreation")
async def addAccount(customer: customer_creation):
    result = create_customer(customer)
    return result


@app.post("/Login")
async def login(account: account_login, response: Response):
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
            response.set_cookie("acc_id", str(row[0]), max_age=10000, httponly=False)
            response.set_cookie("role", row[14], max_age=10000, httponly=False)
            return {"Logged In  "}
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


@app.get("/Home")
async def home_redirect(request: Request):
    acc_id = request.cookies.get("acc_id")

    if not acc_id:
        raise HTTPException(status_code=404, detail="Account not found.")

    try:
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute("SELECT user_name FROM p_account WHERE acc_id = %s", (acc_id,))
        row = cursor.fetchone()
        cursor.close()
        conn.close()

        if row:
            username = row[0]
            return {"Username": username}
        else:
            raise HTTPException(status_code=401, detail="Incorrect Access.")

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.get("/Products/{product_type}")
async def product_redirect(product_type: str):
    try:
        conn = connect_db()
        cursor = conn.cursor()
        query = """
                SELECT * FROM product p
                JOIN product_image pi ON p.product_id = pi.product_id JOIN store_product sp ON p.product_id = sp.product_id
                WHERE p.product_type = %s
                """
        cursor.execute(query, (product_type,))
        products = cursor.fetchall()
        cursor.close()
        conn.close()

        if products:
            print(products)
            return products
        else:
            raise HTTPException(status_code=404, detail="Not Found")

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.get("/Products/Search/{Search_Value}")
def product_redirect(Search_Value: str):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        categories = {
            "Product_type": ["RING", "NECKLACE", "EARRINGS", "BRACELET", "PENDANT", "CHAI"],
            "Kerat": [14, 16, 18, 21, 22, 23, 24],
            "main_factor_type": ["Gold", "Silver", "Bronze", "Diamond"],
        }

        filters = []

        for value in categories["Product_type"]:
            if value.upper() in Search_Value.upper():
                filters.append(f"product_type = %s")

        for value in categories["Kerat"]:
            if str(value) in Search_Value:
                filters.append(f"kerat = %s")

        for value in categories["main_factor_type"]:
            if value.lower() in Search_Value.lower():
                filters.append(f"main_factor_type = %s")

        match = re.search(r"\d{3,}", Search_Value)
        if match:
            price = int(match.group())
            filters.append("total_price = %s")
        else:
            price = None

        query = "SELECT DISTINCT * FROM product p JOIN product_image pi ON p.product_id = pi.product_id"
        values = []

        if filters:
            query += " WHERE " + " OR ".join(filters)
            for value in categories["Product_type"]:
                if value.upper() in Search_Value.upper():
                    values.append(value)
            for value in categories["Kerat"]:
                if str(value) in Search_Value:
                    values.append(value)
            for value in categories["main_factor_type"]:
                if value.lower() in Search_Value.lower():
                    values.append(value)
            if price is not None:
                values.append(price)

        print(query)
        print("Params:", values)

        cursor.execute(query, tuple(values))
        products = cursor.fetchall()
        print(products)
        cursor.close()
        conn.close()

        if products:
            return products
        else:
            raise HTTPException(status_code=404, detail="Not Found")

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/Home/add-to-cart")
async def add_to_cart_redirect(data: AddToCartRequest):
    acc_id = data.acc_id
    product_id = data.product_id
    print(acc_id, product_id)
    try:
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute("Select total_price from product where product_id = %s", (product_id,))
        total_price = cursor.fetchone()[0]
        cursor.execute("SELECT cart_id FROM cart WHERE acc_id = %s", (acc_id,))
        row = cursor.fetchone()
        cursor.close()
        conn.close()

        if row:
            cart_id = row[0]
            conn = connect_db()
            cursor = conn.cursor()
            cursor.execute("SELECT * from cart_items where product_id = %s", (product_id,))
            test = cursor.fetchone()
            if test:
                #To test whether the number of products added to cart exceeded the max or not
                cursor.execute("SELECT quantity FROM store_product WHERE product_id = %s", (product_id,))
                quantity_stored_row = cursor.fetchone()
                if quantity_stored_row is None:
                    return JSONResponse(content={"error": "Product not found in store."}, status_code=404)
                quantity_stored = quantity_stored_row[0] or 0

                cursor.execute("SELECT quantity FROM cart_items WHERE product_id = %s", (product_id,))
                quantity_requested_row = cursor.fetchone()
                if quantity_requested_row is None:
                    return JSONResponse(content={"error": "Product not found in cart."}, status_code=404)
                quantity_requested = quantity_requested_row[0] or 0

                if quantity_stored > quantity_requested:
                    cursor.execute("UPDATE cart_items SET quantity = quantity + 1 WHERE product_id = %s", (product_id,))
                    conn.commit()
            else:
                cursor.execute(
                    "INSERT INTO cart_items (cart_id, product_id, quantity, unit_price, subtotal) VALUES (%s, %s, %s, %s, %s)",
                    (cart_id, product_id, 1, total_price, total_price)
                )
                conn.commit()
            cursor.execute(
                """
                SELECT SUM(p.total_price * ct.quantity) 
                FROM product p 
                JOIN cart_items ct ON ct.product_id = p.product_id 
                JOIN cart c ON c.cart_id = ct.cart_id 
                WHERE c.acc_id = %s;
                """, (acc_id,))
            new_price = cursor.fetchone()[0] or 0
            cursor.execute(
                "UPDATE cart SET total = %s WHERE acc_id = %s", (new_price, acc_id))
            conn.commit()
            cursor.execute(
                "UPDATE cart SET last_modified = %s WHERE acc_id = %s", (date.today(), acc_id))
            conn.commit()
            cursor.close()
            conn.close()
        else:
            conn = connect_db()
            cursor = conn.cursor()

            cursor.execute(
                "INSERT INTO cart (acc_id, order_status,total, last_modified, discount) VALUES (%s,%s, %s, %s, %s)",
                (acc_id, "Pending", total_price, date.today(), 0)
            )
            new_cart_id = cursor.lastrowid
            cursor.execute(
                "INSERT INTO cart_items (cart_id, product_id, quantity, unit_price, subtotal) VALUES (%s, %s, %s, %s, %s)",
                (new_cart_id, product_id, 1, total_price, total_price)
            )
            conn.commit()
            cursor.close()
            conn.close()
        return JSONResponse(content={"message": "Item added to cart successfully."}, status_code=200)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/cartProducts")
async def product_cart_returned(data: account_id_returned):
    acc_id = data.acc_id
    try:
        conn = connect_db()
        cursor = conn.cursor()
        query = """
                SELECT p.product_id, p.product_type, p.discount, p.total_price, pi.image_path, ci.quantity FROM cart c 
                JOIN cart_items ci ON c.cart_id = ci.cart_id 
                JOIN product p ON p.product_id = ci.product_id 
                JOIN product_image pi ON p.product_id = pi.product_id
                WHERE c.acc_id = %s
                """
        cursor.execute(query, (acc_id,))
        products = cursor.fetchall()
        cursor.close()
        conn.close()

        if products:
            return products

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/removeFromCart")
async def product_cart_returned(data: AddToCartRequest):
    acc_id = data.acc_id
    product_id = data.product_id
    try:
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute("SELECT cart_id FROM cart WHERE acc_id = %s", (acc_id,))
        cart_id = cursor.fetchone()[0]
        cursor.execute("DELETE FROM cart_items WHERE product_id = %s and cart_id = %s", (product_id, cart_id))
        conn.commit()
        cursor.execute("SELECT * FROM cart_items WHERE cart_id = %s", (cart_id,))
        resp = cursor.fetchall()

        if not resp:
            cursor.execute("DELETE FROM cart WHERE cart_id = %s", (cart_id,))
            conn.commit()
            return JSONResponse(content={"message": "Item removed successfully."}, status_code=200)
        cursor.execute(
            """
            SELECT SUM(p.total_price * ct.quantity) 
            FROM product p 
            JOIN cart_items ct ON ct.product_id = p.product_id 
            JOIN cart c ON c.cart_id = ct.cart_id 
            WHERE c.acc_id = %s;
            """, (acc_id,))
        new_price = cursor.fetchone()[0] or 0
        cursor.execute(
            "UPDATE cart SET total = %s WHERE acc_id = %s", (new_price, acc_id))
        conn.commit()
        cursor.execute(
            "UPDATE cart SET last_modified = %s WHERE acc_id = %s", (date.today(), acc_id))
        conn.commit()
        cursor.close()
        conn.close()

        return JSONResponse(content={"message": "Item removed successfully."}, status_code=200)


    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/checkout-data")
async def checkout_info(data: account_id_returned):
    acc_id = data.acc_id
    try:
        conn = connect_db()
        cursor = conn.cursor()
        query = "SELECT total FROM cart WHERE acc_id = %s"
        cursor.execute(query, (acc_id,))
        row = cursor.fetchone()
        if not row:
            cursor.close()
            conn.close()
            return JSONResponse(content={"message": "No cart total found for this account."}, status_code=404)
        query = """SELECT first_name, last_name, email From p_account WHERE acc_id = %s"""
        cursor.execute(query, (acc_id,))
        account_details = cursor.fetchall()
        cursor.close()
        conn.close()
        if account_details:
            return account_details[0]

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/checkout-data-database")
async def add_paymentdata(data: customer_payment):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        # Get total price from cart
        query = "SELECT total FROM cart WHERE acc_id = %s"
        cursor.execute(query, (data.acc_id_n,))
        row = cursor.fetchone()
        if not row:
            cursor.close()
            conn.close()
            return JSONResponse(content={"message": "No cart total found for this account."}, status_code=404)
        total_price = int(row[0])

        # Get wallet balance
        query = "SELECT wallet_balance FROM customer WHERE acc_id = %s"
        cursor.execute(query, (data.acc_id_n,))
        row = cursor.fetchone()
        if not row:
            cursor.close()
            conn.close()
            return JSONResponse(content={"message": "Customer not found."}, status_code=404)
        wallet_balance = int(row[0])
        if total_price > wallet_balance:
            cursor.close()
            conn.close()
            return JSONResponse(content={"message": "Payment data exceeds wallet balance."}, status_code=400)

        # Deduct balance and update customer payment info
        new_walletbalance = wallet_balance - total_price

        update_customer_query = """
                UPDATE customer SET 
                    wallet_balance = %s,
                    visa_num = %s,
                    vcc = %s,
                    name_on_card = %s,
                    Expiration_date = %s 
                WHERE acc_id = %s
            """
        cursor.execute(
            update_customer_query,
            (new_walletbalance, data.cardNumber, data.cvv, data.fullName, data.expiry, data.acc_id_n)
        )
        # Update address in p_account table
        update_address_query = "UPDATE p_account SET street_name = %s WHERE acc_id = %s"
        cursor.execute(update_address_query, (data.address, data.acc_id_n))

        # Insert phone number if provided
        if data.phone:
            insert_phone_query = "INSERT INTO account_phone (acc_id, phone_num) VALUES (%s, %s)"
            cursor.execute(insert_phone_query, (data.acc_id_n, data.phone))
            conn.commit()

        cursor.execute("SELECT cart_id from cart where acc_Id = %s", (data.acc_id_n,))
        cart_id = cursor.fetchone()[0]
        print(cart_id)
        cursor.execute("SELECT product_id, quantity from cart_items where cart_id = %s", (cart_id,))
        products = cursor.fetchall()
        for product in products:
            cursor.execute("UPDATE store_product set quantity = quantity - %s where product_id = %s",
                           (product[1], product[0]))
            conn.commit()
        # 1. Get cart details
        cursor.execute("SELECT * FROM cart WHERE acc_Id = %s", (data.acc_id_n,))
        cart_values = cursor.fetchone()  # Use fetchone, since cart_id is unique
        print(cart_values)

        # 2. Insert into `order_` and get the new `order_id`
        cursor.execute(
            "INSERT INTO order_ (order_status, order_price, payment_method, delivery_data, customer_id, monthOrdered) VALUES (%s, %s, %s, %s, %s, %s)",
            ("Pending", cart_values[3], "VISA", datetime.now() + timedelta(days=20), cart_values[1],
             datetime.now().month)
        )
        order_id = cursor.lastrowid  # Capture the new order_id
        conn.commit()

        # 3. Get cart_items before deleting the cart
        cursor.execute("SELECT * FROM cart_items WHERE cart_id = %s", (cart_values[0],))
        order_products = cursor.fetchall()
        print(order_products)

        # 4. Insert into `order_line` using the new order_id
        for order_product in order_products:
            cursor.execute(
                "INSERT INTO order_line (Order_id, Product_id, quantity, unit_price, subtotal) VALUES (%s, %s, %s, %s, %s)",
                (order_id, order_product[2], order_product[3], order_product[4], order_product[5])
            )
            cursor.execute("DELETE FROM cart_items WHERE cart_item_id = %s", (order_product[0],))
        conn.commit()

        # 5. Now delete the cart
        cursor.execute("DELETE FROM cart WHERE cart_id = %s", (cart_values[0],))
        conn.commit()

        cursor.execute("UPDATE customer set points = points + %s where acc_id = %s", (total_price, data.acc_id_n))
        conn.commit()

        order_key = "#" + str(order_id) + "-" + str(datetime.now())
        query = """Select concat(p.product_type, "-", p.product_name), p.total_price, ol.quantity, p.product_id from product p 
                                JOIN order_line ol ON p.product_id = ol.product_id JOIN order_ o ON o.order_id = ol.order_id
                                where o.customer_id = %s and o.order_id = %s"""
        cursor.execute(query, (data.acc_id_n, order_id))
        order_details = cursor.fetchall()
        personal_details = [data.fullName, "******" + data.cardNumber[len(data.cardNumber) - 4:]]
        response = {"personal_details": personal_details, order_key: order_details, "Location": data.address,
                    "order_id": order_id}

        cursor.close()
        conn.close()

        return JSONResponse(content=response, status_code=200)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/Home/Quantity")
async def Quantity(product: product_id_returned):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT DISTINCT quantity FROM product p JOIN store_product sp ON p.product_id = sp.product_id Where p.product_id = %s",
            (product.product_id,))
        quantity = cursor.fetchone()
        cursor.close()
        conn.close()
        print(quantity)
        return quantity

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/Home/Discounts")
async def Discounts():
    try:
        conn = connect_db()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT Distinct * FROM product p JOIN product_image pi ON p.product_id = pi.product_id JOIN store_product sp ON sp.product_id = p.product_id WHERE p.discount > 0")
        Discounts = cursor.fetchall()
        cursor.close()
        conn.close()
        if Discounts:
            return Discounts
        else:
            return JSONResponse(content={"message": "No Discounts Found"}, status_code=404)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.get("/Home/{acc_id}")
async def get_wallet_balance(acc_id: str):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT wallet_balance FROM customer where acc_id = %s", (acc_id,))
        wallet_balance = cursor.fetchone()
        cursor.close()
        conn.close()
        if wallet_balance:
            return {"wallet_balance": wallet_balance[0]}
        else:
            conn.rollback()
            return JSONResponse(content={"message": "No wallet Found"}, status_code=404)
    except Exception as e:
        conn.rollback()
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/Home/check-balance-add")
async def get_wallet_balance(acc: customer):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT visa_num FROM customer where acc_id = %s", (acc.acc_id,))
        visa_num = cursor.fetchone()
        if visa_num[0] is not None:
            cursor.execute(
                "UPDATE customer set wallet_balance = wallet_balance + %s where acc_id = %s", (acc.amount, acc.acc_id))
            conn.commit()
            cursor.close()
            conn.close()
            return JSONResponse(content={"message": "Added Wallet"}, status_code=200)
        else:
            conn.rollback()
            return JSONResponse(content={"message": "No wallet Found"}, status_code=404)
    except Exception as e:
        conn.rollback()
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/checkout-balance")
async def checkout_info(data: account_id_returned):
    acc_id = data.acc_id
    conn = connect_db()
    cursor = conn.cursor()
    try:
        query = """SELECT first_name, last_name, email From p_account WHERE acc_id = %s"""
        cursor.execute(query, (acc_id,))
        account_details = cursor.fetchall()
        cursor.close()
        conn.close()
        if account_details:
            return account_details[0]

    except Exception as e:
        conn.rollback()
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/add-balance")
async def add_paymentdata(data: add_customer_balance):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        # Get wallet balance
        query = "SELECT wallet_balance FROM customer WHERE acc_id = %s"
        cursor.execute(query, (data.acc_id_n,))
        row = cursor.fetchone()
        if not row:
            cursor.close()
            conn.close()
            conn.rollback()
            return JSONResponse(content={"message": "Customer not found."}, status_code=404)
        wallet_balance = int(row[0])

        # Deduct balance and update customer payment info

        update_customer_query = """
                UPDATE customer SET 
                    wallet_balance = %s,
                    visa_num = %s,
                    vcc = %s,
                    name_on_card = %s,
                    Expiration_date = %s 
                WHERE acc_id = %s
            """
        cursor.execute(
            update_customer_query,
            (wallet_balance, data.cardNumber, data.cvv, data.fullName, data.expiry, data.acc_id_n)
        )
        # Update address in p_account table
        update_address_query = "UPDATE p_account SET street_name = %s WHERE acc_id = %s"
        cursor.execute(update_address_query, (data.address, data.acc_id_n))

        # Insert phone number if provided
        if data.phone:
            insert_phone_query = "INSERT INTO account_phone (acc_id, phone_num) VALUES (%s, %s)"
            cursor.execute(insert_phone_query, (data.acc_id_n, data.phone))
            conn.commit()

        cursor.execute(
            "UPDATE customer set wallet_balance = wallet_balance + %s where acc_id = %s",
            (data.amount_n, data.acc_id_n))
        conn.commit()

        cursor.close()
        conn.close()

        return JSONResponse(content={"message": "Payment Complete."}, status_code=200)

    except Exception as e:
        conn.rollback()
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/total-spending")
async def total_spending(data: account_id_returned):
    acc_id = data.acc_id
    conn = connect_db()
    cursor = conn.cursor()
    try:
        query = """select sum(order_price) as TotalSpent from order_ where customer_id = %s and order_status != %s"""
        cursor.execute(query, (acc_id, "cancelled"))
        TotalSpent = cursor.fetchone() or 0
        query = """select sum(ol.quantity) from order_ o join order_line ol ON o.order_id = ol.order_id where o.customer_id = %s and o.order_status != %s"""
        cursor.execute(query, (acc_id, "cancelled"))
        NumberOrders = cursor.fetchone() or 0
        cursor.close()
        conn.close()
        return {"TotalSpent": TotalSpent, "NumberOrders": NumberOrders}

    except Exception as e:
        conn.rollback()
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/ranking")
async def ranking_meta(data: account_id_returned):
    acc_id = data.acc_id
    conn = connect_db()
    cursor = conn.cursor()
    try:
        query = """Select points from customer where acc_id = %s"""
        cursor.execute(query, (acc_id,))
        Points = cursor.fetchone() or 0
        cursor.close()
        conn.close()
        return {"rank": find_rank(Points[0])}

    except Exception as e:
        conn.rollback()
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/recent-parchases")
async def recent_parchases(data: account_id_returned):
    acc_id = data.acc_id
    conn = connect_db()
    cursor = conn.cursor()
    try:
        query = """SELECT p.product_type, pm.image_path, p.total_price, o.created_at FROM order_ o JOIN order_line ol ON o.order_id = ol.order_id
                    JOIN product p ON p.product_id = ol.product_id
                    JOIN product_image pm ON p.product_id = pm.product_id WHERE o.customer_id = %s AND o.order_status != 'cancelled'
                    ORDER BY o.created_at ASC;"""
        cursor.execute(query, (acc_id,))
        product_recent_parchases = cursor.fetchall()
        cursor.close()
        conn.close()
        return product_recent_parchases

    except Exception as e:
        conn.rollback()
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/monthly-spent")
async def monthly_spent(data: account_id_returned):
    acc_id = data.acc_id
    conn = connect_db()
    cursor = conn.cursor()
    try:
        query = """select monthOrdered, sum(order_price) as AmountSpent from order_  where customer_id = %s group by monthOrdered order by monthOrdered asc"""
        cursor.execute(query, (acc_id,))
        total_spent_monthly = cursor.fetchall()
        cursor.close()
        conn.close()
        return total_spent_monthly

    except Exception as e:
        conn.rollback()
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/ranking-bar")
async def ranking_bar(data: account_id_returned):
    acc_id = data.acc_id
    conn = connect_db()
    cursor = conn.cursor()
    try:
        query = """Select points from customer where acc_id = %s"""
        print(acc_id)
        cursor.execute(query, (acc_id,))
        Points = cursor.fetchone() or 0
        cursor.close()
        conn.close()
        new_rank = next_rank(Points[0])
        new_rank['rank'] = find_rank(Points[0])
        new_rank['c_points'] = Points[0]
        if new_rank['next'] == 'max' and new_rank['c_points'] >= 50000:
            new_rank['c_points'] = 50000
        return new_rank
    except Exception as e:
        conn.rollback()
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/recomended-products")
async def recommended_products():
    conn = connect_db()
    cursor = conn.cursor()
    try:
        query = """select p.product_type, pi.image_path, p.total_price from product p JOIN product_image pi ON p.product_id = pi.product_id 
                    JOIN order_line ol ON ol.product_id = p.product_id
                    JOIN order_ o ON o.order_id = ol.order_id order by o.created_at desc"""
        cursor.execute(query)
        rec_products = cursor.fetchall() or 0
        cursor.close()
        conn.close()
        if rec_products:
            return rec_products[:4]
    except Exception as e:
        conn.rollback()
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.get("/most-frequent-product")
async def most_frequent_product():
    conn = connect_db()
    cursor = conn.cursor()
    try:
        query = """select p.product_type, p.total_price, pi.image_path from product p JOIN product_image pi ON p.product_id = pi.product_id where p.product_id = 
                    (select pf.product_id from (select count(*) as frequentProducts, p.product_id from order_line ol 
                    JOIN product p ON p.product_id = ol.product_id group by p.product_id) AS pf
                    where pf.frequentProducts = (select max(pfr.frequentProducts) from (select count(*) as frequentProducts, p.product_id from order_line ol 
                    JOIN product p ON p.product_id = ol.product_id group by p.product_id) as pfr))"""
        cursor.execute(query)
        most_frequent = cursor.fetchone() or 0
        cursor.close()
        conn.close()
        if most_frequent:
            return most_frequent
    except Exception as e:
        conn.rollback()
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/order-history")
async def order_history(data: account_id_returned):
    acc_id = data.acc_id
    conn = connect_db()
    cursor = conn.cursor()
    try:
        query = """Select order_id, created_at from order_ where customer_id = %s"""
        cursor.execute(query, (acc_id,))
        order_ids = cursor.fetchall()
        values = {}
        new_order = []
        for order_id in order_ids:
            new_order.append("#" + str(order_id[0]) + "-" + str(order_id[1]))
            query = """Select concat(p.product_type, "-", p.product_name), o.order_status from product p 
                        JOIN order_line ol ON p.product_id = ol.product_id JOIN order_ o ON o.order_id = ol.order_id
                        where o.customer_id = %s and o.order_id = %s"""
            cursor.execute(query, (acc_id, order_id[0]))
            values[new_order[-1]] = cursor.fetchall()
            print(values[new_order[-1]])
        cursor.close()
        conn.close()
        return values

    except Exception as e:
        conn.rollback()
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/edit-rating")
async def rating(data: order_ratings):
    order_id = data.order_id
    product_id = data.product_id
    rating = data.rating
    conn = connect_db()
    cursor = conn.cursor()
    try:
        query = """UPDATE order_line set rating = %s where order_id = %s and product_id = %s"""
        cursor.execute(query, (rating, order_id, product_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return JSONResponse(content={"Complete": "Rated Complete"}, status_code=200)
    except Exception as e:
        conn.rollback()
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/cancel-order")
async def cancel_order(data: order_Item):
    order_id = data.order_id
    conn = connect_db()
    cursor = conn.cursor()
    try:
        query = """Update order_ set order_status = 'Cancelled' where order_id = %s"""
        cursor.execute(query, (order_id,))
        conn.commit()
        query = """Update customer set wallet_balance = wallet_balance + (select order_price from order_ where order_id = %s)
         where acc_id = (select customer_id from order_ where order_id = %s)"""
        cursor.execute(query, (order_id, order_id))
        conn.commit()
        query = """Update customer set points = points - (select order_price from order_ where order_id = %s)
                 where acc_id = (select customer_id from order_ where order_id = %s)"""
        cursor.execute(query, (order_id, order_id))
        conn.commit()
        cursor.close()
        conn.close()
        return JSONResponse(content={"Complete": "Cancel Completed"}, status_code=200)


    except Exception as e:
        conn.rollback()
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/most-rating-product")
async def most_rated_product():
    conn = connect_db()
    cursor = conn.cursor()
    try:
        query = """select p.product_type, p.total_price, pi.image_path from product p JOIN product_image pi ON p.product_id = pi.product_id 
                    JOIN order_line ol ON ol.product_id = p.product_id order by ol.rating DESC"""
        cursor.execute(query)
        most_rated = cursor.fetchall()[0] or 0
        cursor.close()
        conn.close()
        if most_rated:
            print(most_rated)
            return most_rated
    except Exception as e:
        conn.rollback()
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/products-sold-by-category")
async def products_sold_by_category():
    conn = connect_db()
    cursor = conn.cursor()
    try:
        query = """select p.product_type, count(*) as TotalProducts from product p JOIN order_line ol ON p.product_id = ol.product_id group by p.product_type"""
        cursor.execute(query)
        products_sold = cursor.fetchall()
        cursor.close()
        conn.close()
        return products_sold

    except Exception as e:
        conn.rollback()
        return JSONResponse(content={"error": str(e)}, status_code=500)