// routes/babyProfile.js
const express = require('express');
const router = express.Router();
const { saveBabyProfile, getBabyProfile, getAllGrowthEntries } = require('../controllers/babyProfileController');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');

// POST /baby-profile
router.post('/',verifyFirebaseToken, saveBabyProfile);
router.get('/', verifyFirebaseToken ,getBabyProfile);
router.get('/', verifyFirebaseToken, getAllGrowthEntries);

module.exports = router;
