let orderList = JSON.parse(localStorage.getItem('orderList')) || [];
let OrderListForBranch = JSON.parse(localStorage.getItem('OrderListForBranch')) || [];
let currentPageO = 1;
const ordersPerPage = 8;

document.addEventListener('DOMContentLoaded', async () => {
    await loadCurrentPageOrders();
    initializeChartOrder();
});


document.getElementById('order_type').addEventListener('change', async () => {
    await initializeChartOrder();
    await loadCurrentPageOrders();      
});
let chartInstance = null;
let chartInstance2 = null;

async function initializeChartOrder() {
    const orderTypeSelect = document.getElementById('order_type');

    let monthlyOrders = [];
    const ordersPerMonth = Array(12).fill(0);
    const revenuePerMonth = Array(12).fill(0);

    if (orderTypeSelect.value === 'customer') {
        const data = await get_total_orders(2025);
        monthlyOrders = data.YMOrder;
    } else if (orderTypeSelect.value === 'Branch') {
        const data = await get_Total_order_branch(user[0],2025);
        monthlyOrders = data.YMOrder;
    }

    monthlyOrders.forEach(entry => {
        const monthIndex = new Date(`${entry.order_month}-01`).getMonth();
        ordersPerMonth[monthIndex] = entry.total_orders;
        revenuePerMonth[monthIndex] = entry.price;
    });

    const ctx = document.getElementById('order-chart').getContext('2d');
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                'January', 'February', 'March', 'April',
                'May', 'June', 'July', 'August',
                'September', 'October', 'November', 'December'
            ],
            datasets: [
                {
                    type: 'bar',
                    label: 'Orders',
                    data: ordersPerMonth,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    type: 'line',
                    label: 'Revenue ($)',
                    data: revenuePerMonth,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Order Statistics'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Orders'
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    },
                    title: {
                        display: true,
                        text: 'Revenue ($)'
                    }
                }
            }
        }
    });
}

async function Get_all_orders(startIndex, endIndex) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Order/get_all_order/${startIndex}/${endIndex}`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        console.log(data);
        orderList = data.orders.map(item => ({
            order_id: item.order_id,
            created_at: item.created_at,
            order_price: item.order_price,
            delivery_data: item.delivery_data,
            order_status: item.order_status
        }));

        localStorage.setItem("orderList", JSON.stringify(orderList));
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

async function get_Total_order_branch(manager_id, year) {
   try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Order/get_AllOrderB/${manager_id}/${year}`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching total orders:', error);
        return 0;
    }
}

