const express = require('express');
const router = express.Router();
const { getTodayLogs } = require('../controllers/todayLogsController');

router.get('/', getTodayLogs);

module.exports = router;