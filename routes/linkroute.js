const express = require('express');
const {createShortLink, redirectToLongUrl, checkAuth} = require('../controllers/linkController');
const router = express.Router();

router.post('/shorten', checkAuth, createShortLink);

router.get('/:shortcode', redirectToLongUrl);

module.exports = router;