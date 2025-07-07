let employees = [];
let currentPageE = 1;
const employeesPerPage = 10;
let employeeChart;
let employeeChart2;
let genderChart;
let payrollChart;

initializeEmployeeChart();

async function initializeEmployeeChart() {
  const dataEmp = await get_sum_avg_count_emp(user[0]);
  if (!dataEmp) return;

  if (employeeChart2) {
    employeeChart2.destroy();
  }

  const ctx = document.getElementById('employee-chart').getContext('2d');

  employeeChart2 = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dataEmp.map(emp => emp.position),
      datasets: [
        {
          label: 'Total Salary',
          data: dataEmp.map(emp => emp.sumSalary),
          backgroundColor: '#36A2EB',
          yAxisID: 'y',
        },
        {
          label: 'Average Salary',
          data: dataEmp.map(emp => emp.avgSalary),
          backgroundColor: '#FF6384',
          yAxisID: 'y1',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Total and Average Salary by Position'
        },
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const emp = dataEmp[context.dataIndex];
              if (context.dataset.label === 'Total Salary') {
                return `${emp.position}: Total $${emp.sumSalary.toLocaleString()} (Employees: ${emp.numEmployees})`;
              } else if (context.dataset.label === 'Average Salary') {
                return `${emp.position}: Avg $${emp.avgSalary.toFixed(2)}`;
              }
              return context.label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          position: 'left',
          title: {
            display: true,
            text: 'Total Salary ($)'
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
            text: 'Average Salary ($)'
          }
        }
      }
    }
  });
}


async function get_sum_avg_count_emp(managerId) { 
  try {
    const response = await fetch(`http://127.0.0.1:8000/manager/employee/sum_avg_count_salary/${managerId}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const data = await response.json();
    const dataChart = data.sumAndAverageList.map(item => ({
      position: item.position,
      sumSalary: item.sumSalary,
      avgSalary: item.avgSalary,
      numEmployees: item.numEmployees
    }));
    return dataChart;
  }
  catch (error) {
    console.error('Error fetching employee stats:', error);
    return null;
  }
}



document.addEventListener('DOMContentLoaded', async () => {
  if (localStorage.getItem('employees')) {
    employees = JSON.parse(localStorage.getItem('employees'));
  } else { 
    loadEmployees(user[0]);
  }
  displayEmployees();
  initializeEmployeeChart();
});

document.addEventListener('DOMContentLoaded', () => {
  const showStatsBtn = document.getElementById('show-stats-btn');
  const addEmployeeBtn = document.getElementById('add-employee-btn');
  if (addEmployeeBtn) {
    addEmployeeBtn.addEventListener('click', addEmployee);
  }
  if (showStatsBtn) {
    showStatsBtn.addEventListener('click', showEmployeeAnalysis);
  }
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('info-btn-emp')) {
    const id = e.target.getAttribute('data-id');
    showEmployeeInfo(id);
  } else if (e.target.classList.contains('edit-btn-emp')) {
    const id = e.target.getAttribute('data-id');
    updateForm(id);
  } else if (e.target.classList.contains('delete-btn-emp')) {
    const id = e.target.getAttribute('data-id');
    deleteEmployee(id);
  } else if (e.target.classList.contains('history-btn-emp')) {
    const id = e.target.getAttribute('data-id');
    showPayrollHistory(id);
  }
});

async function deleteEmployee(employeeId) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/manager/employee/removeEmp/${employeeId}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (response.ok) {
      alert('Employee deleted successfully!');
      loadEmployees(user[0]);
    } else {
      throw new Error("Failed to delete employee");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function showPayrollHistory(employeeId) {
  const payrollData = await get_payrollHistory(employeeId);
  if (!payrollData) return;

  const analysisModal = document.createElement('div');
  analysisModal.classList.add('modal');
  analysisModal.innerHTML = `
    <div class="modal-content-analysis">
      <span class="close-modal">&times;</span>
      <div class="analysis">
        <div class="analysis-details">
          <h3>Payroll History</h3>
          <table id="payroll-table">
            <thead>
              <tr>
                <th>salary</th>
                <th>Bonus</th>
                <th>total</th>
                <th>date</th>
              </tr>
            </thead>
            <tbody id="payroll-tbody">
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(analysisModal);
  analysisModal.style.display = 'block';

  const tbody = analysisModal.querySelector('#payroll-tbody');
  payrollData.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.salary}</td>
      <td>$${item.Bonus}</td>
      <td>$${item.amount}</td>
      <td>${item.created_at}</td>
    `;
    tbody.appendChild(row);
  });

  const closeBtn = analysisModal.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    analysisModal.style.display = 'none';
    analysisModal.remove();
  });

  window.addEventListener('click', (e) => {
    if (e.target === analysisModal) {
      analysisModal.style.display = 'none';
      analysisModal.remove();
    }
  });
}

async function get_payrollHistory(employeeId) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/manager/employee/getpatrollHistory/${employeeId}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching payroll history:', error);
    return null;
  }
}







async function get_employeeByID(employeeId) { 
  try { 
    const response = await fetch(`http://127.0.0.1:8000/manager/employee/get_employeeByID/${employeeId}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const employee = await response.json();
    const employeeInfo = {
      acc_id: employee.acc_id,
      user_name: employee.user_name,
      first_name: employee.first_name,
      last_name: employee.last_name,
      age: employee.age,
      email: employee.email,
      acc_password: employee.acc_password,
      street_num: employee.street_num,
      street_name: employee.street_name,
      city: employee.city,
      zip_code: employee.zip_code,
      gender: employee.gender.toLowerCase(),
      date_of_birth: employee.date_of_birth,
      created_at: employee.created_at,
      role: employee.role,
      position: employee.position,
      salary: employee.salary,
      hired_date: employee.hired_date,
      branch_id: employee.branch_id,
      Manager_id: employee.Manager_id,
      phone_num: String(employee.phone_num)
    };
    localStorage.setItem("employeeInfo", JSON.stringify(employeeInfo));
    return employeeInfo;
  }catch (error) {
    console.error('Error fetching employee:', error);
    return null;
  }
}

