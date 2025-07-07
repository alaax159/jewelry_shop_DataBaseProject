from datetime import datetime
from databaseConnect import connect_db
from fastapi import HTTPException


# ################################################# hiring new employee ################################################
def hiring_employee(Emp):
    conn = connect_db()
    cursor = conn.cursor()
    try:

        cursor.execute(
            """INSERT INTO p_account 
            (user_name, first_name, last_name, age, email, acc_password,
              gender, date_of_birth, created_at, role)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (
                Emp.user_name,
                Emp.first_name,
                Emp.last_name,
                Emp.age,
                Emp.email,
                Emp.acc_password,
                Emp.gender,
                Emp.date_of_birth,
                datetime.utcnow(),
                'Employee'
            ))

        acc_id = cursor.lastrowid

        cursor.execute(
            "SELECT Manager_id FROM jewelry_branch WHERE branch_id = %s", (Emp.Branch_id,))
        result = cursor.fetchone()
        if result is None:
            raise HTTPException(status_code=404, detail="manager not found")
        Manager_id = result[0]
        print(Manager_id)
        cursor.execute(
            """INSERT INTO employee 
            (emp_id, position, salary, hired_at, branch_id, Manager_id) 
            VALUES (%s, %s, %s, %s, %s, %s)""",
            (acc_id, Emp.position, Emp.salary, Emp.hired_date, Emp.Branch_id, Manager_id))

        conn.commit()
        return {"success": True, "employee_id": acc_id}

    except Exception as e:
        conn.rollback()
        print(f"Error: {e}")
        return {"error": str(e)}

    finally:
        cursor.close()
        conn.close()


# ######################################################################################################################

# ############################################# retrieve all employees #################################################

def get_AllEmployee(manager_id,start, end):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""SELECT e.emp_id,a.user_name,e.position FROM employee e ,p_account a
        WHERE 
        e.emp_id = a.acc_id AND
        e.Manager_id = %s""", (manager_id,))
        rows = cursor.fetchall()
        if rows is None:
            raise HTTPException(status_code=404, detail="employee not found")
        paginated_rows = rows[start:end]
        employees = [
            {
                "emp_id": row[0],
                "user_name": row[1],
                "position": row[2],
            }
            for row in paginated_rows
        ]
        return {
            "employeeList": employees,
        }
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()


# ######################################################################################################################

# #################################### get employee by ID #############################################################
def get_Employee_id(emp_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""SELECT a.acc_id,
                            a.user_name,
                            a.first_name,
                            a.last_name,
                            a.age,
                            a.email,
                            a.acc_password,
                            a.street_num,
                            a.street_name,
                            a.city,
                            a.zip_code,
                            a.gender,
                            a.date_of_birth,
                            a.created_at,
                            a.role,
                            e.position,
                            e.salary,
                            e.hired_at,
                            e.branch_id,
                            e.Manager_id,
                            ap.phone_num FROM employee e, p_account a ,account_phone ap WHERE e.emp_id = %s AND e.emp_id = a.acc_id AND ap.acc_id = a.acc_id""",
                       (emp_id,))
        row = cursor.fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="employee not found")
        print(row)
        result = {
            "acc_id": row[0],
            "user_name": row[1],
            "first_name": row[2],
            "last_name": row[3],
            "age": row[4],
            "email": row[5],
            "acc_password": row[6],
            "street_num": row[7],
            "street_name": row[8],
            "city": row[9],
            "zip_code": row[10],
            "gender": row[11].lower(),
            "date_of_birth": row[12],
            "created_at": row[13],
            "role": row[14],
            "position": row[15],
            "salary": row[16],
            "hired_date": row[17],
            "branch_id": row[18],
            "Manager_id": row[19],
            "phone_num": str(row[20])
        }
        return result
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()


def get_maxSalary(manager_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""SELECT e.emp_id, a.user_name, e.position,e.salary FROM employee e 
                        join p_account a ON e.emp_id = a.acc_id
                        where
                        e.salary = (select max(e2.salary) from employee e2) AND e.Manager_id = %s""", (manager_id,))
        row = cursor.fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="employee not found")
        employees = {
            "emp_id": row[0],
            "user_name": row[1],
            "position": row[2],
            "salary": row[3],
        }
        return employees
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()


