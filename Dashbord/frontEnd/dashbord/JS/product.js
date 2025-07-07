let products = JSON.parse(localStorage.getItem('products')) || [];
const product_info = {};
let productChart;
let currentPage = 1;
const productsPerPage = 10;
let chartInstanceProductType = null;

const productTypeCheckboxes = document.querySelectorAll('input[name="product-filter"]');
const priceRangeInput = document.getElementById('price-range');

const priceRange = document.getElementById('price-range');
const priceDisplay = document.getElementById('price-display');
const displayOrder = document.getElementById('order-btn');

priceRange.addEventListener('input', function() {
  priceDisplay.textContent = `$${priceRange.value}`;
});
const storedProducts = localStorage.getItem('products');
if (storedProducts) {
  try {
    products = JSON.parse(storedProducts);
  } catch (error) {
    console.error('Error parsing products from localStorage:', error);
  }
}

initializeChart();

function initializeChart() {
  const ctx = document.getElementById('product-chart').getContext('2d');
  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: function(chart) {
      if (chart.config.type === 'doughnut') {
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#333';
        ctx.fillText(total, (chartArea.left + chartArea.right) / 2, (chartArea.top + chartArea.bottom) / 2);
        ctx.font = '14px Arial';
        ctx.fillText('Total Products', (chartArea.left + chartArea.right) / 2, ((chartArea.top + chartArea.bottom) / 2) + 25);
        ctx.restore();
      }
    }
  };

  Chart.register(centerTextPlugin);

  productChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Ring', 'Necklace', 'Bracelet', 'Pendant', 'Earrings', 'Chain','Anklet'],
      datasets: [{
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: ['#FFD700', '#D8A39D', '#D2B48C', '#8B0000', '#27408B','#8C7853','#3CB371'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'right',
        },
      }
    }
  });
}

function updateProductStats() {
  let ringCount = 0;
  let necklaceCount = 0;
  let braceletCount = 0;
  let earringCount = 0;
  let pendantCount = 0;
  let ankletCount = 0;
  let chainCount = 0;

  console.log('Total products:', products.length);
  products.forEach(product => {
    console.log('Product type:', product.product_type);
    
    switch (product.product_type.toLowerCase()) {
      case 'ring': ringCount++; break;
      case 'necklace': necklaceCount++; break;
      case 'bracelet': braceletCount++; break;
      case 'earrings': earringCount++; break;
      case 'pendant': pendantCount++; break;
      case 'anklet': ankletCount++; break;
      case 'chain': chainCount++; break;
      default: console.log('Unknown product type:', product.product_type);
    }
  });
  console.log('Counts:', {ringCount, necklaceCount, braceletCount, earringCount, pendantCount, ankletCount, chainCount});
  if (productChart) {
    productChart.data.datasets[0].data = [
      ringCount,
      necklaceCount,
      braceletCount,
      pendantCount,
      earringCount,
      chainCount,
      ankletCount
    ];
    productChart.update();
  }
}

