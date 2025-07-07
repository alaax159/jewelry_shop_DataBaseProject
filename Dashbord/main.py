from typing import Optional, List

from starlette.middleware.cors import CORSMiddleware
from fastapi import FastAPI
# ################################################## schema  ###########################################################
from schema.Customer import customer_creation, customer_returned
from schema.account import account_login
from schema.Product import addNewProduct, get_All_product, search_productById, UpdateProductModel, FilterProduct
from schema.Employee import employee_create, get_All_employee, employee_returned, get_maxSalaryPos, maxSalary, \
    get_sum_and_average_salary, EditEmployee
from schema.Purchase_Order import makeOrder
from schema.Order import order_
# ######################################################################################################################
# ################################################## Query  ############################################################
from Query.Account import create_customer, login
from Query.manager_Employee import hiring_employee, get_AllEmployee, get_Employee_id, get_maxSalary_per_position, \
    get_maxSalary, SumAndAvg_salary, \
    longest_serving_employee, count_gender, getTotalPayroll, getNumberOfEmployee, editEmployee,getpatrollHistory,getTotalSalaryEmp,removeEmp
from Query.manager_product import add_new_product, retrieve_all_products, get_product_by_id, update_product, \
    delete_product, supply_products, get_products_filtered, get_productBranches, get_managerBranches, \
    get_productsBranch, \
    get_ProductByIdAndBranch, mostExpinsevProduct, mostSillingProductPerType, MostPopularProduct, \
    numberOfQuantitySoldPerType, lastProductSupply, lastProductOrdered
from Query.manager_Order import make_deliver, get_orders, get_YMorder, get_allBranch_order, get_YMorderB, \
    get_TotalNumberOFOrders, \
    get_TotalNumberOFOrdersBranch, make_shipping, make_shipping_BranchOrder, make_deliver_BranchOrder, get_order_status, \
    numberOfOrderGraterThanAvg, \
    numberOfOrderGraterThanAvgBramch, get_order_statusB, totalProfitToday, totalProfitThisYear, totalProfitThisMonth, \
    get_order_data, total_profitAndCost, number_of_quantity_perDay_month_year, topNcoustomersBasedOnMoney
from Query.manager_customer import get_all_customers, get_customersByID, customerCity, total_numberOfCustomers, \
    number_of_Newcustomers, number_of_customers, count_customersGender, count_customersVerified_OrNot, uniqueCustomer, \
    customerOrders, get_totalMoney, BlockOrUnBlock
from Query.employeeQuery import retrieve_all_productsEmp

# ######################################################################################################################
# ################################################## Images  ############################################################
# https://postimg.cc/gallery/GtzBW7b
# ######################################################################################################################
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/customerCreation")  # Query to register a new account
async def addAccount(customer: customer_creation):
    result = create_customer(customer)
    return result


@app.post("/Login")  # Qquery to login
async def login_acc(account: account_login):
    result = await login(account)
    return result


@app.post("/manager/product/addProduct")  # Query to add a new product to the database
async def addProduct(prod: addNewProduct):
    result = add_new_product(prod)
    return result


@app.post("/manager/employee/hiriing_Employee")  # Query to hir a new Employee to the database
async def hiriingEmployee(employee: employee_create):
    result = hiring_employee(employee)
    return result


@app.get("/manager/product/allProducts/{manager_id}",
         response_model=get_All_product)  # Query that retrieve all the product in the database
async def allProducts(manager_id):
    result = await retrieve_all_products(manager_id)
    return result


@app.get("/manager/product/get_productByID/{product_id}", response_model=search_productById)
async def get_ProductById(product_id):
    result = get_product_by_id(product_id)
    return result


@app.get("/manager/employee/allEmployee/{manager_id}/{start}/{end}",
         response_model=get_All_employee)  # Query that retrieve all the employees in the database
async def allEmployee(manager_id, start: int, end: int):
    result = get_AllEmployee(manager_id, start, end)
    return result


@app.patch("/manager/product/UpdateProduct/{product_id}")  # Query to update the data of a product
async def update_product_endpoint(product_id: int, product: UpdateProductModel):
    print(product)
    result = update_product(product_id, product)
    return result


@app.put("/manager/product/deleteProduct/{product_id}")  # endpoint to delete product
async def delete_product_endpoint(product_id: int):
    result = delete_product(product_id)
    return result


@app.post("/manager/product/supplyProducts")  # endpoint to supply the Products
async def makeOrder(order: makeOrder):
    result = supply_products(order)
    return result


@app.post("/manager/product/get_product_filter/{manager_id}", response_model=get_All_product)  # endpoint to filter
async def get_product_filter(manager_id: int, filter_data: FilterProduct):
    result = get_products_filtered(manager_id, filter_data)
    return result


@app.get("/manager/employee/get_employeeByID/{emp_id}",
         response_model=employee_returned)  # query to get employee using employee id