async function Get_all_orders_forBranch(manager_id, start, end) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Order/allBranch_order/${manager_id}/${start}/${end}`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        console.log(data);
        OrderListForBranch = data.orders.map(item => ({
            Purchase_Order_id: item.Purchase_Order_id,
            Purchase_Order_status: item.Purchase_Order_status,
            total_cost: item.total_cost,
            expected_delivery: item.expected_delivery,
            created_at: item.created_at
        }));
        
        localStorage.setItem("OrderListForBranch", JSON.stringify(OrderListForBranch));
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}



function showOrders() {
    const orderTypeSelect = document.getElementById('order_type');
    const OrderContainer = document.getElementById('orders-tbody');
    OrderContainer.innerHTML = '';
    let ordersToShow = [];

    if (orderTypeSelect.value === "customer") {
        ordersToShow = orderList;
        ordersToShow.forEach(order => {
            const row = document.createElement('tr');

            let actionButton = '';
            if (order.order_status === "Pending") {
                actionButton = `<button class="action-btn" id="btn-${order.order_id}" onclick="shipOrder(${order.order_id})">Ship</button>`;
            } else if (order.order_status === "Shipped") {
                actionButton = `<button class="action-btn" id="btn-${order.order_id}" onclick="deliverOrder(${order.order_id})">Deliver</button>`;
            } else if (order.order_status === "Delivered") {
                actionButton = `<button class="action-btn" id="btn-${order.order_id}" disabled>Completed</button>`;
}

            row.innerHTML = `
                <td>${order.order_id}</td>
                <td>${order.created_at}</td>
                <td>$${order.order_price}</td>
                <td>${order.delivery_data}</td>
                <td>${order.order_status}</td>
                <td>${actionButton}</td>
                <td><button class="action-btn" onclick="showOrderDetails(${order.order_id})">Details</button></td>
            `;
            OrderContainer.appendChild(row);
        });
    } else if (orderTypeSelect.value === "Branch") {
        ordersToShow = OrderListForBranch;
        ordersToShow.forEach(order => {
            const row = document.createElement('tr');

            let actionButton = '';
            if (order.Purchase_Order_status === "Pending") {
                actionButton = `<button class="action-btn" id="btn-${order.Purchase_Order_id}" onclick="shipBranchOrder(${order.Purchase_Order_id})">Ship</button>`;
            } else if (order.Purchase_Order_status === "Shipped") {
                actionButton = `<button class="action-btn" id="btn-${order.Purchase_Order_id}" onclick="deliverBranchOrder(${order.Purchase_Order_id})">Deliver</button>`;
            } else if (order.Purchase_Order_status === "Delivered") {
                actionButton = `<button class="action-btn" id="btn-${order.Purchase_Order_id}" disabled>Completed</button>`;
            }

            row.innerHTML = `
                <td>${order.Purchase_Order_id}</td>
                <td>${order.created_at}</td>
                <td>$${order.total_cost}</td>
                <td>${order.expected_delivery}</td>
                <td>${order.Purchase_Order_status}</td>
                <td>${actionButton}</td>
                <td><button class="action-btn" onclick="showOrderDetails(${order.Purchase_Order_id})">Details</button></td>
            `;
            OrderContainer.appendChild(row);
        });
    }
}

async function showOrderDetails(order_id) {
    const order = await get_order_details(order_id);
    orderDetails = order.result;
    if (!orderDetails) {
        return;
    }
    const infoModal = document.createElement('div');
    infoModal.classList.add('modal');
    infoModal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>Order Details</h2>
      <div class="order-info">
        <div class="info-section">
          <h3>Order Information</h3>
          <p><strong>Order ID:</strong> <span>${orderDetails.order_id}</span></p>
          <p><strong>Created At:</strong> <span>${orderDetails.created_at}</span></p>
          <p><strong>Order Price:</strong> <span>$${orderDetails.order_price}</span></p>
          <p><strong>Delivery Data:</strong> <span>${orderDetails.delivery_data}</span></p>
          <p><strong>Order Status:</strong> <span>${orderDetails.order_status}</span></p>
          <p><strong>Payment Method:</strong> <span>${orderDetails.payment_method}</span></p>
        </div>
        <div class="info-section">
          <h3>Customer Information</h3>
          <p><strong>Customer ID:</strong> <span>${orderDetails.customer_id}</span></p>
          <p><strong>First Name:</strong> <span>${orderDetails.user_name}</span></p>
          <p><strong>Last Name:</strong> <span>${orderDetails.first_name}</span></p>
          <p><strong>Email:</strong> <span>${orderDetails.email}</span></p>
          <p><strong>Phone:</strong> <span>${orderDetails.phone_num}</span></p>
        </div>
        <div class="info-section">
          <h3>Product Information</h3>
          ${orderDetails.products.map(item => `
            <div class="product-item">
              <p><strong>Product ID:</strong> <span>${item.product_id}</span></p>
              <p><strong>Product Name:</strong> <span>${item.Product_name}</span></p>
              <p><strong>Product Type:</strong> <span>${item.product_type}</span></p>
              <p><strong>Quantity:</strong> <span>${item.quantity}</span></p>
              <p><strong>Unit Price:</strong> <span>$${item.unit_price}</span></p>
              <p><strong>subtotal:</strong> <span>${item.subtotal}</span></p>
              <p><strong>Weight:</strong> <span>${item.weight} g</span></p>
              <br>
            </div>
          `).join('')}

        </div>
      </div>
    </div>
  `;

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

async function get_order_details(order_id) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Order/OrderDetails/${order_id}`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching order details:', error);
        return null;
    }
}

async function shipOrder(orderId) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Order/make_shipping/${orderId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            alert('Order shipped successfully!');
            loadCurrentPageOrders();
        } else {
            throw new Error("Failed to ship order");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function deliverOrder(orderId) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Order/make_deliver/${orderId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            alert('Order delivered successfully!');
            loadCurrentPageOrders();
        } else {
            throw new Error("Failed to deliver order");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function shipBranchOrder(orderId) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Order/make_shipping_BranchOrder/${orderId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            alert('Order shipped successfully!');
            loadCurrentPageOrders();
        } else {
            throw new Error("Failed to ship order");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function deliverBranchOrder(orderId) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Order/make_deliver_BranchOrder/${orderId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            alert('Order delivered successfully!');
            loadCurrentPageOrders();
        } else {
            throw new Error("Failed to deliver order");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}



async function TotalNumberOfPages() {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Order/get_TotalNumberOFOrders`);
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

