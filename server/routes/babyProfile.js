// routes/babyProfile.js
const express = require('express');
const router = express.Router();
const { saveBabyProfile, getBabyProfile, getAllGrowthEntries } = require('../controllers/babyProfileController');

// POST /baby-profile
router.post('/', saveBabyProfile);
router.get('/', getBabyProfile);
router.get('/', getAllGrowthEntries);

module.exports = router;
