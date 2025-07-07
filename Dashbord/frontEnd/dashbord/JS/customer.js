
let currentPageC = 1;
const customerPerPage = 8;

document.addEventListener('DOMContentLoaded', async () => {
    await loadCurrentPageCustomers();
    initializeChartCustomerCity();
});


async function get_total_customersPerCity() {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Customer/NumberOfCustomerPerCity`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching total customers:', error);
        return 0;
    }
}
let chartInstanceCustomer = null;
let chartInstanceCustomerGender = null;
let chartInstanceCustomerverified = null;

async function initializeChartCustomerCity() { 
    const data = await get_total_customersPerCity();
    const customerData = data.result;
    const labels = customerData.map(item => item.city);
    const counts = customerData.map(item => item.numberOfCustomer);
    const chartC = document.getElementById('customer-chart').getContext('2d');
    if (chartInstanceCustomer) {
        chartInstanceCustomer.destroy();
    }
    chartInstanceCustomer = new Chart(chartC, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Customers',
                data: counts,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Number of Customers per City'
                }
            }
        }
    });
}

async function get_customers(startIndex, endIndex) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Customer/get_allCustomer/${startIndex}/${endIndex}`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        customers = data.customers.map(item => ({
            customer_id: item.acc_id,
            user_name: item.user_name,
            first_name: item.first_name,
            last_name: item.last_name,
            Blocked: item.Blocked
        }));
        localStorage.setItem("customers", JSON.stringify(customers));
        return data;
    } catch (error) {
        console.error('Error fetching customers:', error);
        return [];
    }
}

async function TotalNumberOfPagesC() {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Customer/numberOfCustomer`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching total number of pages:', error);
        return 0;
    }
}


async function createCustomerPaginationControls() {
    const existingPagination = document.getElementById('customer-pagination-controls');
    if (existingPagination) existingPagination.remove();

    let totalCustomers = await TotalNumberOfPagesC();
    const totalPages = Math.ceil(totalCustomers.result / customerPerPage);
    if (totalPages <= 1) return;

    const paginationContainer = document.createElement('div');
    paginationContainer.id = 'customer-pagination-controls';
    paginationContainer.className = 'pagination';

    const prevButton = document.createElement('button');
    prevButton.innerHTML = '&laquo;';
    prevButton.disabled = currentPageC === 1;
    prevButton.addEventListener('click', async () => {
        if (currentPageC > 1) {
            currentPageC--;
            await loadCurrentPageCustomers();
        }
    });
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.className = currentPageC === i ? 'active' : '';
        pageButton.addEventListener('click', async () => {
            currentPageC = i;
            await loadCurrentPageCustomers();
        });
        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.innerHTML = '&raquo;';
    nextButton.disabled = currentPageC === totalPages;
    nextButton.addEventListener('click', async () => {
        if (currentPageC < totalPages) {
            currentPageC++;
            await loadCurrentPageCustomers();
        }
    });
    paginationContainer.appendChild(nextButton);

    document.querySelector('#customer').appendChild(paginationContainer);
}



async function loadCurrentPageCustomers() {
    const startIndex = (currentPageC - 1) * customerPerPage;
    const endIndex = startIndex + customerPerPage;
    await get_customers(startIndex, endIndex);
    showCustomers();
    await createCustomerPaginationControls();
}

function showCustomers() {
    const customersContainer = document.getElementById('customers-container');
    customersContainer.innerHTML = '';
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    customers.forEach((customer) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-content">
                <h3>${customer.user_name}</h3>
                <div class="card-details">
                    <p><strong>First Name:</strong> ${customer.first_name}</p>
                    <p><strong>Last Name:</strong> ${customer.last_name}</p>
                </div>
                <div class="card-actions">
                    <button class="info-btn-customer" data-id="${customer.customer_id}">Info</button>
                    <button class="delete-btn-customer" data-id="${customer.customer_id}" data-action="${customer.Blocked ? 'unblock' : 'block'}">${customer.Blocked ? 'Unblock' : 'Block'}</button>
                    <button class="edit-btn-customer" data-id="${customer.customer_id}">Edit</button>
                </div>
            </div>
        `;
        customersContainer.appendChild(card);
    });
}


document.addEventListener('DOMContentLoaded', () => {
  const showStatsBtn_customer = document.getElementById('show-stats-btn_customer');
  
  if (showStatsBtn_customer) {
    showStatsBtn_customer.addEventListener('click', showCustomerAnalysis);
  }
});

