const express = require('express');
const router = express.Router();
const { saveDiaperLog, getDiaperLogs } = require('../controllers/diaperController');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');

router.post('/', verifyFirebaseToken, saveDiaperLog);
router.get('/', verifyFirebaseToken, getDiaperLogs);

module.exports = router;
