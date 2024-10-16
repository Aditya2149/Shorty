const express = require('express');
const {createShortLink, redirectToLongUrl, authenticateJWT, getUserLinks} = require('../controllers/linkController');
const {getClicksByDay, getClicksByWeek, getClicksByGeography, getClicksByHour } = require('../controllers/linkAnalyticsController');
const router = express.Router();

// Route to create shortened link
router.post('/shorten', authenticateJWT, createShortLink);

// Route to fetch all links created by the authenticated user
router.get('/user-links', authenticateJWT, getUserLinks);

// Route to handle redirection for shortcodes at the root level (e.g., /8Kdd08)
router.get('/:shortcode', redirectToLongUrl);

// Analytics routes
router.get('/analytics/:shortcode/clicks/day', getClicksByDay);
router.get('/analytics/:shortcode/clicks/week',getClicksByWeek);
router.get('/analytics/:shortcode/clicks/geography',getClicksByGeography);
router.get('/analytics/:shortcode/clicks/hour', getClicksByHour);
// localhost:3000/analytics/customcode/clicks/hour
module.exports = router;