async def get_EmployeeID(emp_id):
    result = get_Employee_id(emp_id)
    return result


@app.get("/manager/employee/max_salary_per_pos/{manager_id}",
         response_model=get_maxSalaryPos)  # query to get the max salary employee per pos
async def get_maxSalaryPos(manager_id):
    result = get_maxSalary_per_position(manager_id)
    return result


@app.get("/manager/employee/max_salary_emp/{manager_id}",
         response_model=maxSalary)  # query to get the max salary employee
async def get_maxSalary_emp(manager_id):
    result = get_maxSalary(manager_id)
    return result


@app.get("/manager/employee/sum_avg_count_salary/{manager_id}", response_model=get_sum_and_average_salary)
async def get_sum_and_average_salary(manager_id):
    result = SumAndAvg_salary(manager_id)
    return result


@app.get("/manager/employee/longest_serving_employee/{manager_id}")
async def get_longest_serving_employee(manager_id):
    result = longest_serving_employee(manager_id)
    return result


@app.get("/manager/employee/countGender/{manager_id}")
async def get_countGender(manager_id):
    result = count_gender(manager_id)
    return result


@app.patch("/manager/Order/make_deliver/{order_id}")  # endpoint to make the order deleverd
async def make_deliver_status(order_id):
    result = make_deliver(order_id)
    return result


@app.get("/manager/Order/get_all_order/{start}/{end}")
async def get_all_order(start: int, end: int):
    result = get_orders(start, end)
    return result


@app.get("/manager/Order/get_TotalNumberOFOrders")
async def Get_TotalNumberOFOrders():
    result = get_TotalNumberOFOrders()
    return result


@app.get("/manager/Order/get_TotalOrders/{year}")
async def get_total_orders(year):
    result = get_YMorder(year)
    return result


@app.get("/manager/Order/allBranch_order/{manager_id}/{start}/{end}")
async def get_all_branch_order(manager_id, start: int, end: int):
    result = get_allBranch_order(manager_id, start, end)
    return result


@app.get("/manager/Order/get_AllOrderB/{manager_id}/{year}")
async def get_total_orderB(manager_id, year):
    result = get_YMorderB(manager_id, year)
    return result


@app.get("/manager/product/get_branches_Product/{manager_id}/{product_id}")
async def get_branches_Product(manager_id: int, product_id: int):
    result = get_productBranches(manager_id, product_id)
    return result


@app.get("/manager/Order/get_TotalNumberOFOrdersBranch")
async def GET_TotalNumberOFOrdersBranch():
    result = get_TotalNumberOFOrdersBranch()
    return result


@app.get("/manager/Get_managerBranches/{manager_id}")
async def GET_managerBranches(manager_id):
    result = get_managerBranches(manager_id)
    return result


@app.patch("/manager/Order/make_shipping/{order_id}")
async def MAKE_shipping(order_id):
    result = make_shipping(order_id)
    return result


@app.patch("/manager/Order/make_shipping_BranchOrder/{order_id}")
async def MAKE_shipping_BranchOrder(order_id):
    result = make_shipping_BranchOrder(order_id)
    return result


@app.patch("/manager/Order/make_deliver_BranchOrder/{order_id}")  # endpoint to make the order deleverd
async def make_deliver_status_BranchOrder(order_id):
    result = make_deliver_BranchOrder(order_id)
    return result


@app.get("/manager/Order/Count_status")
async def get_count_status():
    result = get_order_status()
    return result


@app.get("/manager/Order/numberOfOrderGraterThanAvg/{year}")
async def get_numberOfOrderGraterThanAvg(year):
    result = numberOfOrderGraterThanAvg(year)
    return result


@app.get("/manager/Order/numberOfOrderGraterThanAvgBramch/{manager_id}/{year}")
async def get_numberOfOrderGraterThanAvgBramch(manager_id, year):
    result = numberOfOrderGraterThanAvgBramch(manager_id, year)
    return result


@app.get("/manager/Order/Count_statusB/{manager_id}")
async def GET_order_statusB(manager_id):
    result = get_order_statusB(manager_id)
    return result


@app.get("/manager/Order/total_ProfitToday")
async def get_total_ProfitToday():
    result = totalProfitToday()
    return result


@app.get("/manager/Order/total_ProfitMonth")
async def get_total_ProfitMonth():
    result = totalProfitThisMonth()
    return result


@app.get("/manager/Order/total_ProfitYear")
async def get_total_ProfitYear():
    result = totalProfitThisYear()
    return result


@app.get("/manager/Order/OrderDetails/{order_id}")
async def get_order_details(order_id):
    result = get_order_data(order_id)
    return result


@app.get("/manager/Order/total_profitAndCost/{manager_id}")
async def get_total_profitAndCost(manager_id):
    result = total_profitAndCost(manager_id)
    return result


# ###################################### customer ##################################################

