const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../database');
require('dotenv').config();  // Loads environment variables from .env
const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '15m' });
};

const signup = async (req, res) => {
    console.log("Request body:", req.body);
    const { email, password } = req.body;

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long and contain both letters and numbers.' });
    }

    try {
        const userCheckQuery = 'SELECT * FROM users WHERE email = $1';
        const userExists = await pool.query(userCheckQuery, [email]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const insertUserQuery = `
            INSERT INTO users (email, password, created_at)
            VALUES ($1, $2, DEFAULT)
            RETURNING *`;
        
        const newUser = await pool.query(insertUserQuery, [email, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userQuery = 'SELECT * FROM users WHERE email = $1';
        const user = await pool.query(userQuery, [email]);

        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const token = generateToken(user.rows[0]);

        res.set('User-ID', user.rows[0].id);

        // let options = {
        // maxAge: 1000 * 60 * 15, // would expire after 15 minutes
        // httpOnly: true, // The cookie only accessible by the web server
        // signed: true // Indicates if the cookie should be signed
        // }

        // Set cookie
        // res.cookie('userId', user.rows[0].id, options)

        res.json({ 
            message: 'Logged in successfully',
            token: token,
            user: {
                email: user.rows[0].email,
                created_at: user.rows[0].created_at
            }
            });
       
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const logout = (req, res) => {
    // res.clearCookie('userId', { signed: true });
    res.json({ message: 'Logged out successfully' });
};

module.exports = { signup, login, logout };