async function showEmployeeInfo(employeeId) {
  const employeeData = await get_employeeByID(employeeId);
  const payroll = await get_Total_payroll(employeeId);
  const test = await maxSalaryPerPosition(user[0]);
  if (!employeeData) return;

  const formattedPosition = employeeData.position.replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  const infoModal = document.createElement('div');
  infoModal.classList.add('modal');
  infoModal.innerHTML = `
    <div class="modal-content-info-emp">
      <span class="close-modal">&times;</span>
      <h2>${employeeData.first_name} ${employeeData.last_name}</h2>
      <div class="employee-info">
        <div class="info-section">
          <h3>Personal Information</h3>
          <p><strong>Username:</strong> <span>${employeeData.user_name}</span></p>
          <p><strong>Email:</strong> <span>${employeeData.email}</span></p>
          <p><strong>Phone:</strong> <span>${employeeData.phone_num || 'N/A'}</span></p>
          <p><strong>Gender:</strong> <span>${employeeData.gender.charAt(0).toUpperCase() + employeeData.gender.slice(1)}</span></p>
          <p><strong>Date of Birth:</strong> <span>${employeeData.date_of_birth}</span></p>
          <p><strong>Age:</strong> <span>${employeeData.age}</span></p>
        </div>
        
        <div class="info-section">
          <h3>Employment Details</h3>
          <p><strong>Position:</strong> <span>${formattedPosition}</span></p>
          <p><strong>Salary:</strong> <span>$${employeeData.salary.toLocaleString()}</span></p>
          <p><strong>Hired Date:</strong> <span>${employeeData.hired_date}</span></p>
          <p><strong>Role:</strong> <span>${employeeData.role}</span></p>
          <p><strong>total payroll:</strong> <span>${payroll}</span></p>
        </div>
        
        <div class="info-section">
          <h3>Address</h3>
          <p><strong>Street:</strong> <span>${employeeData.street_num} ${employeeData.street_name}</span></p>
          <p><strong>City:</strong> <span>${employeeData.city}</span></p>
          <p><strong>Zip Code:</strong> <span>${employeeData.zip_code}</span></p>
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

async function get_Total_payroll(employeeId) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/manager/employee/getTotalSalaryEmp/${employeeId}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const data = await response.json();
    return data.payroll;
  } catch (error) {
    console.error('Error fetching total payroll:', error);
    return 0;
  }
}

function showEmployeeAnalysis() {
  const analysisModal = document.createElement('div');
  analysisModal.classList.add('modal');
  analysisModal.innerHTML = `
    <div class="modal-content-analysis">
      <span class="close-modal">&times;</span>
      <div class="analysis">
        <div class="analysis-container">
            <div class="analysis-details">
              <h3>Max Salary per Position</h3>
              <div id="max-salary-data">Loading data...</div>
            </div>
        </div>
        <div class="analysis-container">
          <div class="analysis-details">
              <h3>Longest-Serving Employees</h3>
              <div id="longest-serving-employees">Loading data...</div>
            </div>
        </div>
        <div class="analysis-container">
          <div class="analysis-details">
              <h3>Employee Gender Distribution</h3>
              <div id="Employee_Gender_Distribution">
                <canvas id="gender-chart" style="height: 200px;"></canvas>
              </div>
            </div>
        </div>
      </div>
      <div class="analysis">
        <div class="analysis-container">
          <div class="analysis-details_chart_full">
            <h3>payroll per year</h3>
            <canvas id="payroll-chart""></canvas>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(analysisModal);
  analysisModal.style.display = 'block';
/////////////////////////////////////////////////////////////////////////
  const maxSalaryData = maxSalaryPerPosition(user[0]);
  maxSalaryData.then(data => {
    if (data) {
      const container = document.getElementById('max-salary-data');
      container.innerHTML = '';
      data.forEach(item => {
        const positionDiv = document.createElement('div');
        positionDiv.classList.add('analysis-part');
        positionDiv.innerHTML = `
          <p><strong>Position: </strong> <span>${item.position}</span></p>
          <p><strong>ID:</strong> <span>${item.emp_id}</span></p>
          <p><strong>Username:</strong> <span>${item.user_name}</span></p>
          <p><strong>Salary:</strong> <span>$${item.salary.toLocaleString()}</span></p>
        `;
        container.appendChild(positionDiv);
      });
    } else {
      document.getElementById('max-salary-data').innerHTML = 'No data available';
    }
  }).catch(error => {
    console.error("Promise error:", error);
    document.getElementById('max-salary-data').innerHTML = 'Error loading data';
  });
  //////////////////////////////////////////////////////////////////////////////////
  const longestServingData = longestServingEmployees(user[0]);
  console.log(longestServingData);
  longestServingData.then(data => {
    if (data) {
      const container = document.getElementById('longest-serving-employees');
      console.log("Longest serving employees data received:", data);
      container.innerHTML = '';
      const employeeDiv = document.createElement('div');
        employeeDiv.classList.add('aanalysis-part');
        employeeDiv.innerHTML = `
          <p><strong>ID:</strong> <span>${data.emp_id}</span></p>
          <p><strong>Username:</strong> <span>${data.user_name}</span></p>
          <p><strong>Position:</strong> <span>${data.position}</span></p>
          <p><strong>Salary:</strong> <span>$${data.salary.toLocaleString()}</span></p>
          <p><strong>Days Worked:</strong> <span>${data.numDays}</span></p>
        `;
        container.appendChild(employeeDiv);

    } else {
      console.log("No data available or empty array received");
      document.getElementById('longest-serving-employees').innerHTML = 'No data available';
    }
  }).catch(error => {
    console.error("Promise error:", error);
    document.getElementById('longest-serving-employees').innerHTML = 'Error loading data';
  });
  /////////////////////////////////////////////////////////////////////////////////////////////
  const genderData = get_countGender(user[0]);
  genderData.then(data => {
    if (data) {
      const canvas = document.getElementById('gender-chart');
      if (!canvas) {
        console.error('Canvas element for gender distribution not found');
        return;
      }
      const ctx = canvas.getContext('2d');
  
      if (genderChart) {
        genderChart.destroy();
      }
      console.log("Gender data received:", data);
      data.result.forEach(item => {
        console.log(item.gender, item.count);
      });
      genderChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: data.result.map(item => item.gender.charAt(0).toUpperCase() + item.gender.slice(1)),
          datasets: [{
            data: data.result.map(item => item.count),
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
              text: 'Employee Gender Distribution'
            }
          }
        }
      });
    } else {
      console.log("No data available or empty array received");
      document.getElementById('Employee_Gender_Distribution').innerHTML = 'No data available';
    }
  }).catch(error => {
    console.error("Promise error:", error);
    document.getElementById('Employee_Gender_Distribution').innerHTML = 'Error loading data';
  });
  /////////////////////////////////////////////////////////////////////////////////////////////
  const payrollData = get_payrollPerYear(user[0], 2025);
 payrollData.then(data => {
  if (data) {
    const canvas = document.getElementById('payroll-chart');
    if (!canvas) {
      console.error('Canvas element for payroll chart not found');
      return;
    }
    const ctx = canvas.getContext('2d');

    if (payrollChart) {
      payrollChart.destroy();
    }

    console.log("Payroll data received:", data);

    const months = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];

    // Initialize payroll values with zeros for each month
    const monthlyPayroll = new Array(12).fill(0);

    // Assuming data[i].month is 1-12
    data.forEach(item => {
      if (item.month >= 1 && item.month <= 12) {
        monthlyPayroll[item.month - 1] = item.totalPayroll;
      }
    });

    payrollChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [{
          label: 'Payroll ($)',
          data: monthlyPayroll,
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
            text: 'Payroll per Year'
          }
        }
      }
    });
  } else {
    console.log("No data available or empty array received");
    document.getElementById('payroll-chart').innerHTML = 'No data available';
  }
}).catch(error => {
  console.error("Promise error:", error);
  document.getElementById('payroll-chart').innerHTML = 'Error loading data';
});






  const closeBtn = analysisModal.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    analysisModal.style.display = 'none';
    analysisModal.remove();
  });

  window.addEventListener('click', (e) => {
    if (e.target === analysisModal) {
      analysisModal.style.display = 'none';
      analysisModal.remove();
    }
  });
}