async function TotalNumberOfOrderBranch() {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Order/get_TotalNumberOFOrdersBranch`);
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

async function createOrderPaginationControls() {
    const existingPagination = document.getElementById('order-pagination-controls');
    if (existingPagination) existingPagination.remove();
    const orderTypeSelect = document.getElementById('order_type');
    let totalOrders = 0;

    if (orderTypeSelect.value === "customer") {
        totalOrders = await TotalNumberOfPages();
    }else if (orderTypeSelect.value === "Branch") {
        totalOrders = await TotalNumberOfOrderBranch();
    }

    const totalPages = Math.ceil(totalOrders.numberOfOrders / ordersPerPage);
    if (totalPages <= 1) return;

    const paginationContainer = document.createElement('div');
    paginationContainer.id = 'order-pagination-controls';
    paginationContainer.className = 'pagination';

    const prevButton = document.createElement('button');
    prevButton.innerHTML = '&laquo;';
    prevButton.disabled = currentPageO === 1;
    prevButton.addEventListener('click', async () => {
        if (currentPageO > 1) {
            currentPageO--;
            await loadCurrentPageOrders();
        }
    });
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.className = currentPageO === i ? 'active' : '';
        pageButton.addEventListener('click', async () => {
            currentPageO = i;
            await loadCurrentPageOrders();
        });
        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.innerHTML = '&raquo;';
    nextButton.disabled = currentPageO === totalPages;
    nextButton.addEventListener('click', async () => {
        if (currentPageO < totalPages) {
            currentPageO++;
            await loadCurrentPageOrders();
        }
    });
    paginationContainer.appendChild(nextButton);

    document.querySelector('#orders').appendChild(paginationContainer);
}

async function loadCurrentPageOrders() {
    const startIndex = (currentPageO - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;

    const orderTypeSelect = document.getElementById('order_type');

    if (orderTypeSelect.value === "customer") {
        await Get_all_orders(startIndex, endIndex);
    } else if (orderTypeSelect.value === "Branch") {
        await Get_all_orders_forBranch(user[0], startIndex, endIndex);
        console.log(OrderListForBranch);
    }

    showOrders();
    await createOrderPaginationControls();
}


async function get_total_orders(year) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/manager/Order/get_TotalOrders/${year}`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching total orders:', error);
        return 0;
    }
}


document.addEventListener('DOMContentLoaded', () => {
  const showStatsBtn_order = document.getElementById('show-stats-btn_orders');
  if (showStatsBtn_order) {
    showStatsBtn_order.addEventListener('click', showOrderAnalysis);
  }
});

