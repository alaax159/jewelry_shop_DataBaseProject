document.getElementById('customerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    document.getElementById('message').textContent = '';
    document.getElementById('errorMessage').textContent = '';
    const password = document.getElementById('acc_password').value;
    const confirmPassword = document.getElementById('Confirm_Password').value;

    if (password !== confirmPassword) {
        document.getElementById('errorMessage').textContent = "Passwords do not match!";
        return;
    }

    const customerData = {
        user_name: document.getElementById('user_name').value,
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        age: 0,
        email: document.getElementById('email').value,
        gender: document.getElementById('gender').value,
        date_of_birth: document.getElementById('date_of_birth').value,
        acc_password: password,
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/customerCreation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customerData),
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('message').textContent = "Customer created successfully!";
            window.location.href = '../Login/login.html';
        } else {
            document.getElementById('errorMessage').textContent = data.error || "Failed to create customer.";
        }
    } catch (error) {
        document.getElementById('errorMessage').textContent = "Error connecting to server.";
    }
});