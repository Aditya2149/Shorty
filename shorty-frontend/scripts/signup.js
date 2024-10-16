document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const response = await fetch('https://adityakumar.site/authroute/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            window.location.href = 'login.html';
        } else {
            const errorData = await response.json();
            document.getElementById('signupError').textContent = errorData.error || 'Signup failed';
        }
    } catch (error) {
        document.getElementById('signupError').textContent = 'An error occurred';
    }
});
