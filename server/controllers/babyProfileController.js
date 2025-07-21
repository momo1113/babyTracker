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

    const data = doc.data();

    // Calculate age based on dob
    const dob = data.dob || '';
    let age = '';
    if (dob) {
      const dobDate = new Date(dob);
      const now = new Date();
      let years = now.getFullYear() - dobDate.getFullYear();
      let months = now.getMonth() - dobDate.getMonth();
      let days = now.getDate() - dobDate.getDate();

      if (days < 0) {
        months -= 1;
        days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      age = `${years > 0 ? years + (years === 1 ? ' year, ' : ' years, ') : ''}${months > 0 ? months + (months === 1 ? ' month, ' : ' months, ') : ''}${days} days`.replace(/, $/, '');
    }

    // Prepare growthData array safely
    const growthData = Array.isArray(data.growthData)
      ? data.growthData.map((entry) => ({
          date: entry.date || '',
          height: entry.height || '',
          weight: entry.weight || '',
        }))
      : [];

    const babyProfile = {
      dob,
      age,
      gender: data.gender || '',
      growthData,
    };

    return res.status(200).json({ data: babyProfile });
  } catch (error) {
    console.error('Error fetching baby profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = { saveBabyProfile, getBabyProfile };

