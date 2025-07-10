# 💎 Jewelry Shop Database Project

A full-stack Jewelry Shop Management System built with **FastAPI** (backend), **HTML/CSS/JavaScript** (frontend), and **MySQL** database.

---

## 📁 Project Structure

```
📦 jewelry_shop_DataBaseProject
├── 📂 Dashbord/
│   ├── 📂 frontEnd/          # HTML, CSS, JS (Create Account, Login, Dashboard)
│   ├── 📂 Query/             # Python files for database queries
│   ├── 📂 schema/            # Python files for table schema representations
│   ├── 📂 service/           # Business logic or service layer
│   ├── 📄 databaseConnect.py # MySQL connection configuration
│   └── 📄 main.py            # FastAPI backend entry point
├── 📂 website/
│   ├── 📂 FrontEnd/
│   ├── 📂 Queries/
│   ├── 📂 Schemas/
│   └── 📄 main.py
├── 📄 122008_1220175.sql     # SQL file to set up the database
├── 📄 README.md
└── 📄 test_main.http         # FastAPI HTTP tests
```

---

## ⚙️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **[FastAPI](https://fastapi.tiangolo.com/)** | Backend API framework (Python) |
| **HTML/CSS/JavaScript** | Frontend user interface |
| **MySQL** | Database management system |
| **mysql-connector-python** | Database connector |

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/alaax159/jewelry_shop_DataBaseProject.git
cd jewelry_shop_DataBaseProject
```

### 2. Install Dependencies
```bash
pip install fastapi uvicorn mysql-connector-python
```

### 3. Configure MySQL Connection
Update the database configuration in `databaseConnect.py`:

```python
connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="your_password",
    database="Jewelry_shop"
)
```

### 4. Set Up Database
Import the SQL file to create the database structure:
```bash
mysql -u root -p < 122008_1220175.sql
```

### 5. Run the FastAPI Server
```bash
uvicorn Dashbord.main:app --reload
```

### 6. Access the Application
Open your browser and navigate to: `http://localhost:8000`

---

## 📦 Features

✨ **Core Functionality**
- 👩‍💼 **Employee Management** - Manage employees and managers
- 👤 **Customer Management** - Handle customer accounts and profiles
- 🛍️ **Product Management** - Add and manage jewelry products
- 🛒 **Order Processing** - Track purchases and transactions
- 🔐 **Authentication** - Secure login and account creation system
- 📊 **Organized Architecture** - Clean separation of queries and schema layers

---

## 👥 Authors

| Name | GitHub |
|------|--------|
| **Alaa Faraj** | [@alaax159](https://github.com/alaax159) |
| **Adnan Odeh** | [@AdnanOdeh04](https://github.com/AdnanOdeh04) |

📋 **Documentation**: See `1220808_1220175.pdf` for detailed project documentation.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is available under the MIT License. See the LICENSE file for more details.

---

<div align="center">
  <strong>Built with ❤️ by the Jewelry Shop Team</strong>
</div>