def get_maxSalary_per_position(manager_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:  # here the first join is to join the employee with the account table then we join with the return of a select that return the max salary for every position that we have
        cursor.execute("""SELECT e.emp_id, a.user_name, e.position, e.salary FRPM FROM employee e 
        join p_account a ON e.emp_id = a.acc_id join (
        select position ,max(salary) as maxSalary from employee
        group by position) as max_salary on e.position = max_salary.position and e.salary = max_salary.maxSalary and e.Manager_id = %s
        order by e.salary desc""", (manager_id,))
        rows = cursor.fetchall()
        if rows is None:
            raise HTTPException(status_code=404, detail="employee not found")
        employees = [
            {
                "emp_id": row[0],
                "user_name": row[1],
                "position": row[2],
                "salary": row[3]
            }
            for row in rows
        ]
        result = {
            "employeeList": employees,
        }
        return result
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()


def SumAndAvg_salary(manager_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select e.position,sum(e.salary) as sumSalary , avg(e.salary) as avgSalary,count(*) as numEmployees from employee e
                            where 
                            e.Manager_id = %s 
                            group by e.position order by e.position;""", (manager_id,))
        rows = cursor.fetchall()
        if rows is None:
            raise HTTPException(status_code=404, detail="error in finding the sum or avg")
        result = [
            {
                "position": row[0],
                "sumSalary": row[1],
                "avgSalary": row[2],
                "numEmployees": row[3]
            }
            for row in rows
        ]
        fin_result = {
            "sumAndAverageList": result,
        }
        return fin_result
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()


def delete_emp(emp_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""update employee set emp_active = 1 
                            where 
                            emp_id = %s""", (emp_id,))
        conn.commit()
    except HTTPException as http_err:
        conn.rollback()
        raise http_err
    finally:
        cursor.close()
        conn.close()


# ######################################################################################################################
# ########################################## ##################################################
def longest_serving_employee(manager_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select e.emp_id,e.position,e.salary,datediff(CURDATE(),e.hired_at) as numDays,p.user_name from employee e join p_account p on p.acc_id = e.emp_id
                            where
                            datediff(CURDATE(),e.hired_at) = (select max(datediff(CURDATE(),e2.hired_at)) from employee e2) AND e.Manager_id = %s
                            order by numDays desc;""", (manager_id,))
        row = cursor.fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="employee not found")
        return {
            "emp_id": row[0],
            "position": row[1],
            "salary": row[2],
            "numDays": row[3],
            "user_name": row[4],
        }
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()


# ######################################################################################################################
# ####################################### ################################################
def count_gender(manager_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select count(*) as genderCount, p.gender from employee e join p_account p on p.acc_id = e.emp_id
                            WHERE e.Manager_id = %s
                            group by p.gender""", (manager_id,))
        rows = cursor.fetchall()
        if rows is None:
            raise HTTPException(status_code=404, detail="employee not found")
        result = [
            {
                "genderCount": row[0],
                "gender": row[1],
            }
            for row in rows
        ]
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
# ######################################################################################################################
def getTotalPayroll(manager_id,year):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select sum(pa.amount) as totalPayroll,date_format(created_at,'%m') as created_at from payroll pa
                            join employee e on e.emp_id = pa.emp_id
                            where 
                            e.Manager_id = %s AND
                            date_format(created_at,'%Y') = %s
                            group by  date_format(created_at,'%m');""",(manager_id,year))
        rows = cursor.fetchall()
        if rows is None:
            raise HTTPException(status_code=404, detail="employee not found")
        result = [
            {
                "totalPayroll":row[0],
                "month": row[1]
            }
            for row in rows
        ]
        return {"result": result}
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

def getNumberOfEmployee(manager_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select count(*) as numEmployee from employee
                            WHERE Manager_id = %s""",(manager_id,))
        row = cursor.fetchone()
        if row is None:
            return {"numEmployee": 0}
        return {"numEmployee": row[0]}
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

# ######################################################################################################################
# ########################################### edit employee info #######################################################

def editEmployee(employee_id,empData):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        update_fieldsE = []
        update_fieldsA = []
        valuesE = []
        valuesA = []
        if empData.user_name is not None:
            update_fieldsA.append('user_name = %s')
            valuesA.append(empData.user_name)
        if empData.position is not None:
            update_fieldsE.append('position = %s')
            valuesE.append(empData.position)
        if empData.salary is not None:
            update_fieldsE.append('salary = %s')
            valuesE.append(empData.salary)
        if empData.email is not None:
            update_fieldsA.append('email = %s')
            valuesA.append(empData.email)
        if empData.street_num is not None:
            update_fieldsA.append('street_num = %s')
            valuesA.append(empData.street_num)
        if empData.city is not None:
            update_fieldsA.append('city = %s')
            valuesA.append(empData.city)
        if empData.street_name is not None:
            update_fieldsA.append('street_name = %s')
            valuesA.append(empData.street_name)
        if empData.zip_code is not None:
            update_fieldsA.append('zip_code = %s')
            valuesA.append(empData.zip_code)


        if not update_fieldsE and not update_fieldsA:
            raise HTTPException(status_code=404, detail="employee not found")

        if update_fieldsE:
            query = f"update employee set {', '.join(update_fieldsE)} where emp_id = %s"
            valuesE.append(employee_id)
            cursor.execute(query, valuesE)
        if update_fieldsA:
            query = f"update p_account set {', '.join(update_fieldsA)} where acc_id = %s"
            valuesA.append(employee_id)
            cursor.execute(query, valuesA)
        if empData.phone_num is not None:
            query = f"update account_phone set phone_num = %s where acc_id = %s"
            values = [empData.phone_num, employee_id]
            cursor.execute(query, values)

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="employee not found")
        conn.commit()
        return {"result": "employee updated successfully"}
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()


def getTotalSalaryEmp(employee_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select sum(p.amount) from employee e 
                            join payroll p on e.emp_id = p.emp_id
                            where
                            e.emp_id = %s
                            group by e.emp_id;""", (employee_id,))
        row = cursor.fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="employee not found")
        return {"payroll": row[0]}
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

def getpatrollHistory(employee_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""select e.salary,p.Bonus,p.amount,p.created_at from employee e 
                            join payroll p on e.emp_id = p.emp_id
                            where
                            e.emp_id = %s
                            group by e.emp_id,e.salary,p.Bonus,p.amount,p.created_at;""",(employee_id,))
        rows = cursor.fetchall()
        if rows is None:
            raise HTTPException(status_code=404, detail="employee not found")
        result = [
            {
                "salary": row[0],
                "Bonus": row[1],
                "amount": row[2],
                "created_at": row[3],
            }
            for row in rows
        ]
        return {"result": result}
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

def removeEmp(employee_id):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""update employee set emp_active = 0
                            where emp_id = %s;""",(employee_id,))
        conn.commit()
        return {"result": "employee deactivate successfully"}
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()


