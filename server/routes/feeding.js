const express = require('express');
const router = express.Router();

// Import controller functions
const { saveFeedingLog, getFeedingLogs } = require('../controllers/feedingController');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');


// POST /feeding/
router.post('/',verifyFirebaseToken,  saveFeedingLog);

// GET /feeding/
router.get('/', verifyFirebaseToken, getFeedingLogs);

module.exports = router;
