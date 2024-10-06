const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // This may be necessary for self-signed certificates
    ca: process.env.DB_SSL_CA
  }
});

pool.connect(async (err, client, release) => {
    if (err) {
        console.error('Error connecting to Aiven database:', err);
    } else {
        console.log('Connected to Aiven database!');
        
        try {
            // Queries to create tables if they don't exist
            const createUserTableQuery = `
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `;

            const createLinksTableQuery = `
                CREATE TABLE IF NOT EXISTS links (
                    id SERIAL PRIMARY KEY,
                    long_url TEXT NOT NULL,
                    shortcode VARCHAR(10) UNIQUE NOT NULL,
                    name VARCHAR(100),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    expiry TIMESTAMP,
                    created_by INTEGER REFERENCES users(id)
                );
            `;

            const createAnalyticsTableQuery = `
                CREATE TABLE IF NOT EXISTS link_analytics (
                    id SERIAL PRIMARY KEY,
                    link_id INT REFERENCES links(id),
                    country VARCHAR(255),
                    state VARCHAR(255),
                    referrer VARCHAR(255),
                    browser VARCHAR(255),
                    device VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    ip_address VARCHAR(50)
                );

            `;

            // Execute the queries to create tables
            await client.query(createUserTableQuery);
            await client.query(createLinksTableQuery);
            await client.query(createAnalyticsTableQuery);

            console.log("Tables are ensured to exist in the database.");

        } catch (tableErr) {
            console.error("Error creating tables:", tableErr);
        } finally {
            release();  // Release the client back to the pool
        }
    }
});

module.exports = pool;
