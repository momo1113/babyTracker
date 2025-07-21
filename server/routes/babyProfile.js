// routes/babyProfile.js
const express = require('express');
const router = express.Router();
const { saveBabyProfile, getBabyProfile } = require('../controllers/babyProfileController');

// POST /baby-profile
router.post('/', saveBabyProfile);
router.get('/', getBabyProfile);

module.exports = router;
