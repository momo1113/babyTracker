const express = require('express');
const router = express.Router();
const { getTodayLogs } = require('../controllers/todayLogsController');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');


router.get('/', verifyFirebaseToken, getTodayLogs);

module.exports = router;