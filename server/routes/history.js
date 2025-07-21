// routes/history.js
const express = require('express');
const router = express.Router();
const { getLogsByDate } = require('../controllers/historyController');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');


router.get('/:date', verifyFirebaseToken, getLogsByDate); // date format: YYYY-MM-DD

module.exports = router;
