const express = require('express');
const router = express.Router();
const { saveFeedingLog, getFeedingLogs } = require('../controllers/feedingController');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');

// POST /feeding - Save feeding log (userId extracted from token)
router.post('/', verifyFirebaseToken, (req, res, next) => {
  req.body.userId = req.user.uid; // Attach userId from Firebase token
  saveFeedingLog(req, res, next);
});

// GET /feeding?userId=xxx (optional) - Get feeding logs, optionally filtered by user
router.get('/', verifyFirebaseToken, getFeedingLogs);

module.exports = router;