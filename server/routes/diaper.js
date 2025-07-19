const express = require('express');
const router = express.Router();
const { saveDiaperLog, getDiaperLogs } = require('../controllers/diaperController');

router.post('/', saveDiaperLog);
router.get('/', getDiaperLogs);

module.exports = router;
