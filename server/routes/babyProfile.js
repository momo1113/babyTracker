// routes/babyProfile.js
const express = require('express');
const router = express.Router();
const { saveBabyProfile } = require('../controllers/babyProfileController');

// POST /baby-profile
router.post('/', saveBabyProfile);

module.exports = router;