function displayProducts() {
  const inventoryContainer = document.getElementById('inventory-container');
  inventoryContainer.innerHTML = '';
  updateProductStats();
  const startIndex = (currentPage - 1) * productsPerPage;//here the JS will know where to start taking the products from the array 
  const endIndex = startIndex + productsPerPage;//here the JS will know where to end taking the products from the array 
  const productsToShow = products.slice(startIndex, endIndex);
  

  productsToShow.forEach((product, index) => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <div class="card-image">
        <img src="${product.image_url}" alt="${product.product_name}">
      </div>
      <div class="card-content">
        <h3>${product.product_name}</h3>
        <div class="card-details">
          <p><strong>Type:</strong> ${product.product_type}</p>
        </div>
        <div class="card-actions">
          <button class="info-btn" data-id="${product.product_id}">Info</button>
          <button class="edit-btn" data-id="${product.product_id}">Edit</button>
          <button class="delete-btn" data-id="${product.product_id}">Delete</button>
        </div>
      </div>
    `;

    inventoryContainer.appendChild(card);
  });
  createPaginationControls();
}



function createPaginationControls() {
  const existingPagination = document.getElementById('pagination-controls');
  if (existingPagination) {
    existingPagination.remove();
  }
  
  const totalPages = Math.ceil(products.length / productsPerPage);
  if (totalPages <= 1) return;
  
  const paginationContainer = document.createElement('div');
  paginationContainer.id = 'pagination-controls';
  paginationContainer.className = 'pagination';
  
  const prevButton = document.createElement('button');
  prevButton.innerHTML = '&laquo;';
  prevButton.className = currentPage === 1 ? 'disabled' : '';
  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      displayProducts();
    }
  });
  paginationContainer.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.innerText = i;
    pageButton.className = currentPage === i ? 'active' : '';
    pageButton.addEventListener('click', () => {
      currentPage = i;
      displayProducts();
    });
    paginationContainer.appendChild(pageButton);
  }

  const nextButton = document.createElement('button');
  nextButton.innerHTML = '&raquo;';
  nextButton.className = currentPage === totalPages ? 'disabled' : '';
  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayProducts();
    }
  });
  paginationContainer.appendChild(nextButton);

  document.getElementById('inventory').appendChild(paginationContainer);
}

function loadProduct(managerId) {
  fetch(`http://127.0.0.1:8000/manager/product/allProducts/${managerId}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    return response.json();
  })
  .then(data => {
      products = data.products.map(item => ({
      product_id: item.product_id,
      product_name: item.product_name,
      product_type: item.product_type.toLowerCase(),
      image_url: item.image_path,
      deleted: item.deleted
    }));

    localStorage.setItem("products", JSON.stringify(products));
    currentPage = 1;
    displayProducts();
  })
  .catch(error => {
    console.error('Error fetching products:', error);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('products')) {
    products = JSON.parse(localStorage.getItem('products'));
    displayProducts();
  } else { 
    loadProduct(user[0]);
  }
  initializeChart();
  
});

async function get_productByID(productID) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/manager/product/get_productByID/${productID}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }

    const product = await response.json();

    const product_info = {
      product_name: product.product_name,
      product_type: product.product_type.toLowerCase(),
      kerat: product.kerat,
      main_factor_type: product.main_factor_type,
      weight: product.weight,
      price_per_gram: product.price_per_gram,
      labour_cost: product.labour_cost,
      image_path: product.image_path,
      quantity: product.quantity,
      discount: product.discount
    };
    console.log(product_info);
    return product_info;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}


async function get_productByIDAndBranch(productID, branchID) {
  try {
    console.log(branchID);
    const response = await fetch(`http://127.0.0.1:8000/manager/product/ProductByIdAndBranch/${productID}/${branchID}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }

    const product = await response.json();

    const product_info = {
      product_name: product.product_name,
      product_type: product.product_type.toLowerCase(),
      kerat: product.kerat,
      main_factor_type: product.main_factor_type,
      weight: product.weight,
      price_per_gram: product.price_per_gram,
      labour_cost: product.labour_cost,
      image_path: product.image_path,
      quantity: product.quantity,
      discount: product.discount
    };
    console.log(product_info);
    return product_info;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function showProductInfo(productId) {
  const productData = await get_productByID(productId);
  const data = await Get_branches(user[0], productId);
  Branches = data.branches;
  const BranchesList = [];
  Branches.forEach(branch => {
    BranchesList.push(branch.branch_id);
  });
  if (!productData) return;

  // Calculate total price
  const basePrice = productData.weight * productData.price_per_gram;
  const totalBeforeDiscount = basePrice + productData.labour_cost;
  const discountAmount = totalBeforeDiscount * (productData.discount / 100);
  const totalPrice = totalBeforeDiscount - discountAmount;

  const infoModal = document.createElement('div');
  infoModal.classList.add('modal');
  infoModal.innerHTML = `
    <div class="modal-content-info">
      <span class="close-modal">&times;</span>
      <h2>${productData.product_name}</h2>
      <div class="product-info">
        <div class="product-image">
          <img src="${productData.image_path}" alt="${productData.product_name}" class="product-image-info">
        </div>
        <div class="product-details">
          <div class="info-section">
            <h3>Product Information</h3>
            <p><strong>Product ID:</strong> <span>${productId}</span></p>
            <p><strong>Type:</strong> <span>${productData.product_type.charAt(0).toUpperCase() + productData.product_type.slice(1)}</span></p>
            <p><strong>Karat:</strong> <span>${productData.kerat}K</span></p>
            <p><strong>Weight:</strong> <span>${productData.weight} g</span></p>
            <p><strong>Origin:</strong> <span>${productData.main_factor_type.charAt(0).toUpperCase() + productData.main_factor_type.slice(1)}</span></p>
          </div>
          
          <div class="info-section">
            <h3>Pricing Details</h3>
            <p><strong>Price/Gram:</strong> <span>$${productData.price_per_gram.toLocaleString()}</span></p>
            <p><strong>Labour Cost:</strong> <span>$${productData.labour_cost.toLocaleString()}</span></p>
            <p><strong>Base Price:</strong> <span>$${basePrice.toLocaleString()}</span></p>
            
            <p><strong>Discount:</strong> <span>${productData.discount}%</span></p>
            <p><strong>Quantity:</strong> <span>${productData.quantity || 0}</span></p>
            <p><strong>Branches:</strong> <span>${BranchesList.join(', ')}</span></p>
          </div>
          
          <div class="total-price-section">
            Total Price: $${totalPrice.toLocaleString()}
          </div>
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

async function Get_branches(productId, managerId) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/manager/product/get_branches_Product/${managerId}/${productId}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching branches:', error);
    return null;
  }
  
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('info-btn')) {
    const id = e.target.getAttribute('data-id');
    showProductInfo(id);
  }else if (e.target.classList.contains('edit-btn')) {
    const id = e.target.getAttribute('data-id');
    showEditProductForm(id);
  }else if (e.target.classList.contains('delete-btn')) {
    const id = e.target.getAttribute('data-id');
    deleteProduct(id);
  }else if (e.target.classList.contains('supply-btn')) {
    const id = e.target.getAttribute('data-id');
    const branchId = e.target.getAttribute('data-branch');
    addSupply(id, branchId);
  }
});

