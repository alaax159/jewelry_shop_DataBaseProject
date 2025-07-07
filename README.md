# 💎 Jewelry Shop Database Project

A full-stack Jewelry Shop Management System using **FastAPI (backend)**, **HTML/CSS/JavaScript (frontend)**, and **MySQL** for the database.

---

## 📁 Project Structure
📦 jewelry_shop_DataBaseProject
│
├── Dashbord/
│ ├── frontEnd/ # HTML, CSS, JS (Create Account, Login, Dashboard)
│ ├── Query/ # Python files for database queries
│ ├── schema/ # Python files for table schema representations
│ ├── service/ # Business logic or service layer
│ ├── databaseConnect.py # MySQL connection config
│ └── main.py # FastAPI backend entry point
│
├── website/
│ ├── FrontEnd/
│ ├── Queries/
│ ├── Schemas/
│ └── main.py
│
├── 122008_1220175.sql # SQL file to set up the database
├── README.md
└── test_main.http # FastAPI HTTP tests
---

## ⚙️ Technologies Used

- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Frontend**: HTML, CSS, JavaScript
- **Database**: MySQL
- **Connector**: `mysql-connector-python`

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/alaax159/jewelry_shop_DataBaseProject.git
cd jewelry_shop_DataBaseProject
```
### 2. Install dependencies

```bash
pip install fastapi uvicorn mysql-connector-python
```
### 3. Configure your MySQL
connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="your_password",
    database="Jewelry_shop"
)
### 4. Run the FastAPI server
```bash
uvicorn Dashbord.main:app --reload
```
### 5. Access the frontend
Open your browser and go to `http://localhost:8000`

### 📦 Features
👩‍💼 Manage employees, managers, customers

🛒 Add and purchase products

🧾 Track orders and transactions

🔐 Login and account creation system

📊 Organized backend queries and schema layers

---
### 🙋 Authors
Alaa Faraj (alaax159)
Adnan Odeh (AdnanOdeh04)

[alaax159, AdnanOdeh04] – see 122008_1220175.pdf for documentation

