import mysql.connector

def connect_db():
    connection = mysql.connector.connect(host="localhost",user="root",password="2122004aA",database="Jewelry_shop")
    return connection