async function showEditProductForm(productId) {
  const productData = await get_productByID(productId);
  if (!productData) return;
  
  const editModal = document.createElement('div');
  editModal.classList.add('modal');
  editModal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>Edit ${productData.product_name}</h2>
      <form id="edit-product-form">
        <input type="hidden" id="edit-product-id" value="${productId}">
        <div class="form-group">
          <label for="edit-product-name">Product Name</label>
          <input type="text" id="edit-product-name" value="${productData.product_name}" required>
        </div>
        <div class="form-group">
          <label for="edit-weight">Weight (grams)</label>
          <input type="number" id="edit-weight" min="0.01" step="0.01" value="${productData.weight}" required>
        </div>
        <div class="form-group">
          <label for="edit-price-per-gram">Price Per Gram ($)</label>
          <input type="number" id="edit-price-per-gram" min="0.01" step="0.01" value="${productData.price_per_gram}" required>
        </div>
        <div class="form-group">
          <label for="edit-labour-cost">Labour Cost ($)</label>
          <input type="number" id="edit-labour-cost" min="0" step="0.01" value="${productData.labour_cost}" required>
        </div>
        <div class="form-group">
          <label for="edit-discount">Discount (%)</label>
          <input type="number" id="edit-discount" min="0" value="${productData.discount}" required>
        </div>
        <button type="submit">Update Product</button>
      </form>
    </div>
  `;
  
  document.body.appendChild(editModal);
  editModal.style.display = 'block';
  
  const closeBtn = editModal.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    editModal.style.display = 'none';
    editModal.remove();
  });
  
  window.addEventListener('click', (e) => {
    if (e.target === editModal) {
      editModal.style.display = 'none';
      editModal.remove();
    }
  });
  
  document.getElementById('edit-product-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    await updateProduct(productId);
    editModal.style.display = 'none';
    editModal.remove();
  });
}

async function updateProduct(productId) { 
  const productData = await get_productByID(productId);
  if (!productData) return;
  
  const updatedData = {};

  const name = document.getElementById('edit-product-name').value;
  const weight = parseFloat(document.getElementById('edit-weight').value);
  const price_per_gram = parseFloat(document.getElementById('edit-price-per-gram').value);
  const labour_cost = parseFloat(document.getElementById('edit-labour-cost').value);
  const discount = parseFloat(document.getElementById('edit-discount').value);

  if (productData.product_name !== name) { 
    updatedData.name = name;
  }
  if (productData.weight !== weight) { 
    updatedData.weight = weight;
  }
  if (productData.price_per_gram !== price_per_gram) { 
    updatedData.price_per_gram = price_per_gram;
  }
  if (productData.labour_cost !== labour_cost) { 
    updatedData.labour_cost = labour_cost;
  }
  if (productData.discount !== discount) { 
    updatedData.discount = discount;
  }

  if (Object.keys(updatedData).length === 0) return;

  try {
    const response = await fetch(`http://127.0.0.1:8000/manager/product/UpdateProduct/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedData)
    });

    console.log('Updated data:', updatedData);
    const data = await response.json();
    if (response.ok) {
      console.log('Product updated:', data);
      alert('Product updated successfully!');
      loadProduct(user[0]);
    } else {
      const errorData = data;
      console.error('Server error:', errorData);
      alert(`Failed to update product: ${errorData.detail || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Network or parsing error:', error);
    alert('An unexpected error occurred while updating the product.');
  }
}


async function deleteProduct(productId) { 
  try { 
    const response = await fetch(`http://127.0.0.1:8000/manager/product/deleteProduct/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ deleted: true }) 
    });
    console.log("aaaa")
    if (response.ok) {
      alert(`product deleted successfully`);
    } else { 
      throw new Error("Failed to update product");
     }

    const data = await response.json();
    console.log("Product updated successfully:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

let supplyList = localStorage.getItem('supplyList') ? JSON.parse(localStorage.getItem('supplyList')) : {};

async function addSupply(productId, branchId) {
  const productData = await get_productByIDAndBranch(productId, branchId);
  if (!productData) return;
  
  const quantity = prompt(`How many ${productData.product_name} would you like to add to supply?`);
  if (quantity === null) return;
  
  const quantityNum = parseInt(quantity);
  if (isNaN(quantityNum) || quantityNum <= 0) {
    alert("Please enter a valid positive number");
    return;
  }

  if (!supplyList[branchId]) {
    supplyList[branchId] = [];
  }

  const branchSupply = supplyList[branchId];
  const existingItemIndex = branchSupply.findIndex(item => item.product_id === productId);
  if (existingItemIndex !== -1) {
    branchSupply[existingItemIndex].quantity += quantityNum;
    alert(`Updated ${productData.product_name} quantity to ${branchSupply[existingItemIndex].quantity}`);
  } else {
    branchSupply.push({
      product_id: productId,
      quantity: quantityNum,
      unit_price: productData.price_per_gram,
      product_name: productData.product_name,
      product_type: productData.product_type
    });
    alert(`Added ${quantityNum} ${productData.product_name}(s) to supply list`);
  }

  localStorage.setItem('supplyList', JSON.stringify(supplyList));
}

displayOrder.addEventListener('click', () => {
  supplyList = JSON.parse(localStorage.getItem('supplyList')) || {};

  const orderModal = document.createElement('div');
  orderModal.classList.add('modal');

  orderModal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>Supply Order</h2>
      <label for="branch-select-order">Select Branch:</label>
      <select id="branch-select-order" required></select>
      <div id="branch-supply-table"></div>
    </div>
  `;

  document.body.appendChild(orderModal);
  orderModal.style.display = 'block';

  const closeBtn = orderModal.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    orderModal.style.display = 'none';
    orderModal.remove();
  });

  const branchSelect = orderModal.querySelector('#branch-select-order');
  showBranches(user[0], 'branch-select-order');

  const tableContainer = orderModal.querySelector('#branch-supply-table');

  branchSelect.addEventListener('change', () => {
    const branchId = branchSelect.value;
    const branchSupply = supplyList[branchId] || [];

    if (branchSupply.length === 0) {
      tableContainer.innerHTML = `<p>No items added to supply list for this branch yet.</p>`;
      return;
    }

    let tableRows = '';
    branchSupply.forEach((item, index) => {
      tableRows += `
        <tr>
          <td>${item.product_name}</td>
          <td>${item.product_type}</td>
          <td>${item.quantity}</td>
          <td>$${item.unit_price}</td>
          <td><button class="delete-supply-btn" data-index="${index}" data-branch="${branchId}">Remove</button></td>
        </tr>
      `;
    });

    tableContainer.innerHTML = `
      <table class="supply-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
          <tr>
            <td colspan="3">Total</td>
            <td>$${branchSupply.reduce((acc, item) => acc + item.unit_price * item.quantity, 0)}</td>
            <td>${branchSupply.reduce((acc, item) => acc + item.quantity, 0)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <button id="confirm-order-btn" class="top-btn">Confirm Order</button>
    `;

    // Re-bind delete and confirm actions after rendering
    const deleteButtons = tableContainer.querySelectorAll('.delete-supply-btn');
    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.getAttribute('data-index'));
        const branch = button.getAttribute('data-branch');
        supplyList[branch].splice(index, 1);
        if (supplyList[branch].length === 0) {
          delete supplyList[branch];
        }
        localStorage.setItem('supplyList', JSON.stringify(supplyList));
        branchSelect.dispatchEvent(new Event('change'));
      });
    });

    const confirmBtn = tableContainer.querySelector('#confirm-order-btn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        createSupplyOrder(branchId);
        delete supplyList[branchId];
        localStorage.setItem('supplyList', JSON.stringify(supplyList));
        orderModal.style.display = 'none';
        orderModal.remove();
      });
    }
  });

  window.addEventListener('click', (e) => {
    if (e.target === orderModal) {
      orderModal.style.display = 'none';
      orderModal.remove();
    }
  });
});


async function createSupplyOrder(branchId) { 
  const today = new Date();
  const oneWeekLater = new Date(today);
  oneWeekLater.setDate(today.getDate() + 7);
  const expectedDeliveryStr = oneWeekLater.toISOString().split('T')[0];
  const branchSupply = supplyList[branchId];
  if (!branchSupply || branchSupply.length === 0) {
    alert("No items found for this branch to create a supply order.");
    return;
  }

  const supplyData = {
    Purchase_Order_status: "Pending",
    expected_delivery: expectedDeliveryStr,
    branch_id: branchId,
    order_line: branchSupply.map(item => ({
      Product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price
    }))
  };

  console.log("Submitting supply order:", supplyData);

  try {
    const response = await fetch('http://127.0.0.1:8000/manager/product/supplyProducts', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(supplyData)
    });

    if (response.ok) {
      alert('Supply order created successfully!');
      delete supplyList[branchId];
      localStorage.setItem('supplyList', JSON.stringify(supplyList));
    } else {
      const errorText = await response.text();
      throw new Error("Failed to create supply order: " + errorText);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error creating supply order: ' + error.message);
  }
}



async function filterProducts() {
  const selectedTypes = [];
  let allTypesSelected = false;
  productTypeCheckboxes.forEach(checkbox => {
    if (checkbox.checked) {
      if (checkbox.value === 'all') {
        allTypesSelected = true;
      } else {
        selectedTypes.push(checkbox.value);
      }
    }
  });

  const maxPrice = parseInt(priceRangeInput.value);
  const filterData = {
    max_price: maxPrice,
    min_price: 0
  };
  if (!allTypesSelected && selectedTypes.length > 0) {
    filterData.type = selectedTypes;
  }
  
  try {
    const response = await fetch(`http://127.0.0.1:8000/manager/product/get_product_filter/${user[0]}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(filterData)
    });
    
    if (!response.ok) {
      throw new Error('Filter request failed');
    }
    
    const data = await response.json();
    products = data.products.map(item => ({
      product_id: item.product_id,
      product_name: item.product_name,
      product_type: item.product_type.toLowerCase(),
      image_url: item.image_path,
    }));
    
    localStorage.setItem('products', JSON.stringify(products));
    currentPage = 1;
    displayProducts();
    
  } catch (error) {
    console.error('Error filtering products:', error);
    alert('Failed to filter products. Please try again.');
  }
}


