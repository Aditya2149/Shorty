//dashboard.js
const token = localStorage.getItem('token');

// Handle URL shortening form submission
document.getElementById('shortenForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const longUrl = document.getElementById('longUrl').value;
    const name = document.getElementById('name').value;
    const mobileUrl = document.getElementById('mobileUrl').value;
    const customShortcode = document.getElementById('customShortcode').value;
    const expiry = document.getElementById('expiry').value;

    if (!longUrl) {
        document.getElementById('shortenError').textContent = 'Long URL is required';
        return;
    }

    try {
        const response = await fetch('https://adityakumar.site/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ long_url: longUrl, name, mobile_url: mobileUrl, custom_shortcode: customShortcode, expiry })
        });

        if (response.ok) {
            const data = await response.json();
            addLinkToList(data.shortcode, data.long_url, data.short_url, data.name, data.created_at, data.expiry);
        } else {
            const errorData = await response.json();
            document.getElementById('shortenError').textContent = errorData.message;
        }
    } catch (error) {
        document.getElementById('shortenError').textContent = 'An error occurred';
    }
});

const addLinkToList = (shortcode, longUrl, shortUrl, name, createdAt, expiry) => {
    const linkList = document.getElementById('linksContainer'); 
    const linkItem = document.createElement('div');
    linkItem.className = 'link-item';

    linkItem.innerHTML = `
        <div class="link-content">
            <p><strong>Long URL:</strong> ${longUrl}</p>
            <p><strong>Short URL:</strong> <a href="${shortUrl}" target="_blank">${shortUrl}</a></p>
            <p><strong>Name:</strong> ${name || 'N/A'}</p>
            <p><strong>Created At:</strong> ${new Date(createdAt).toLocaleString()}</p>
            <p><strong>Expiry:</strong> ${expiry ? new Date(expiry).toLocaleString() : 'No Expiry'}</p>
        </div>
        <button class="analytics-btn" onclick="window.location.href='analytics.html?shortcode=${shortcode}'">View Analytics</button>
    `;

    linkList.appendChild(linkItem);
};




const fetchUserLinks = async () => {
    try {
        const response = await fetch('https://adityakumar.site/user-links', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const links = await response.json();
        // Populate the link list on the dashboard
        displayLinks(links);
    } catch (error) {
        console.error('Error fetching user links:', error);
    }
};

fetchUserLinks();  // Call the function to fetch user links

function displayLinks(links) {
    const linksContainer = document.getElementById('linksContainer'); // Ensure this ID is correct

    // Clear any existing links
    linksContainer.innerHTML = '';

    // Check if there are any links to display
    if (!Array.isArray(links) || links.length === 0) {
        linksContainer.innerHTML = '<p>No links found.</p>';
        return;
    }

    // Create and append link elements using addLinkToList
    links.forEach(link => {
        addLinkToList(link.shortcode, link.long_url, `https://adityakumar.site/${link.shortcode}`, link.name, link.created_at, link.expiry);
    });
}



// Logout button functionality
document.getElementById('logoutBtn').addEventListener('click', function () {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});