async function get_payrollPerYear(managerId, year) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/manager/employee/getTotalPayroll/${managerId}/${year}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching payroll per year:', error);
    return 0;
  }
}


async function get_countGender(managerId) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/manager/employee/countGender/${managerId}`);
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

async function maxSalaryPerPosition(managerId) { 
  try {
    const response = await fetch(`http://127.0.0.1:8000/manager/employee/max_salary_per_pos/${managerId}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const data = await response.json();
    maxSalaryData = data.employeeList.map(item=>({
      position: item.position,
      emp_id: item.emp_id,
      user_name: item.user_name,
      salary: item.salary
    }));
    return maxSalaryData;
  } catch (error) {
    console.error('Error fetching max salary per position:', error);
    return null;
  }
}

async function longestServingEmployees(managerId) { 
  try {
    const response = await fetch(`http://127.0.0.1:8000/manager/employee/longest_serving_employee/${managerId}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching longest serving employees:', error);
    return null;
  }
}


async function updateForm(employeeId) { 
  const employeeInfo = await get_employeeByID(employeeId);

  const updatteEmpModal = document.createElement('div');
  updatteEmpModal.classList.add('modal');
  updatteEmpModal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>Edit Employee</h2>
      <form id="update-employee-form">
        <div class="form-group">
          <label for="edit-user_name">Username</label>
          <input type="text" id="edit-user_name" value="${employeeInfo.user_name}" required>
        </div>
        <div class="form-group">
          <label for="edit-email">Email</label>
          <input type="email" id="edit-email" value="${employeeInfo.email}" required>
        </div>
        <div class="form-group">
          <label for="edit-position">Position</label>
          <select id="edit-position" required>
            <option value="sales_associate" ${employeeInfo.position === 'sales_associate' ? 'selected' : ''}>Sales Associate</option>
            <option value="jeweler" ${employeeInfo.position === 'jeweler' ? 'selected' : ''}>Jeweler</option>
            <option value="accountant" ${employeeInfo.position === 'accountant' ? 'selected' : ''}>Accountant</option>
            <option value="security" ${employeeInfo.position === 'security' ? 'selected' : ''}>Security</option>
          </select>
        </div>
        <div class="form-group">
          <label for="edit-salary">Salary ($)</label>
          <input type="number" id="edit-salary" min="0" step="100" value="${employeeInfo.salary}" required>
        </div>
        <div class="form-group">
          <label for="address">address(street number,street name, city, zip code)</label>
          <input type="text" id="address" value="${employeeInfo.street_num}, ${employeeInfo.street_name}, ${employeeInfo.city}, ${employeeInfo.zip_code}" required>
        </div>
        <div class="form-group">
          <label for="phone">phone number</label>
          <input type="text" id="phone" value="${employeeInfo.phone_num}" required>
        </div>
        <button type="submit">Update Employee</button>
      </form>
    </div>
  `
  document.body.appendChild(updatteEmpModal);
  updatteEmpModal.style.display = 'block';

  const closeBtn = updatteEmpModal.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    updatteEmpModal.style.display = 'none';
    updatteEmpModal.remove();
  });

  window.addEventListener('click', (e) => {
    if (e.target === updatteEmpModal) {
      updatteEmpModal.style.display = 'none';
      updatteEmpModal.remove();
    }
  });

  document.getElementById('update-employee-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    await updateEmployee(employeeId);
    updatteEmpModal.style.display = 'none';
    updatteEmpModal.remove();
  });

}

