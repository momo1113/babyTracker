const express = require('express');
const router = express.Router();
const { saveSleepLog, getSleepLogs } = require('../controllers/sleepingControllerler');

router.post('/', saveSleepLog);
router.get('/', getSleepLogs);

module.exports = router;