async function showOrderAnalysis() {
    const orderTypeSelect = document.getElementById('order_type');
    const orderType = orderTypeSelect.value.toLowerCase(); 

    const analysisModal_order = document.createElement('div');
    analysisModal_order.classList.add('modal');
    analysisModal_order.innerHTML = `
    <div class="modal-content-analysis">
      <span class="close-modal">&times;</span>
      <div class="analysis">
        <div class="analysis-container">
            <div class="analysis-details" style="height: 400px;">
                <h3>Number of order grater than avg/month</h3>
                <canvas id="OrderGraterThanAvg" style="width:100%; height:400px;"></canvas>
            </div>
        </div>
      </div>
      <div class="analysis">
        <div class="analysis-container">
            <div class="analysis-details">
                <h3>Order based on status</h3>
                <div id="Order_based_on_status">Loading data...</div>
            </div>
            <div class="analysis-details">
                <h3 id="summary"></h3>
                <div id="total_profitAndCost">Loading data...</div>                
            </div>
        </div>
        <div class="analysis-container">
            <div class="analysis-details">
                <h3>Total Profit/Today</h3>
                <div id="Total_Profit_today">Loading data...</div>
            </div>
            <div class="analysis-details">
                <h3>Total Profit/month</h3>
                <div id="Total_Profit_this_month">Loading data...</div>
            </div>
            <div class="analysis-details">
                <h3>Total Profit/year</h3>
                <div id="Total_Profit_this_year">Loading data...</div>
            </div>
        </div>
      </div>
      <div class="analysis">
        <div class="analysis-container">
            <div class="analysis-details">
                <h3>Top 5 Customers</h3>
                <table id="top-customer-table">
                    <thead>
                        <tr>
                            <th>Customer ID</th>
                            <th>Name</th>
                            <th>City</th>
                            <th>Total Spending</th>
                        </tr>
                    </thead>
                    <tbody id="top-customer-tbody">
                        <!-- Results will appear here -->
                    </tbody>
                </table>
            </div>
        </div>
        <div class="analysis-container">
            <div class="analysis-details">
                <h3>product sold</h3>
                <table id="product-sold-table">
                    <thead>
                        <tr>
                            <th>day</th>
                            <th>month</th>
                            <th>year</th>
                        </tr>
                    </thead>
                    <tbody id="product-sold-tbody">
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
    `;

    document.body.appendChild(analysisModal_order);
    analysisModal_order.style.display = 'block';

    const summaryElement = analysisModal_order.querySelector("#summary");
    if (orderType === "customer") {
        summaryElement.innerHTML = `Total Profit <span style="color: green;">&#x25B2;</span>`;
    } else if (orderType === "branch") {
        summaryElement.innerHTML = `Total Spent <span style="color: red;">&#x25BC;</span>`;
    }

    const totalProfitAndCost = await get_total_profitAndCost(user[0]);
    const totalProfitAndCostContainer = analysisModal_order.querySelector('#total_profitAndCost');
    if (orderType === "customer") {
        totalProfitAndCostContainer.innerHTML = `
            <p style="color: green; font-size: 40px; font-weight: 100; letter-spacing: 1px;">
            <strong><span>$${totalProfitAndCost.profit}</span></strong></p>
            `;
    } else if (orderType === "branch") {
        totalProfitAndCostContainer.innerHTML = `
          <p style="color: red; font-size: 40px; font-weight: 100; letter-spacing: 1px;">
          <strong><span>$${totalProfitAndCost.cost}</span></strong></p>
            `;
    }



    ///////////////////////////////////////////////////////////////
    let Order_basedOnStatus = [];
    if (orderType === "customer") {
        Order_basedOnStatus = get_count_order_status();
    } else if (orderType === "branch") {
        Order_basedOnStatus = get_count_order_statusB(user[0]);
    }

    Order_basedOnStatus.then(data => {
        if (data) {
            const container = document.getElementById('Order_based_on_status');
            container.innerHTML = '';
            data.order_status.forEach(item => {
                const statusDiv = document.createElement('div');
                statusDiv.classList.add('analysis-part');
                statusDiv.innerHTML = `
                    <p><strong>Status:</strong> <span>${item.order_status}</span></p>
                    <p><strong>Count:</strong> <span>${item.number_order}</span></p>
                `;
                container.appendChild(statusDiv);
            });
        } else {
            document.getElementById('Order_based_on_status').innerHTML = 'No data available';
        }
    }).catch(error => {
        console.error("Promise error:", error);
        document.getElementById('Order_based_on_status').innerHTML = 'Error loading data';
    });
    /////////////////////////////////////////////////////////////////////

    let monthlyOrders = [];
    const ordersPerMonth2 = Array(12).fill(0);
    const revenuePerMonth2 = Array(12).fill(0);

    if (orderType === 'customer') {
        const data = await get_count_order_greater_than_avg(2025);
        monthlyOrders = data.countOrder;
    } else if (orderType === 'branch') {
        const data = await get_count_order_greater_than_avgB(user[0], 2025);
        console.log(data);
        monthlyOrders = data.countOrder;
    }

    monthlyOrders.forEach(entry => {
        const monthIndex = new Date(`${entry.order_month}-01`).getMonth();
        ordersPerMonth2[monthIndex] = entry.numberOrder;
        revenuePerMonth2[monthIndex] = entry.price;
    });
    const chartO = document.getElementById('OrderGraterThanAvg').getContext('2d');
    if (chartInstance2) {
        chartInstance2.destroy();
    }
    chartInstance2 = new Chart(chartO, {
        type: 'bar',
        data: {
            labels: [
                'January', 'February', 'March', 'April',
                'May', 'June', 'July', 'August',
                'September', 'October', 'November', 'December'
            ],
            datasets: [
                {
                    type: 'bar',
                    label: 'Orders',
                    data: ordersPerMonth2,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    type: 'line',
                    label: 'Revenue ($)',
                    data: revenuePerMonth2,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Order Statistics'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Orders'
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    },
                    title: {
                        display: true,
                        text: 'Revenue ($)'
                    }
                }
            }
        }
    });

    ///////////////////////////////////////////////////////////////////
    const totalProfitToday = await get_total_profit_today();
    const totalProfitThisMonth = await get_total_profit_this_month();
    const totalProfitThisYear = await get_total_profit_this_year();
    console.log(totalProfitToday);
    console.log(totalProfitThisMonth);
    console.log(totalProfitThisYear);

    document.getElementById('Total_Profit_today').innerHTML = `
        <p><strong>Today:</strong> <span>${totalProfitToday.day}</span></p>
        <p><strong><span>$${totalProfitToday.ProfitToday}</span></strong></p>
    `;
    document.getElementById('Total_Profit_this_month').innerHTML = `
        <p><strong>Month:</strong> <span>${totalProfitThisMonth.Month}</span></p>
        <p><strong><span>$${totalProfitThisMonth.ProfitMonth}</span></strong></p>
    `;
    document.getElementById('Total_Profit_this_year').innerHTML = `
        <p><strong>Year:</strong> <span>${totalProfitThisYear.Year}</span></p>
        <p><strong><span>$${totalProfitThisYear.ProfitYear}</span></strong></p>
    `;

    const customers = await get_top_customer(5);

    const tbody = document.getElementById('top-customer-tbody');
    tbody.innerHTML = '';
    
    if (!customers || !customers.result || customers.result.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="4" style="text-align: center;">No customers found</td>';
        tbody.appendChild(row);
        return;
    }
    
    customers.result.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.acc_id}</td>
            <td>${customer.user_name}</td>
            <td>${customer.city}</td>
            <td>$${customer.totalPrice.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });


    const productSold = await get_product_sold();
    const productSoldContainer = analysisModal_order.querySelector('#product-sold-tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${productSold.dayQ || 0}</td>
        <td>${productSold.monthQ || 0}</td>
        <td>${productSold.yearQ || 0}</td>
    `;

    // Append the row to the container
    productSoldContainer.appendChild(row);

    const closeBtn = analysisModal_order.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        analysisModal_order.style.display = 'none';
        analysisModal_order.remove();
    });

    window.addEventListener('click', (e) => {
        if (e.target === analysisModal_order) {
            analysisModal_order.style.display = 'none';
            analysisModal_order.remove();
        }
    });
}

async function get_product_sold() { 
    try { 
        response = await fetch(`http://127.0.0.1:8000/manager/Order/number_of_quantity_perDay_month_year`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        return data.result;
    }catch (error) {
        console.error('Error fetching product sold:', error);
        return null;
    }
}