async function updateEmployee(employeeId) {
  const employeeData = await get_employeeByID(employeeId);
  if (!employeeData) return;
  
  const updatedData = {};

  const user_name = document.getElementById('edit-user_name').value;
  const email = document.getElementById('edit-email').value;
  const position = document.getElementById('edit-position').value;
  const salary = parseFloat(document.getElementById('edit-salary').value);
  const addressParts = document.getElementById('address').value.split(',');
  const street_num = parseInt(addressParts[0]);
  const street_name = addressParts[1];
  const city = addressParts[2];
  const zip_code = addressParts[3];
  const phone_num = document.getElementById('phone').value;

  if (employeeData.user_name !== user_name) {
    updatedData.user_name = user_name;
  }
  if (employeeData.email !== email) {
    updatedData.email = email;
  }
  if (employeeData.position !== position) {
    updatedData.position = position;
  }
  if (employeeData.salary !== salary) {
    updatedData.salary = salary;
  }
  if (employeeData.street_num !== street_num) {
    updatedData.street_num = street_num;
  }
  if (employeeData.street_name !== street_name) {
    updatedData.street_name = street_name;
  }
  if (employeeData.city !== city) {
    updatedData.city = city;
  }
  if (employeeData.zip_code !== zip_code) {
    updatedData.zip_code = zip_code;
  }
  if (employeeData.phone_num !== phone_num) {
    updatedData.phone_num = phone_num;
  }

  if (Object.keys(updatedData).length === 0) return;

  try {
    const response = await fetch(`http://127.0.0.1:8000/manager/employee/editEmployee/${employeeId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedData)
    });

    console.log('Updated data:', updatedData);
    const data = await response.json();
    
    if (response.ok) {
      console.log('Employee updated:', data);
      alert('Employee updated successfully!');
      loadEmployees(user[0]);
    } else {
      const errorData = data;
      console.error('Server error:', errorData);
      alert(`Failed to update employee: ${errorData.detail || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Network or parsing error:', error);
    alert('An unexpected error occurred while updating the employee.');
  }
}


async function addEmployee() {
   const addEmpModal = document.createElement('div');
   addEmpModal.classList.add('modal');
   addEmpModal.innerHTML = `
     <div class="modal-content">
       <span class="close-modal">&times;</span>
       <h2>Add Employee</h2>
       <form id="add-employee-form">
         <div class="form-group">
           <label for="user_name">Username</label>
           <input type="text" id="user_name" required>
         </div>
         <div class="name-group">
           <div class="form-group">
             <label for="first_name">First Name</label>
             <input type="text" id="first_name" required>
           </div>
           <div class="form-group">
             <label for="last_name">Last Name</label>
             <input type="text" id="last_name" required>
           </div>
         </div>
         <div class="form-group">
           <label for="email">Email</label>
           <input type="email" id="email" required>
         </div>
         <div class="form-group">
           <label for="acc_password">Password</label>
           <input type="password" id="acc_password" required>
         </div>
         <div class="form-group">
           <label for="gender">Gender</label>
           <select id="gender" required>
             <option value="male">Male</option>
             <option value="female">Female</option>
           </select>
         </div>
         <div class="form-group">
           <label for="date_of_birth">Date of Birth</label>
           <input type="date" id="date_of_birth" required>
         </div>
         <div class="form-group">
           <label for="position">Position</label>
           <select id="position" required>
             <option value="sales_associate">Sales Associate</option>
             <option value="jeweler">Jeweler</option>
             <option value="accountant">Accountant</option>
             <option value="security">Security</option>
           </select>
         </div>
         <div class="form-group">
           <label for="salary">Salary ($)</label>
           <input type="number" id="salary" min="0" step="100" required>
         </div>
         <div class="form-group">
           <label for="hired_at">Hired Date</label>
           <input type="date" id="hired_at" required>
         </div>
         <div class="form-group">
           <label for="branch-select">Select Branch</label>
           <div id="branches-container">
             <select id="branch-select" required></select>
           </div>
         </div>
         <button type="submit">Add Employee</button>
       </form>
     </div>
   `;
   document.body.appendChild(addEmpModal);
   addEmpModal.style.display = 'block';
 
   const closeBtn = addEmpModal.querySelector('.close-modal');
   closeBtn.addEventListener('click', () => {
     addEmpModal.style.display = 'none';
     addEmpModal.remove();
   });
 
   window.addEventListener('click', (e) => {
     if (e.target === addEmpModal) {
       addEmpModal.style.display = 'none';
       addEmpModal.remove();
     }
   });
 
   showBranches(user[0], 'branch-select');
 
   document.getElementById('add-employee-form').addEventListener('submit', async function (event) {
     event.preventDefault();
     await AddNewEmployee();
     addEmpModal.style.display = 'none';
     addEmpModal.remove();
   });
}

async function AddNewEmployee() {
  try {
    const employee_data = {
      user_name: document.getElementById('user_name').value,
      first_name: document.getElementById('first_name').value,
      last_name: document.getElementById('last_name').value,
      email: document.getElementById('email').value,
      gender: document.getElementById('gender').value,
      date_of_birth: document.getElementById('date_of_birth').value,
      acc_password: document.getElementById('acc_password').value,
      position: document.getElementById('position').value,
      salary: parseFloat(document.getElementById('salary').value),
      hired_date: document.getElementById('hired_at').value,
      Branch_id: document.getElementById('branch-select').value
    };
  
    const response = await fetch('http://127.0.0.1:8000/manager/employee/hiriing_Employee', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(employee_data)
    });
  
    if (response.ok) {
      alert('Employee added successfully!');
      loadEmployees(user[0]);
    } else {
      throw new Error("Failed to add employee");
    }
  } catch (error) {
    console.error("Error:", error);
  }
  
}

async function createPaginationControlsEmployee() {
  const existingPagination = document.getElementById('employee-pagination-controls');
  if (existingPagination) existingPagination.remove();

  const totalEmployees = await numberOfEmployees(user[0]);
  const totalPages = Math.ceil(totalEmployees / employeesPerPage);
  if (totalPages <= 1) return;

  const paginationContainer = document.createElement('div');
  paginationContainer.id = 'employee-pagination-controls';
  paginationContainer.className = 'pagination';

  const prevButton = document.createElement('button');
  prevButton.innerHTML = '&laquo;';
  prevButton.disabled = currentPageE === 1;
  prevButton.addEventListener('click', async () => {
    if (currentPageE > 1) {
      currentPageE--;
      await loadCurrentPageEmployees();
    }
  });
  paginationContainer.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.innerText = i;
    if (currentPageE === i) pageButton.classList.add('active');
    pageButton.addEventListener('click', async () => {
      currentPageE = i;
      await loadCurrentPageEmployees();
    });
    paginationContainer.appendChild(pageButton);
  }

  const nextButton = document.createElement('button');
  nextButton.innerHTML = '&raquo;';
  nextButton.disabled = currentPageE === totalPages;
  nextButton.addEventListener('click', async () => {
    if (currentPageE < totalPages) {
      currentPageE++;
      await loadCurrentPageEmployees();
    }
  });
  paginationContainer.appendChild(nextButton);

  const employeesSection = document.querySelector('.employees-section'); 
  if (employeesSection) {
    employeesSection.appendChild(paginationContainer);
  } else {
    console.error('Employees section not found for pagination controls');
  }
}

