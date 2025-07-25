// routes/babyProfile.js
const express = require('express');
const router = express.Router();
const { saveBabyProfile, getBabyProfile, deleteGrowthEntry, getAllGrowthEntries } = require('../controllers/babyProfileController');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // or diskStorage

// POST /baby-profile
router.get('/', verifyFirebaseToken ,getBabyProfile);
router.get('/', verifyFirebaseToken, getAllGrowthEntries);
router.delete('/', verifyFirebaseToken, deleteGrowthEntry);
router.post('/', verifyFirebaseToken, upload.single('photo'), saveBabyProfile);

module.exports = router;
