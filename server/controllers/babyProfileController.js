const { db } = require('../firebaseAdmin'); // adjust path if needed

const saveBabyProfile = async (req, res) => {
  try {
    const { dob, gender, growthData } = req.body;

    // Basic validation
    if (!dob || !gender || !Array.isArray(growthData)) {
      return res.status(400).json({ error: 'Missing required fields or invalid data.' });
    }

    const entry = { dob, gender, growthData, updatedAt: new Date().toISOString() };

    // Save to Firestore (overwrite or create single document)
    const docRef = db.collection('babyProfiles').doc('main'); // or use dynamic user ID if needed
    await docRef.set(entry);

    console.log('Saved baby profile to Firestore:', entry);

    return res.status(200).json({ message: 'Baby profile saved successfully', data: entry });
  } catch (error) {
    console.error('Error saving baby profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getBabyProfile = async (req, res) => {
  try {
    const doc = await db.collection('babyProfiles').doc('main').get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Baby profile not found' });
    }
    return res.status(200).json({ data: doc.data() });
  } catch (error) {
    console.error('Error fetching baby profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { saveBabyProfile, getBabyProfile };