async function numberOfEmployees(managerId) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/manager/employee/getNumberOfEmployee/${managerId}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return data.numEmployee || 0;
  } catch (error) {
    console.error('Error fetching number of employees:', error);
    return 0;
  }
}
async function loadCurrentPageEmployees() {
  const startIndex = (currentPageE - 1) * employeesPerPage;
  const endIndex = startIndex + employeesPerPage;
  await loadEmployees(user[0], startIndex, endIndex);
  displayEmployees();
  await createPaginationControlsEmployee();
}

document.addEventListener('DOMContentLoaded', async () => {
  if (localStorage.getItem('employees')) {
    employees = JSON.parse(localStorage.getItem('employees'));
  } else { 
    // Remove this line: loadEmployees(user[0]);
    // Replace with:
    await loadCurrentPageEmployees(); // This will load the first page with proper pagination
  }
  displayEmployees();
  initializeEmployeeChart();
});

async function loadEmployees(managerId, start, end) {
  try {
    // Default to first page if parameters are undefined
    const startIndex = start !== undefined ? start : 0;
    const endIndex = end !== undefined ? end : employeesPerPage;
    
    const response = await fetch(`http://127.0.0.1:8000/manager/employee/allEmployee/${managerId}/${startIndex}/${endIndex}`);
    if (!response.ok) throw new Error('Network response was not OK');
    const data = await response.json();
    employees = data.employeeList.map(item => ({
      employee_id: item.emp_id,
      user_name: item.user_name,
      position: item.position,
    }));
  } catch (error) {
    console.error('Error fetching employees:', error);
    employees = [];
  }
}

function displayEmployees() {
  const employeesContainer = document.getElementById('employees-container');
  employeesContainer.innerHTML = '';

  employees.forEach(employee => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-content">
        <h3>${employee.user_name}</h3>
        <div class="card-details">
          <p><strong>Position:</strong> ${employee.position}</p>
        </div>
        <div class="card-actions">
          <button class="info-btn-emp" data-id="${employee.employee_id}">Info</button>
          <button class="edit-btn-emp" data-id="${employee.employee_id}">Edit</button>
          <button class="delete-btn-emp" data-id="${employee.employee_id}">Delete</button>
          <button class="history-btn-emp" data-id="${employee.employee_id}">payroll history</button>
        </div>
      </div>
    `;
    employeesContainer.appendChild(card);
  });
}