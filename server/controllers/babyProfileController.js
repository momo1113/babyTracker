const { db } = require('../../firebaseAdmin'); // adjust path if needed
const admin = require('firebase-admin');

const dayjs = require('dayjs');



const calculateAge = (dobString) => {
    const birthDate = dayjs(dobString);
  const now = dayjs();

  if (!birthDate.isValid()) return 'Invalid date';
  if (birthDate.isAfter(now)) return 'Future date';

  const totalMonths = now.diff(birthDate, 'month');
  const remainder = birthDate.add(totalMonths, 'month'); // ✅ Fix here

  const remainingDays = now.diff(remainder, 'day');

  let ageParts = [];

  if (totalMonths > 0) ageParts.push(`${totalMonths} month${totalMonths > 1 ? 's' : ''}`);
  if (remainingDays > 0) ageParts.push(`${remainingDays} day${remainingDays > 1 ? 's' : ''}`);

  if (ageParts.length === 0) return '0 days';

  return ageParts.join(', ');
};

const saveBabyProfile = async (req, res) => {
  try {
    const { userId, name, dob, gender } = req.body;

    // growthData might be a JSON string when sent via multipart/form-data
    let growthData = req.body.growthData || '[]';

    try {
      growthData = JSON.parse(growthData);
    } catch (err) {
      return res.status(400).json({ error: 'growthData must be a valid JSON array.' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Missing userId' });
    }
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
      age,
      growthData,
      updatedAt: new Date().toISOString(),
    };

    if (req.file) {
      // handle photo upload and get photoUrl here, see previous examples
      // e.g. entry.photoUrl = ...
    }

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
    const userId = req.user.uid;
    const docRef = admin.firestore().collection('babyProfiles').doc(userId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Baby profile not found' });
    }

    const data = doc.data();
    const growthData = Array.isArray(data.growthData) ? data.growthData : [];

    // Get latest growth entry
    const latestGrowth = [...growthData]
      .filter(entry => entry.date && entry.weight && entry.height)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    console.log('latestGrowth', latestGrowth)
    let weightPercentile = null;
    let heightPercentile = null;

    if (latestGrowth && data.dob && data.gender) {
      const dob = dayjs(data.dob);
      const growthDate = dayjs(latestGrowth.date);

      const ageInMonths = growthDate.diff(dob, 'month');
      const gender = data.gender.toLowerCase();

      // Simplified WHO reference values (girls)
      const WHO_REFERENCE = {
        female: {
          weight: [3.2, 4.2, 5.1, 5.8, 6.4, 6.9, 7.3, 7.6, 7.9, 8.2], // 0-9 months
          height: [49.1, 53.7, 57.1, 59.8, 62.1, 64, 65.7, 67.3, 68.7, 70.1],
        },
        male: {
          weight: [3.3, 4.5, 5.6, 6.4, 7, 7.5, 7.9, 8.3, 8.6, 8.9],
          height: [49.9, 54.7, 58.4, 61.4, 63.9, 65.9, 67.6, 69.2, 70.6, 72],
        },
      };

    const convertUnits = (value, type) => {
    if (type === 'weight') {
      // lbs to kg
      return value / 2.20462;
    }
    if (type === 'height') {
      // inches to cm
      return value * 2.54;
    }
    return value;
};

const estimatePercentile = (actualRaw, reference, ageInMonths, type) => {
  const actual = convertUnits(actualRaw, type);
  const idx = Math.min(Math.max(ageInMonths, 0), reference.length - 1);
  const mean = reference[idx];

  const diff = actual - mean;

  if (Math.abs(diff) < 0.3) return 50;
  if (diff >= 1.7) return 99;  // very high above mean
  if (diff >= 1.2) return 95;
  if (diff >= 0.7) return 85;
  if (diff >= 0.3) return 70;

  if (diff <= -1.7) return 1;  // very low below mean
  if (diff <= -1.2) return 5;
  if (diff <= -0.7) return 15;
  if (diff <= -0.3) return 30;

  return 50;  // default around mean
};

// Usage example:
const ref = WHO_REFERENCE[gender.toLowerCase()];

if (ref) {
  weightPercentile = estimatePercentile(Number(latestGrowth.weight), ref.weight, ageInMonths, 'weight');
  heightPercentile = estimatePercentile(Number(latestGrowth.height), ref.height, ageInMonths, 'height');
}

    }

    return res.json({
      name: data.name,
      dob: data.dob,
      gender: data.gender,
      growthData,
      age: data.age || 0,
      updatedAt: data.updatedAt || new Date().toISOString(),
      weightPercentile,
      heightPercentile,
    });
  } catch (error) {
    console.error('Error getting baby profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllGrowthEntries = async (req, res) => {
  try {
    const userId = req.user.uid; // requires verifyFirebaseToken middleware

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Missing user ID' });
    }

    const docRef = db.collection('babyProfiles').doc(userId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Baby profile not found' });
    }

    const data = doc.data();
    const growthData = Array.isArray(data.growthData) ? data.growthData : [];
    const gender = data.gender;

    return res.status(200).json({ growthData, gender });
  } catch (error) {
    console.error('Error fetching growth entries:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


const deleteGrowthEntry =  async (req, res) => {
  try {
    const userId = req.user.uid; // Assuming you have middleware to set req.user
    const { dates } = req.body;

    if (!Array.isArray(dates) || dates.length === 0) {
      return res.status(400).json({ error: 'Please provide at least one valid date in the "dates" field.',});
    }

    const docRef = admin.firestore().collection('babyProfiles').doc(userId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Baby profile not found' });
    }

    const data = doc.data();
    let growthData = Array.isArray(data.growthData) ? data.growthData : [];

    // Filter out the growth entries with the specified dates
    growthData = growthData.filter(entry => !dates.includes(entry.date));

    // Update Firestore with new growthData array
    await docRef.update({ growthData });

    res.json({ message: 'Growth entries deleted successfully', growthData });
  } catch (error) {
    console.error('Error deleting growth entries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { saveBabyProfile, getBabyProfile, deleteGrowthEntry, getAllGrowthEntries };

