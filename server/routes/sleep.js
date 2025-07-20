const express = require('express');
const router = express.Router();
const { saveSleepLog, getSleepLogs } = require('../controllers/sleepController');

router.post('/', saveSleepLog);
router.get('/', getSleepLogs);

module.exports = router;
