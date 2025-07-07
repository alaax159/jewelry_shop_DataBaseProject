
const user = JSON.parse(localStorage.getItem('userData'));
const currentUser = document.getElementById('current-user');
const navButtons = document.querySelectorAll('.nav-btn');
const panels = document.querySelectorAll('.panel');
const addItemBtn = document.getElementById('add-item-btn');
const addItemModal = document.getElementById('add-item-modal');
const closeModal = document.querySelector('.close-modal');
const addItemForm = document.getElementById('add-item-form');
const addEmployeeBtn = document.getElementById('add-employee-btn');
const addEmployeeModal = document.getElementById('add-employee-modal');
const closeEmployeeModal = document.querySelector('.close-employee-modal');
const addEmployeeForm = document.getElementById('add-employee-form');
const logoutBtn = document.getElementById('logout-btn');

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('userData');
  localStorage.removeItem('products');
  localStorage.removeItem('employees');
  localStorage.removeItem('orders');
  localStorage.removeItem('customers');
  localStorage.removeItem('orderList');
  localStorage.removeItem('OrderListForBranch');
  window.location.href = '../login/login.html';
});

currentUser.textContent = user[1];
navButtons.forEach(button => {
  button.addEventListener('click', () => {
    navButtons.forEach(btn => btn.classList.remove('active'));
    panels.forEach(panel => panel.classList.remove('active'));
    button.classList.add('active');
    const panelId = button.getAttribute('data-panel');
    document.getElementById(panelId).classList.add('active');
  });
});



document.getElementById('add-employee-form').addEventListener('submit', async function (event) {
  event.preventDefault();
  

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

  try {
    const response = await fetch('http://127.0.0.1:8000/employee/hiriing_Employee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employee_data),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Employee added:', data);
      alert('Employee added successfully!');
    } else {
      console.error('Server error:', data);
      alert(`Failed to add employee: ${data.detail || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Network or parsing error:', error);
    alert('An unexpected error occurred while adding the employee.');
  }
});

function showBranches(manager_id) {
  fetch(`http://127.0.0.1:8000/manager/Get_managerBranches/${manager_id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not OK');
      }
      return response.json();
    })
    .then(data => {
      const branches = data.branches; 
      const select = document.getElementById('branch-select');

      select.innerHTML = '';

      const placeholder = document.createElement('option');
      placeholder.text = 'Select a branch';
      placeholder.disabled = true;
      placeholder.selected = true;
      select.appendChild(placeholder);

      branches.forEach(branchID => {
        const option = document.createElement('option');
        option.value = branchID;
        option.textContent = branchID;
        select.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching branches:', error);
    });
}


document.getElementById('add-item-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  showBranches(user[0], 'branch-select');
  const branchSelect = document.getElementById('branch-select');
  console.log(branchSelect.value);
  const product_data = {
    
    product_name: document.getElementById('product_name').value,
    product_type: document.getElementById('product_type').value,
    kerat: document.getElementById('kerat').value,
    main_factor_type: document.getElementById('main_factor_type').value,
    weight: parseFloat(document.getElementById('weight').value),
    price_per_gram: parseFloat(document.getElementById('price_per_gram').value),
    labour_cost: parseFloat(document.getElementById('labour_cost').value),
    image_path: document.getElementById('item-image').value,
    branch_id: document.getElementById('branch-select').value,
    manager_id: user[0]
  };

  console.log(product_data);

  try {
    const response = await fetch('http://127.0.0.1:8000/product/addProduct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product_data),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Product added:', data);
      alert('Product added successfully!');
    } else {
      console.error('Server error:', data);
      alert(`Failed to add product: ${data?.detail || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Network or parsing error:', error);
    alert('An unexpected error occurred while adding the product.');
  }
});

function openAddProductModal() {
  showBranches(user[0]); // Load branches for the dropdown
  // show modal, reset form, etc.
}


addItemBtn.addEventListener('click', () => {
  addItemModal.style.display = 'block';
  addItemModal.classList.remove('none');
});

closeModal.addEventListener('click', () => {
  addItemModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === addItemModal) {
    addItemModal.style.display = 'none';
  }
});

addEmployeeBtn.addEventListener('click', () => {
  addEmployeeModal.style.display = 'block';
  addEmployeeModal.classList.remove('none');
});

closeEmployeeModal.addEventListener('click', () => {
  addEmployeeModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === addEmployeeModal) {
    addEmployeeModal.style.display = 'none';
  }
});