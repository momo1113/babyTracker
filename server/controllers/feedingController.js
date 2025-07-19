// In-memory storage (for demo)
const feedingLogs = [];

// Save feeding log
function saveFeedingLog(req, res) {
  const feedingData = req.body;
  if (!feedingData.feedingType) {
    return res.status(400).json({ error: 'feedingType is required' });
  }

  feedingData.id = feedingLogs.length + 1;
  feedingData.savedAt = new Date().toISOString();

  feedingLogs.push(feedingData);

  res.status(201).json({ message: 'Feeding log saved', data: feedingData });
}

// Get feeding logs
function getFeedingLogs(req, res) {
  res.json(feedingLogs);
}

module.exports = {
  saveFeedingLog,
  getFeedingLogs,
};
