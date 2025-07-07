    document.getElementById('customerForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        document.getElementsByClassName('change-pass')[0].addEventListener('click', function () {
            document.getElementsByClassName('new-pass')[0].style.display = 'block';
        });
        const password = document.getElementById('acc_password').value;
        const submitter = event.submitter;

        const message = document.getElementById('message');
        const errorMessage = document.getElementById('errorMessage');

        message.textContent = '';
        errorMessage.textContent = '';
        const dataToDelete = { Email: document.getElementById('email').value };
        const changeP = {
            Email: document.getElementById('email').value,
            password: password
        };

        try {
            if (submitter.textContent.toLowerCase() === 'delete') {
                const response = await fetch('http://localhost:8000/DeleteAccount', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToDelete)
                });
                const data = await response.json();
                if (response.ok) {
                    document.getElementById('message').textContent = "account deleted successfully!";
                } else { 
                    document.getElementById('errorMessage').textContent = data.error || "Failed to delete account.";
                }
            } else if (submitter.textContent.toLowerCase() === 'change password') {
                const response = await fetch('http://localhost:8000/UpdateAccount', {
                    method: 'Post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(changeP),
                });
                const data = await response.json();
                if (response.ok) {
                    document.getElementById('message').textContent = "password changed successfully!";
                } else { 
                    console.log(data)
                    document.getElementById('errorMessage').textContent = data.error || "Failed to change password.";
                }
            }
        } catch (err) {
            errorMessage.textContent = err.message;
        }
    });