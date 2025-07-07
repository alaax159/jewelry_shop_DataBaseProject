import mysql.connector

def connect_db():
    connection = mysql.connector.connect(host="localhost",user="root",password="123456789",database="Jewelry_shop")
    return connection