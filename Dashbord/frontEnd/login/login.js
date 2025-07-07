document.getElementById('customerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    document.getElementById('message').textContent = '';
    document.getElementById('errorMessage').textContent = '';

    const LoginData = {
        email: document.getElementById('email').value,
        password: document.getElementById('acc_password').value,
    };

    console.log(LoginData.password);

    try {
        const response = await fetch('http://127.0.0.1:8000/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(LoginData),
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            localStorage.setItem('userData', JSON.stringify({
                ...data,
                email: LoginData.email,
                isLoggedIn: true
            }));
            if (data[14] == "manager") {
                window.location.href = '../dashbord/index.html';
            }
            if (data[14] == "employee") {
                window.location.href = '../emp/index.html';
            }
            
        } else {
            document.getElementById('errorMessage').textContent = data.detail || "Failed to login.";
        }
    } catch (error) {
        document.getElementById('errorMessage').textContent = "Error connecting to server.";
    }
});