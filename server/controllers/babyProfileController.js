const { db } = require('../../firebaseAdmin'); // adjust path if needed
const admin = require('firebase-admin');

const dayjs = require('dayjs');


const calculateAge = (dobString) => {
  const birthDate = dayjs(dobString);
  const now = dayjs();

  if (!birthDate.isValid()) return 'Invalid date';

  if (birthDate.isAfter(now)) return 'Future date';

  const totalMonths = now.diff(birthDate, 'month');
  // Days after subtracting full months:
  const daysAfterMonths = now.subtract(totalMonths, 'month').diff(birthDate, 'day');

  const weeks = Math.floor(daysAfterMonths / 7);
  const days = daysAfterMonths % 7;

  let ageParts = [];

  if (totalMonths > 0) ageParts.push(`${totalMonths} months`);
  if (weeks > 0) ageParts.push(`${weeks} weeks`);
  if (totalMonths === 0 && days > 0) ageParts.push(`${days} days`);

  if (ageParts.length === 0) return '0 days';

  return ageParts.join(', ');
};


const saveBabyProfile = async (req, res) => {
  try {
    const { userId, name, dob, gender, growthData = [] } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Missing userId' });
    }

    // Basic validation
    if (!name || !dob || !gender) {
      return res.status(400).json({ error: 'Missing required fields: name, dob, or gender.' });
    }

    if (!Array.isArray(growthData)) {
      return res.status(400).json({ error: 'growthData must be an array.' });
    }

    const age = calculateAge(dob);

    const entry = {
      name,
      dob,
      gender,
      age, // Save the calculated age here
      growthData,
      updatedAt: new Date().toISOString(),
    };

    // Save under userId document for multi-user support
    const docRef = db.collection('babyProfiles').doc(userId);
    await docRef.set(entry);

    return res.status(200).json({ message: 'Baby profile saved successfully', data: entry });
  } catch (error) {
    console.error('Error saving baby profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


const getBabyProfile = async (req, res) => {
  try {
    const userId = req.user.uid; // from verifyFirebaseToken middleware

    const docRef = admin.firestore().collection('babyProfiles').doc(userId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Baby profile not found' });
    }

    const data = doc.data();

    return res.json({
      name: data.name, // <-- ✅ ensure this is returned
      dob: data.dob,
      gender: data.gender,
      growthData: data.growthData || [],
      age: data.age || 0, // optional field
      updatedAt: data.updatedAt || new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error getting baby profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


const getAllGrowthEntries = async (req, res) => {
  try {
    const doc = await db.collection('babyProfiles').doc('main').get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Baby profile not found' });
    }

    const data = doc.data();
    const growthData = Array.isArray(data.growthData) ? data.growthData : [];

    return res.status(200).json({ growthData });
  } catch (error) {
    console.error('Error fetching growth entries:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { saveBabyProfile, getBabyProfile, getAllGrowthEntries };

