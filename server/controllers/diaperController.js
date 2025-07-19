// In-memory array to store diaper logs (temporary, replace with DB in production)
const diaperLogs = [];

function saveDiaperLog(req, res) {
  const data = req.body;

  // Add basic validation if needed
  if (!data.type || !data.time || !data.date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  data.id = diaperLogs.length + 1;
  data.savedAt = new Date().toISOString();

  diaperLogs.push(data);
  res.status(201).json({ message: 'Diaper log saved', data });
}

function getDiaperLogs(req, res) {
  res.json(diaperLogs);
}

module.exports = {
  saveDiaperLog,
  getDiaperLogs,
};
