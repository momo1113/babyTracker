// routes/history.js
const express = require('express');
const router = express.Router();
const { getLogsByDate } = require('../controllers/historyController');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');


// Add ':date' param here on this route path
router.get('/:date', verifyFirebaseToken, getLogsByDate);

module.exports = router;
