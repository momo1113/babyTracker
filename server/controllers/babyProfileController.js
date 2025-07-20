// This is a simple in-memory store for demo purposes
let babyProfileData = null;

const saveBabyProfile = (req, res) => {
  try {
    const { dob, gender, growthData } = req.body;

    // Basic validation
    if (!dob || !gender || !Array.isArray(growthData)) {
      return res.status(400).json({ error: 'Missing required fields or invalid data.' });
    }

    // Additional validation could be added here (date format, gender values, growthData format)

    // Save (replace with actual DB save logic)
    babyProfileData = { dob, gender, growthData };

    console.log('Saved baby profile:', babyProfileData);

    return res.status(200).json({ message: 'Baby profile saved successfully', data: babyProfileData });
  } catch (error) {
    console.error('Error saving baby profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { saveBabyProfile };