async function showCustomerAnalysis() {
  const analysisModal_customer = document.createElement('div');
  analysisModal_customer.classList.add('modal');
  analysisModal_customer.innerHTML = `
    <div class="modal-content-analysis">
      <span class="close-modal">&times;</span>
      <div class="analysis">
        <div class="analysis-container-div1">
            <div class="analysis-details ">
                <h3>Total customer</h3>
                <div id="Total-customer" >Loading data...</div>
            </div>
            <div class="analysis-details">
                <h3>new total customer this month</h3>
                <div id="new-total-customer-this-month">Loading data...</div>
            </div>
        </div>
        <div class="analysis-container-div1">
            <div class="analysis-details">
                <h3>Customer Gender Distribution</h3>
                <canvas id="Customer_Gender_Distribution"></canvas>
            </div>
        </div>
        <div class="analysis-container-div1">
            <div class="analysis-details">
                <h3>verified customer chart</h3>
                <canvas id="verified-customer-chart"></canvas>
            </div>
        </div>
      </div>
      <div class="analysis">
        <div class="analysis-container-div1">
            <div class="analysis-details">
                <h3>Unique customer</h3>
                    <table id="orders-table">
                    <thead>
                    <tr>
                        <th>customer ID</th>
                        <th>name</th>
                        <th>city</th>
                        <th>Order Price</th>
                        <th>info</th>
                    </tr>
                    </thead>
                    <tbody id="Customers-tbody">
                    </tbody>
                </table>
            </div>
        </div>
      </div>
      <div>

    </div>
  `;
//////////////////////////////////////////////////////////////////////////////////////////
  const totalCustomer = await get_total_customers();
  const totalCustomerContainer = analysisModal_customer.querySelector('#Total-customer');
  totalCustomerContainer.innerHTML = `
    <p style="font-size: 28px;"><strong><span>${totalCustomer.result}</span></strong> </p>
  `;
    ////////////////////////////////////////////////////////////////////////////////////
    const newCustomerThisMonth = await get_newCustomerThisMonth();
    const newCustomerThisMonthContainer = analysisModal_customer.querySelector('#new-total-customer-this-month');
    newCustomerThisMonthContainer.innerHTML = `
    <p style="font-size: 28px;"><strong><span>${newCustomerThisMonth.result}</span></strong> </p>
  `;
    ////////////////////////////////////////////////////////////////////////////////////
    const dataGender = await get_countGender();
    const countGender = dataGender.result;
    const canvas = analysisModal_customer.querySelector('#Customer_Gender_Distribution');
    if (!canvas) {
        console.error('Canvas element for gender distribution not found');
        return;
    }
    const ctx = canvas.getContext('2d');

    if (chartInstanceCustomerGender) {
        chartInstanceCustomerGender.destroy();
    }
    chartInstanceCustomerGender = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: countGender.map(item => 
                item.gender.charAt(0).toUpperCase() + item.gender.slice(1)
            ),
            datasets: [{
                data: countGender.map(item => item.count),
                backgroundColor: ['#4285F4', '#EA4335'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Customer Gender Distribution'
                }
            }
        }
    });
    ////////////////////////////////////////////////////////////////////////////////////
    
    const verifiedCustomerData = await get_verifiedCustomer();

    const verifiedCustomerContainer = analysisModal_customer.querySelector('#verified-customer-chart');
    if (!verifiedCustomerContainer) {
        console.error('verifiedCustomerContainer element for verified customer distribution not found');
        return;
    }
    const verifiedCustomerCtx = verifiedCustomerContainer.getContext('2d');

    if (chartInstanceCustomerverified) {
        chartInstanceCustomerverified.destroy();
    }

    chartInstanceCustomerverified = new Chart(verifiedCustomerCtx, {
        type: 'pie',
        data: {
            labels: ['Not Verified', 'Verified'],
            datasets: [{
                data: [verifiedCustomerData.not_verified, verifiedCustomerData.is_verified],
                backgroundColor: ['#EA4335', '#34A853'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Verified vs Not Verified Customers'
                }
            }
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////
    const dataUniqueCustomer = await get_uniqueCustomer();
    const uniqueCustomerData = dataUniqueCustomer.result;
    const uniqueCustomerContainer = analysisModal_customer.querySelector('#Customers-tbody');
    if (!uniqueCustomerContainer) {
        console.error('uniqueCustomerContainer element for unique customer not found');
        return;
    }
    uniqueCustomerData.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.customer_id}</td>
            <td>${customer.first_name+' '+customer.last_name}</td>
            <td>${customer.city}</td>
            <td>${customer.order_price}</td>
            <td><button class="info-btn-customer" data-id="${customer.customer_id}">Info</button></td>
        `;
        uniqueCustomerContainer.appendChild(row);
    });

    
  document.body.appendChild(analysisModal_customer);
  analysisModal_customer.style.display = 'block';

  const closeBtn = analysisModal_customer.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    analysisModal_customer.style.display = 'none';
    analysisModal_customer.remove();
  });

  window.addEventListener('click', (e) => {
    if (e.target === analysisModal_customer) {
      analysisModal_customer.style.display = 'none';
      analysisModal_customer.remove();
    }
  });
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('info-btn-customer')) {
      const id = e.target.getAttribute('data-id');
      showCustomerInfo(id);
  }else if (e.target.classList.contains('edit-btn-customer')) {
      const id = e.target.getAttribute('data-id');
      
   
  }else if (e.target.classList.contains('delete-btn-customer')) {
    const id = e.target.getAttribute('data-id');
    const action = e.target.getAttribute('data-action');
    BlockOrUnblockCustomer(id, action);
  }
});
async function BlockOrUnblockCustomer(customerId, action) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Customer/BlockOrUnblock/${customerId}/${action}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            alert(`Customer ${action}ed successfully!`);
            loadCurrentPageCustomers();
        } else {
            const errData = await response.json();
            throw new Error(errData.detail || "Failed to update customer");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error: " + error.message);
    }
}


async function showCustomerInfo(customerId) {
    const customerData = await get_customerByID(customerId);
    const CustomerMoneySpent = await get_customerMoneySpent(customerId);
    if (!customerData) return;
  
    const infoModal = document.createElement('div');
    infoModal.classList.add('modal');
    infoModal.innerHTML = `
      <div class="modal-content-info-customer">
        <span class="close-modal">&times;</span>
        <h2>${customerData.first_name} ${customerData.last_name}</h2>
        <div class="customer-info">
          <div class="info-section">
            <h3>Personal Information</h3>
            <p><strong>Customer ID:</strong> <span>${customerData.acc_id}</span></p>
            <p><strong>Username:</strong> <span>${customerData.user_name}</span></p>
            <p><strong>Email:</strong> <span>${customerData.email}</span></p>
            <p><strong>Phone:</strong> <span>${customerData.phone_num || 'N/A'}</span></p>
            <p><strong>Gender:</strong> <span>${customerData.gender.charAt(0).toUpperCase() + customerData.gender.slice(1)}</span></p>
            <p><strong>Date of Birth:</strong> <span>${customerData.date_of_birth}</span></p>
          </div>
          <div class="info-section">
            <div class="Address">
                <h3>Address</h3>
                <p><strong>Street:</strong> <span>${customerData.street_num} ${customerData.street_name}</span></p>
                <p><strong>City:</strong> <span>${customerData.city}</span></p>
                <p><strong>Zip Code:</strong> <span>${customerData.zip_code}</span></p>
            </div>
            <div class="orders">
                <h3>total money spent</h3>
                <p><strong>Total Price:</strong> <span>$${CustomerMoneySpent.result}</span></p>
            </div>
          </div>
        </div>
        <div class="customer-orders">
          <h3>Orders</h3>
          <table id="customer-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Price</th>
                <th>Order Status</th>
                <th>Payment Method</th>
                <th>Delivery Data</th>
                <th>Created At</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody id="customer-orders-tbody">

      </div>
    `;
    
    const customerOrders = await get_customerOrders(customerId);
    const customerOrdersContainer = infoModal.querySelector('#customer-orders-tbody');
    if (!customerOrdersContainer) {
        console.error('customerOrdersContainer element for customer orders not found');
        return;
    }
    customerOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.order_id}</td>
            <td>${order.order_price}</td>
            <td>${order.order_status}</td>
            <td>${order.payment_method}</td>
            <td>${order.delivery_data}</td>
            <td>${order.created_at}</td>
            <td><button class="action-btn" onclick="showOrderDetails(${order.order_id})">Details</button></td>
        `;
        customerOrdersContainer.appendChild(row);
    });


  
    document.body.appendChild(infoModal);
    infoModal.style.display = 'block';
  
    const closeBtn = infoModal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
      infoModal.style.display = 'none';
      infoModal.remove();
    });
  
    window.addEventListener('click', (e) => {
      if (e.target === infoModal) {
        infoModal.style.display = 'none';
        infoModal.remove();
      }
    });
}