async function get_top_customer(numberOfTopCustomer) { 
    try { 
        response = await fetch(`http://127.0.0.1:8000/manager/Order/topNCustomersBasedOnMoney/${numberOfTopCustomer}`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        return data;
    }catch (error) {
        console.error('Error fetching top customer:', error);
        return null;
    }
}


async function get_total_profitAndCost(manager_id) { 
    try { 
        response = await fetch(`http://127.0.0.1:8000/manager/Order/total_profitAndCost/${manager_id}`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        return data;
    }catch (error) {
        console.error('Error fetching total profit today:', error);
        return null;
    }
}


async function get_total_profit_today() { 
    try { 
        response = await fetch(`http://127.0.0.1:8000/manager/Order/total_ProfitToday`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        return data;
    }catch (error) {
        console.error('Error fetching total profit today:', error);
        return null;
    }
}
async function get_total_profit_this_month() { 
    try { 
        response = await fetch(`http://127.0.0.1:8000/manager/Order/total_ProfitMonth`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        return data;
    }catch (error) {
        console.error('Error fetching total profit this month:', error);
        return null;
    }
}
async function get_total_profit_this_year() { 
    try { 
        response = await fetch(`http://127.0.0.1:8000/manager/Order/total_ProfitYear`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        return data;
    }catch (error) {
        console.error('Error fetching total profit this year:', error);
        return null;
    }
}





async function get_count_order_status() { 
    try { 
        response = await fetch(`http://127.0.0.1:8000/manager/Order/Count_status`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        return data;
    }catch (error) {
        console.error('Error fetching order status count:', error);
        return null;
    }
}
async function get_count_order_statusB(manager_id) { 
    try { 
        response = await fetch(`http://127.0.0.1:8000/manager/Order/Count_statusB/${manager_id}`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        return data;
    }catch (error) {
        console.error('Error fetching order status count:', error);
        return null;
    }
}
async function get_count_order_greater_than_avg(year) { 
    try { 
        response = await fetch(`http://127.0.0.1:8000/manager/Order/numberOfOrderGraterThanAvg/${year}`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        return data;
    }catch (error) {
        console.error('Error fetching order greater than avg:', error);
        return null;
    }
}
async function get_count_order_greater_than_avgB(manager_id,year) { 
    try { 
        response = await fetch(`http://127.0.0.1:8000/manager/Order/numberOfOrderGraterThanAvgBramch/${manager_id}/${year}`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        return data;
    }catch (error) {
        console.error('Error fetching order greater than avg:', error);
        return null;
    }
}