document.addEventListener('DOMContentLoaded', async () => {
  const managerId = user[0]; // Assuming `user[0]` is the manager ID

  const max = await maxPrice(managerId);
  if (max > 0) {
    priceRangeInput.max = max;
    priceRangeInput.value = max;
    priceDisplay.textContent = `$${max}`;
  }

  // Trigger initial filter with updated price
  filterProducts();
});

async function maxPrice(managerId) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/manager/product/mostExpinsevProduct/${managerId}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const data = await response.json();
    return data.maxPrice;
  } catch (error) {
    console.error('Error fetching max price:', error);
    return 0;
  }
}


// Add event listeners for filter controls
productTypeCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', (e) => {
    // If "All Types" is checked, uncheck other options
    if (e.target.value === 'all' && e.target.checked) {
      productTypeCheckboxes.forEach(cb => {
        if (cb.value !== 'all') {
          cb.checked = false;
        }
      });
    } 
    // If any other option is checked, uncheck "All Types"
    else if (e.target.value !== 'all' && e.target.checked) {
      const allTypesCheckbox = document.querySelector('input[name="product-filter"][value="all"]');
      allTypesCheckbox.checked = false;
    }
    // If no options are checked, check "All Types"
    const anyChecked = Array.from(productTypeCheckboxes).some(cb => cb.checked && cb.value !== 'all');
    if (!anyChecked) {
      const allTypesCheckbox = document.querySelector('input[name="product-filter"][value="all"]');
      allTypesCheckbox.checked = true;
    }
    
    filterProducts();
  });
});