async function get_customerMoneySpent(customerId) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Customer/totalMoneyForCustomer/${customerId}`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching customer money spent:', error);
        return 0;
    }

}


async function get_customerOrders(customerId) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Customer/customerOrders/${customerId}`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();

        orders = data.result.map(item => ({
            order_id: item.order_id,
            order_price: item.order_price,
            order_status: item.order_status,
            payment_method: item.payment_method,
            delivery_data: item.delivery_data,
            created_at: item.created_at
        }));

        return orders;
    } catch (error) {
        console.error('Error fetching customer orders:', error);
        return [];
    }
}

async function get_customerByID(customerId) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Customer/get_customer_by_id/${customerId}`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching customer:', error);
        return null;
    }
}


async function get_uniqueCustomer() {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Customer/uniqueCustomer`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching unique customer:', error);
        return 0;
    }
}


async function get_verifiedCustomer() {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Customer/count_customersVerified_OrNot`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching verified customer:', error);
        return 0;
    }
}


async function get_total_customers() {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Customer/NumberOfCustomer`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching total customers:', error);
        return 0;
    }
}

async function customerTotalPriceOrder() {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Customer/totalPriceOrder`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching total price order:', error);
        return 0;
    }
}
async function get_countOrder() {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Customer/countGender`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching count gender:', error);
        return 0;
    }
}

async function get_countGender() {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Customer/count_customersGender`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching count gender:', error);
        return 0;
    }
}

async function get_newCustomerThisMonth() {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Customer/NumberOfNewCustomer`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching new customer this month:', error);
        return 0;
    }
}