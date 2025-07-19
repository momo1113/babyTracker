const express = require('express');
const router = express.Router();

// Import controller functions
const { saveFeedingLog, getFeedingLogs } = require('../controllers/feedingController');

// POST /feeding/
router.post('/', saveFeedingLog);

// GET /feeding/
router.get('/', getFeedingLogs);

module.exports = router;