priceRangeInput.addEventListener('change', filterProducts);

priceRange.addEventListener('input', function() {
  priceDisplay.textContent = `${priceRange.value}`;
});

showSupplierWindow
document.addEventListener('DOMContentLoaded', () => { 
  const showStatsBtn_inventory = document.getElementById('show-stats-btn_inventory');
  const additemBtn = document.getElementById('add-item-btn');
  const supplierWindowBtn = document.getElementById('supplierWindow-btn');

  if (showStatsBtn_inventory) {
    
    showStatsBtn_inventory.addEventListener('click', showInventoryAnalysis);
  }

  if (additemBtn) { 
    additemBtn.addEventListener('click', AddProductForm);
  }

  if (supplierWindowBtn) {
    supplierWindowBtn.addEventListener('click', showSupplierWindow);
  }
});

async function showInventoryAnalysis() {
  const analysisModal_inventory = document.createElement('div');
  analysisModal_inventory.classList.add('modal');
  analysisModal_inventory.innerHTML = `
    <div class="modal-content-analysis">
      <span class="close-modal">&times;</span>
      <div class="analysis">
        <div class="analysis-container">
            <div class="analysis-details">
                <h3>Most popular product</h3>
                <table id="most-popular-products-table">
                    <thead>
                        <tr>
                            <th>product ID</th>
                            <th>Product Name</th>
                            <th>Product Type</th>
                            <th>Quantity Sold</th>
                            <th>Total Price</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody id="most-popular-product-tbody">
                    </tbody>
                </table>
            </div>
        </div>
        <div class="analysis-container">
            <div class="analysis-details">
                <h3>Most selling products per type</h3>
                <table id="most-selling-products-table">
                    <thead>
                        <tr>
                            <th>product ID</th>
                            <th>Product Name</th>
                            <th>Product Type</th>
                            <th>Quantity Sold</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody id="most-selling-products-tbody">
                    </tbody>
                </table>
            </div>
        </div>
      </div>
      <div class="analysis">
        <div class="analysis-container">
          <div class="analysis-details_chart_full">
            <h3>Number of Quantity Sold per Type</h3>
            <canvas id="quantity-sold-chart" style="width:100%; height:400px;"></canvas>
          </div>
        </div>
      </div>
      <div class="analysis">
        <div class="analysis-container">
          <div class="analysis-details">
            <h3>list product supplied</h3>
            <table id="ordered-products-table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Product Type</th>
                  <th>total price</th>
                  <th>quantity</th>
                </tr>
              </thead>
              <tbody id="ordered-products-tbody">
              </tbody>
            </table>
          </div>
          <div class="analysis-details">
            <h3>list product Ordered</h3>
            <table id="ordered-products-table-Ordered">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Product Type</th>
                  <th>total price</th>
                  <th>quantity</th>
                </tr>
              </thead>

        </div>
      </div>
    </div>
  `;

  const MostSellingProducts = await MostSellingProductsPerType(user[0]);
  const mostSellingProductsContainer = analysisModal_inventory.querySelector('#most-selling-products-tbody');
  MostSellingProducts.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.product_id}</td>
      <td>${item.product_name}</td>
      <td>${item.product_type}</td>
      <td>${item.QuantitySold}</td>
      <td><button class="info-btn" data-id="${item.product_id}">Details</button></td>
    `;
    mostSellingProductsContainer.appendChild(row);
  });


  const MostPopularProductData = await MostPopularProduct(user[0]);
  console.log(MostPopularProductData);
  const mostPopularProductContainer = analysisModal_inventory.querySelector('#most-popular-products-table');
  MostPopularProductData.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.product_id}</td>
      <td>${item.product_name}</td>
      <td>${item.product_type}</td>
      <td>${item.QuantitySold}</td>
      <td>${item.TotalPrice}</td>
      <td><button class="info-btn" data-id="${item.product_id}">Details</button></td>
    `;
    mostPopularProductContainer.appendChild(row);
  });

  const orderedProducts = await lastProductSupplied(user[0]);
  const orderedProductsContainer = analysisModal_inventory.querySelector('#ordered-products-tbody');
  orderedProducts.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.Product_id}</td>
      <td>${item.Product_name}</td>
      <td>${item.product_type}</td>
      <td>${item.total_price}</td>
      <td>${item.quantity}</td>
    `;
    orderedProductsContainer.appendChild(row);
  });

const orderedProducts2 = await lastProductOrdered(user[0]);
console.log(orderedProducts2);
const orderedProductsContainer2 = analysisModal_inventory.querySelector('#ordered-products-table-Ordered');

// Check if both the container and data exist
if (orderedProductsContainer2 && orderedProducts2) {
  orderedProducts2.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.Product_id}</td>
      <td>${item.Product_name}</td>
      <td>${item.product_type}</td>
      <td>${item.total_price}</td>
      <td>${item.quantity}</td>
    `;
    orderedProductsContainer2.appendChild(row);
  });
} else {
  console.error('Container or data not found:', {
    container: orderedProductsContainer2,
    data: orderedProducts2
  });
}
  const quantitySoldData = await numberOfQuantitySoldPerType(user[0]);
  const quantitySoldContainer = analysisModal_inventory.querySelector('#quantity-sold-chart');
  const ctx = quantitySoldContainer.getContext('2d');
  if (chartInstanceProductType) {
    chartInstanceProductType.destroy();
  }
  chartInstanceProductType = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: quantitySoldData.map(item => item.product_type),
      datasets: [{
        label: 'Quantity Sold',
        data: quantitySoldData.map(item => item.QuantitySold),
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
          text: 'Number of Quantity Sold per Type'
        }
      }
    }
  });

  document.body.appendChild(analysisModal_inventory);
  analysisModal_inventory.style.display = 'block';

  const closeBtn = analysisModal_inventory.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    analysisModal_inventory.style.display = 'none';
    analysisModal_inventory.remove();
  });

  window.addEventListener('click', (e) => {
    if (e.target === analysisModal_inventory) {
      analysisModal_inventory.style.display = 'none';
      analysisModal_inventory.remove();
    }
  });

}

