
# Shorty - URL Shortening Application

Shorty is a URL shortening service that allows users to create custom short URLs, track clicks, and analyze their usage through a simple and responsive web interface. The project is built with a Node.js backend and includes a PostgreSQL database for storing URL data, user authentication, and analytics.

## Features

### 1. **User Authentication**
   - Secure user login and registration using JWT tokens.
   - Password hashing using bcrypt for added security.

### 2. **URL Shortening**
   - Create short URLs from long URLs.
   - Option to set custom shortcodes for your URLs.
   - Set optional expiry dates for short URLs.

### 3. **Link Analytics**
   - Track the number of clicks for each shortened URL.
   - Granular analytics (hourly, daily, weekly).
   - Visualize data using Line or Bar graphs.
   - Secure analytics page accessible only to logged-in users.
   - **Planned:**
    - Display geographic distribution of users.
    - Show device/browser statistics.

### 4. **Responsive Frontend**
   - Built with HTML, CSS, and JavaScript.
   - Mobile-friendly and responsive for all screen sizes.
   - Interactive dashboards for users to create, manage, and track URLs.

## Application Structure

### Backend
- **Node.js/Express.js** server handles API requests.
- **PostgreSQL** database to store user data, URLs, and analytics.
- **Nginx** server to handle reverse proxy and SSL (HTTPS) configuration.
- **GeoIP** and `User-Agent` libraries are used for capturing click analytics (planned).
  
### Frontend
- **HTML, CSS, JavaScript** used for building pages.
- **Chart.js** library used for displaying analytics graphs.
- **Responsive Design** ensures compatibility with both desktop and mobile users.

### Key Endpoints

- **/signup**: Register a new user.
- **/login**: User login to obtain JWT token.
- **/dashboard**: Create and manage short URLs.
- **/analytics/:shortcode**: View click analytics (protected route).

## How to Run the Application

### 1. Clone the Repository

```bash
git clone https://github.com/Aditya2149/Shorty
cd shorty-app
```

### 2. Setup Environment Variables

Create a `.env` file in the root directory to set up your database and JWT configuration.

```
PORT=3000
DATABASE_URL=postgres://username:password@localhost:5432/shortydb
JWT_SECRET=your-secret-key
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

You can run the app using Docker or directly with Node.js.

#### Run Locally:

```bash
npm start
```

#### Run with Docker:

Make sure Docker is installed, then run:

```bash
docker-compose up
```

### 5. Access the App

The app should be accessible at `http://localhost:3000`.

- Frontend: `http://localhost:3000`
- API: `http://localhost:3000/api`

## How to Use the Application

### 1. Sign Up and Log In

- Visit the home page and sign up or log in with your credentials.

### 2. Create a Short URL

- On the dashboard, input a long URL to shorten.
- Optionally, provide a custom shortcode and set an expiry date.

### 3. Track URL Analytics

- In the dashboard, view the list of your shortened URLs.
- Click the "Analytics" button to view the number of clicks on each URL.
- Select the data granularity (day, week, hour) and the graph type (line or bar) to visualize click data.

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **Analytics**: Chart.js, GeoIP, User-Agent
- **Reverse Proxy**: Nginx
- **SSL Certificates**: LetsEncrypt via Certbot
- **Deployment**: Docker

## Planned Features

- **Geographic Analytics**: Track where users are coming from using GeoIP data.
- **Device & Browser Statistics**: Analyze which devices and browsers are being used by users.

## Contributing

Pull requests are welcome. For significant changes, please open an issue first to discuss what you would like to change.
