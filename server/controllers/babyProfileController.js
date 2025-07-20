// controllers/babyProfileController.js
exports.saveBabyProfile = (req, res) => {
  const { dob, gender, growth } = req.body;

  // ✅ Validate fields
  if (!dob || typeof dob !== 'string') {
    return res.status(400).json({ error: 'Date of birth is required and must be a string' });
  }

  if (!gender || typeof gender !== 'string') {
    return res.status(400).json({ error: 'Gender is required and must be a string' });
  }

  if (!Array.isArray(growth)) {
    return res.status(400).json({ error: 'Growth must be an array' });
  }

  for (const entry of growth) {
    if (!entry.date || !entry.weight || !entry.height) {
      return res.status(400).json({ error: 'Each growth entry must include date, weight, and height' });
    }
  }

  // TODO: Save to database or local store
  console.log('✅ Baby profile saved:', { dob, gender, growth });

  return res.status(200).json({ message: 'Baby profile saved successfully' });
};