async function lastProductSupplied(managerId) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/manager/product/lastProductSupplied/${managerId}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching total quantity ordered:', error);
    return null;
  }
}

async function lastProductOrdered(managerId) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/manager/product/lastProductOrderd/${managerId}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching total quantity ordered:', error);
    return null;
  }
}



async function numberOfQuantitySoldPerType(managerId) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/manager/product/numberOfQuantitySoldPerType/${managerId}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching most selling products:', error);
    return null;
  }
}



async function MostPopularProduct(managerId) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/manager/product/MostPopularProduct/${managerId}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching most selling products:', error);
    return null;
  }
}


async function MostSellingProductsPerType(managerId) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/manager/product/mostSillingProductPerType/${managerId}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching most selling products per type:', error);
    return null;
  }
}






async function showSupplierWindow() {
  const analysisModal_inventory = document.createElement('div');
  analysisModal_inventory.classList.add('modal');
  analysisModal_inventory.innerHTML = `
    <div class="modal-content-analysis">
      <span class="close-modal">&times;</span>
      <label>Select Branch:</label>
      <select id="branch-select-inventory" required></select>

      <div class="analysis">
      <table id="products-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Product Type</th>
            <th>Quantity</th>
            <th>supply</th>
          </tr>
        </thead>
        <tbody id="products-tbody">
        </tbody>
      </table>
      </div>
    </div>
  `;

  document.body.appendChild(analysisModal_inventory);
  analysisModal_inventory.style.display = 'block';

  const closeBtn = analysisModal_inventory.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    analysisModal_inventory.style.display = 'none';
    analysisModal_inventory.remove();
  });

  window.addEventListener('click', (e) => {
    if (e.target === analysisModal_inventory) {
      analysisModal_inventory.style.display = 'none';
      analysisModal_inventory.remove();
    }
  });

  showBranches(user[0], 'branch-select-inventory');
  const ProductTableContainer = analysisModal_inventory.querySelector('#products-tbody');
  const select = analysisModal_inventory.querySelector('#branch-select-inventory');
  select.addEventListener('change', async () => {
    const branchId = select.value;
    const data = await get_BranchProduct(branchId);
    if (data) {
      ProductTableContainer.innerHTML = '';
    data.products.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.Product_id}</td>
      <td>${item.Product_name}</td>
      <td>${item.product_type}</td>
      <td>${item.quantity}</td>
      <td><button class="supply-btn" data-id="${item.Product_id}" data-branch="${branchId}">supply</button></td>
    `;
      ProductTableContainer.appendChild(row);
    });
    } else {
      ProductTableContainer.innerHTML = 'No data available';
    }
  });

}

async function get_BranchProduct(branchId) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/manager/product/getBranchProducts/${branchId}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching branches:', error);
    return null;
  }
}
 
async function showBranches(manager_id, selectElementId) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/manager/Get_managerBranches/${manager_id}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const data = await response.json();
    console.log(data);
    const branches = data.Branches;
    const select = document.getElementById(selectElementId);

    select.innerHTML = '';

    const placeholder = document.createElement('option');
    placeholder.text = 'Select a branch';
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);

  branches.forEach(branch => {
    const option = document.createElement('option');
    option.value = branch.branch;
    option.textContent = `Branch ${branch.branch}`;
    select.appendChild(option);
  });
  } catch (error) {
    console.error('Error fetching branches:', error);
  }

}


async function AddProductForm() {
  const addItemModal = document.createElement('div');
  addItemModal.id = 'add-item-modal';
  addItemModal.classList.add('modal');

  addItemModal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>Add New Product</h2>
      <form id="add-item-form">
        <div class="form-group">
          <label for="product_name">Product Name</label>
          <input type="text" id="product_name" required>
        </div>
        <div class="form-group">
          <label for="product_type">Product Type</label>
          <select id="product_type" required>
            <option value="ring">Ring</option>
            <option value="necklace">Necklace</option>
            <option value="bracelet">Bracelet</option>
            <option value="earring">Earring</option>
            <option value="pendant">Pendant</option>
            <option value="anklet">Anklet</option>
          </select>
        </div>
        <div class="form-group">
          <label for="kerat">Karat</label>
          <select id="kerat" required>
            <option value="24">24K</option>
            <option value="22">22K</option>
            <option value="18">18K</option>
            <option value="14">14K</option>
            <option value="10">10K</option>
          </select>
        </div>
        <div class="form-group">
          <label for="main_factor_type">Main Factor Type</label>
          <select id="main_factor_type" required>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="diamond">Diamond</option>
            <option value="ruby">Ruby</option>
            <option value="emerald">Emerald</option>
            <option value="sapphire">Sapphire</option>
          </select>
        </div>
        <div class="form-group">
          <label for="weight">Weight (grams)</label>
          <input type="number" id="weight" min="0.01" step="0.01" required>
        </div>
        <div class="form-group">
          <label for="price_per_gram">Price Per Gram ($)</label>
          <input type="number" id="price_per_gram" min="0.01" step="0.01" required>
        </div>
        <div class="form-group">
          <label for="labour_cost">Labour Cost ($)</label>
          <input type="number" id="labour_cost" min="0" step="0.01" required>
        </div>
        <div class="form-group">
          <label for="item-image">Image URL</label>
          <input type="text" id="item-image">
        </div>
        <div class="form-group">
          <label for="branch-select">Select Branch</label>
          <div id="branches-container">
            <select id="branch-select" required></select>
          </div>
        </div>
        <button  type="submit">Add Product</button>
      </form>
    </div>
  `;

  document.body.appendChild(addItemModal);
  addItemModal.style.display = 'block';

  const closeBtn = addItemModal.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    addItemModal.style.display = 'none';
    addItemModal.remove();
  });

  window.addEventListener('click', (e) => {
    if (e.target === addItemModal) {
      addItemModal.style.display = 'none';
      addItemModal.remove();
    }
  });

  showBranches(user[0], 'branch-select');

  document.getElementById('add-item-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    await AddNewProduct();
    addItemModal.style.display = 'none';
    addItemModal.remove();
  });
}


async function AddNewProduct() {

  try {
    const product_data = {
    product_name: document.getElementById('product_name').value,
    product_type: document.getElementById('product_type').value,
    kerat: parseInt(document.getElementById('kerat').value),
    main_factor_type: document.getElementById('main_factor_type').value,
    weight: parseFloat(document.getElementById('weight').value),
    price_per_gram: parseFloat(document.getElementById('price_per_gram').value),
    labour_cost: parseFloat(document.getElementById('labour_cost').value),
    image_path: document.getElementById('item-image').value,
    branch_id: parseInt(document.getElementById('branch-select').value),
    quantity: 0  
  };
    const response = await fetch('http://127.0.0.1:8000/manager/product/addProduct', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product_data)
    });

    if (response.ok) {
      alert('Product added successfully!');
      loadProduct(user[0]);
    } else {
      throw new Error("Failed to add product");
    }
  } catch (error) {
    console.error("Error:", error);
  }

}
 