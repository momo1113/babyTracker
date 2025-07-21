const express = require('express');
const router = express.Router();
const { saveSleepLog, getSleepLogs } = require('../controllers/sleepingController');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');


router.post('/', verifyFirebaseToken, saveSleepLog);
router.get('/', verifyFirebaseToken, getSleepLogs);

module.exports = router;
