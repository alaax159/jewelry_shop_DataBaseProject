document.getElementById('customerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    document.getElementById('message').textContent = '';
    document.getElementById('errorMessage').textContent = '';

    const LoginData = {
        email: document.getElementById('email').value,
        password: document.getElementById('acc_password').value
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify(LoginData),
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('message').textContent = "Login successfully!";
            window.location.href = "../homeScreen/index.html";
        } else {
            document.getElementById('errorMessage').textContent = data.error || "Failed to login.";
        }
    } catch (error) {
        document.getElementById('errorMessage').textContent = "Error connecting to server.";
    }
});