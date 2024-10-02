const express = require('express');
const {createShortLink, redirectToLongUrl, authenticateJWT} = require('../controllers/linkController');
const {getClicksByDay, getClicksByWeek, getClicksByGeography, getClicksByHour } = require('../controllers/linkAnalyticsController');
const router = express.Router();

// Route to create shortened link
router.post('/linkroute/shorten', authenticateJWT, createShortLink);

// Route to handle redirection for shortcodes at the root level (e.g., /8Kdd08)
router.get('/:shortcode', redirectToLongUrl);

// Analytics routes
router.get('/analytics/:linkId/clicks/day', getClicksByDay);
router.get('/analytics/:linkId/clicks/week',getClicksByWeek);
router.get('/analytics/:linkId/clicks/geography',getClicksByGeography);
router.get('/analytics/:linkId/clicks/hour', getClicksByHour);
// localhost:3000/analytics/26/clicks/hour
module.exports = router;