@app.get("/manager/Customer/get_allCustomer/{start}/{end}")  # endpoint to get all the customers
async def get_all_customer(start: int, end: int):
    result = get_all_customers(start, end)
    return result


@app.get("/manager/Customer/get_customer_by_id/{customer_id}")  # endpoint to get a customer by id
async def get_customer_by_id(customer_id):
    result = get_customersByID(customer_id)
    return result


@app.get("/manager/Customer/NumberOfCustomerPerCity")
async def get_numberOfCustomerPerCity():
    result = customerCity()
    return result


@app.get("/manager/Customer/numberOfCustomer")
async def get_numberOfCustomer():
    result = total_numberOfCustomers()
    return result


@app.get("/manager/Customer/NumberOfNewCustomer")
async def get_numberOfNewCustomer():
    result = number_of_Newcustomers()
    return result


@app.get("/manager/Customer/NumberOfCustomer")
async def get_numberOfCustomer():
    result = number_of_customers()
    return result


@app.get("/manager/Customer/count_customersGender")
async def get_count_customersGender():
    result = count_customersGender()
    return result


@app.get("/manager/Customer/count_customersVerified_OrNot")
async def get_count_customersVerified_OrNot():
    result = count_customersVerified_OrNot()
    return result


@app.get("/manager/Customer/uniqueCustomer")
async def get_unique_customer():
    result = uniqueCustomer()
    return result


@app.get("/manager/Customer/customerOrders/{customer_id}")
async def get_customerOrders(customer_id):
    result = customerOrders(customer_id)
    return result


@app.get("/manager/Customer/totalMoneyForCustomer/{customer_id}")
async def get_totalMoneyForCustomer(customer_id):
    result = get_totalMoney(customer_id)
    return result


@app.patch("/manager/Customer/BlockOrUnblock/{customer_id}/{action}")
async def blockOrUnblockCustomer(customer_id, action):
    result = BlockOrUnBlock(customer_id, action)
    return result


@app.get("/manager/product/getBranchProducts/{branch_id}")
async def get_branch_products(branch_id):
    result = get_productsBranch(branch_id)
    return result


@app.get("/manager/product/ProductByIdAndBranch/{product_id}/{branch_id}")
async def productByIdAndBranch(product_id, branch_id):
    result = get_ProductByIdAndBranch(branch_id, product_id)
    return result


@app.get("/manager/product/mostExpinsevProduct/{manager_id}")
async def get_mostExpinsevProduct(manager_id):
    result = mostExpinsevProduct(manager_id)
    return result


@app.get("/manager/product/mostSillingProductPerType/{manager_id}")
async def get_mostSillingProduct(manager_id):
    result = mostSillingProductPerType(manager_id)
    return result


@app.get("/manager/product/MostPopularProduct/{manager_id}")
async def get_mostPopularProduct(manager_id):
    result = MostPopularProduct(manager_id)
    return result


@app.get("/manager/product/numberOfQuantitySoldPerType/{manager_id}")
async def get_numberOfQuantitySoldPerType(manager_id):
    result = numberOfQuantitySoldPerType(manager_id)
    return result


@app.get("/manager/employee/getTotalPayroll/{manager_id}/{year}")
async def get_total_payroll(manager_id, year):
    result = getTotalPayroll(manager_id, year)
    return result


@app.get("/manager/employee/getNumberOfEmployee/{manager_id}")
async def get_number_of_employee(manager_id):
    result = getNumberOfEmployee(manager_id)
    return result


@app.patch("""/manager/employee/editEmployee/{employee_id}""")
async def UpdateEmployee(employee_id, empData: EditEmployee):
    print(empData)
    result = editEmployee(employee_id, empData)
    return result


@app.get("/manager/product/lastProductSupplied/{manager_id}")
async def get_lastProductSupply(manager_id):
    result = lastProductSupply(manager_id)
    return result

@app.get("/manager/product/lastProductOrderd/{manager_id}")
async def get_lastProductOrdered(manager_id):
    result = lastProductOrdered(manager_id)
    return result

@app.get("/manager/Order/number_of_quantity_perDay_month_year")
async def get_number_of_quantity_perDay_month_year():
    result = number_of_quantity_perDay_month_year()
    return result
@app.get("/manager/Order/topNCustomersBasedOnMoney/{numCustomer}")
async def get_topNCustomersBasedOnMoney(numCustomer):
    result = topNcoustomersBasedOnMoney(numCustomer)
    return result
@app.get("/manager/employee/getTotalSalaryEmp/{employee_id}")
async def get_totalSalaryEmployees(employee_id):
    result = getTotalSalaryEmp(employee_id)
    return result
@app.get("/manager/employee/getpatrollHistory/{employee_id}")
async def get_getpatrollHistory(employee_id):
    result = getpatrollHistory(employee_id)
    return result

@app.put("/manager/employee/removeEmp/{employee_id}")
async def removeEmployee(employee_id):
    result = removeEmp(employee_id)
    return result



























