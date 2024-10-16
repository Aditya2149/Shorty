// login.js

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;  // Update ID
    const password = document.getElementById('loginPassword').value;  // Update ID

    try {
        const response = await fetch('https://adityakumar.site/authroute/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        console.log('Response:', response);
        console.log('Data:', data);

if (response.ok) {
    const token = data.token;
    localStorage.setItem('token', token);
    window.location.href = 'dashboard.html'
        } else {
            // Handle errors (e.g., display error message)
            document.getElementById('loginError').textContent = data.message;
        }
    } catch (error) {
        console.error('Error logging in:', error);
        document.getElementById('loginError').textContent = 'An unexpected error occurred. Please try again.';
    }
});
