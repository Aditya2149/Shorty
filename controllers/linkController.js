const pool = require('../database');
const geoip = require('geoip-lite');
const uaParser = require('user-agent-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

// Function to generate a random shortcode
const generateShortCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// Function to create a short link
const createShortLink = async (req, res) => {
    const { long_url, name, expiry, custom_shortcode } = req.body;
    const userId = req.user.id;

    if (!long_url) {
        return res.status(400).json({ message: 'Long URL is required' });
    }

    try {
        let shortcode;

        // If a custom shortcode is provided, validate its uniqueness
        if (custom_shortcode) {
            const codeCheckQuery = 'SELECT * FROM links WHERE shortcode = $1';
            const existingLink = await pool.query(codeCheckQuery, [custom_shortcode]);
            if (existingLink.rows.length > 0) {
                return res.status(400).json({ message: 'Custom shortcode already exists' });
            }
            shortcode = custom_shortcode; // Use the custom shortcode
        } else {
            // Generate a random shortcode if no custom shortcode is provided
            let shortcodeExists = true;
            while (shortcodeExists) {
                shortcode = generateShortCode();
                const codeCheckQuery = 'SELECT * FROM links WHERE shortcode = $1';
                const existingLink = await pool.query(codeCheckQuery, [shortcode]);
                if (existingLink.rows.length === 0) {
                    shortcodeExists = false;
                }
            }
        }

        const insertLinkQuery = `
            INSERT INTO links(long_url, shortcode, name, created_at, expiry, created_by)
            VALUES ($1, $2, $3, DEFAULT, $4, $5)
            RETURNING *`;

        const newLink = await pool.query(insertLinkQuery, [long_url, shortcode, name || null, expiry || null, userId]);

        res.status(201).json({
            message: 'Link shortened successfully',
            short_url: `http://localhost:3000/${shortcode}`,
            link: newLink.rows[0]
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to capture analytics for the links
const captureAnalytics = async (linkId, req) => {
    console.log('Request Headers:', req.headers);
    
    // Fallbacks to different headers in case X-Forwarded-For is unavailable
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.connection.remoteAddress;

    // Clean IP to remove unwanted characters like "::ffff:"
    const cleanedIp = ip.split(',')[0].trim().replace('::ffff:', '');

    // Use geoip to find the location of the IP address
    const geo = geoip.lookup(cleanedIp);
    const country = geo ? geo.country : 'Unknown';
    const state = geo ? geo.region : 'Unknown';

    // Get the referrer from the headers
    const referrer = req.headers['referer'] || 'Unknown';

    // Parse the User-Agent for browser and device information
    const ua = uaParser(req.headers['user-agent']);
    const browser = ua.browser.name || 'Unknown';

    // Determine if the device is mobile or desktop
    let device = 'Unknown';

    // Improved device detection logic
    if (ua.device) {
        if (ua.device.type) {
            device = ua.device.type; // Use the detected device type
        } else {
            // If type is not provided, use common OS identifiers to determine the device
            const osName = ua.os.name ? ua.os.name.toLowerCase() : '';
            if (osName.includes('android') || osName.includes('iphone') || osName.includes('ipad')) {
                device = 'Mobile';
            } else if (osName.includes('windows') || osName.includes('mac')) {
                device = 'Desktop';
            }
        }
    } else {
        // Fallback check for the presence of "Mobile" or "Tablet" in the User-Agent string
        if (/Mobile|Tablet/.test(req.headers['user-agent'])) {
            device = 'Mobile';
        } else {
            device = 'Desktop';
        }
    }

    console.log(`IP: ${cleanedIp}, Country: ${country}, State: ${state}, Browser: ${browser}, Device: ${device}, Referrer: ${referrer}`);

    const insertAnalyticsQuery = `
        INSERT INTO link_analytics (link_id, ip_address, country, state, referrer, browser, device)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    try {
        await pool.query(insertAnalyticsQuery, [linkId, cleanedIp, country, state, referrer, browser, device]);
        console.log('Analytics captured');
    } catch (error) {
        console.error('Error capturing analytics:', error.message);
    }
};


//redirect to the long URL
const redirectToLongUrl = async (req, res) => {
    console.log("redirectToLongUrl function triggered");
    const { shortcode } = req.params;
    console.log("Shortcode received:", shortcode);

    try {
        const linkQuery = 'SELECT * FROM links WHERE shortcode = $1';
        const linkResult = await pool.query(linkQuery, [shortcode]);

        if (linkResult.rows.length === 0) {
            return res.status(404).json({ message: 'Short URL not found' });
        }

        const link = linkResult.rows[0];

        if (link.expiry && new Date(link.expiry) < new Date()) {
            return res.status(410).json({ message: 'Short URL has expired' });
        }
        console.log("Before capturing analytics");
        await captureAnalytics(link.id, req);
        console.log("After capturing analytics");
        
        res.redirect(link.long_url);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Middleware for JWT authentication
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, token missing' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach decoded user data to request object
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden, invalid token' });
    }
};

module.exports = { createShortLink, redirectToLongUrl, authenticateJWT };
