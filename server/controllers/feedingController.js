const { z } = require('zod');

const feedingLogs = [];

const feedingSchema = z.object({
  feedingType: z.enum(['Breast', 'Bottle', 'Formula']),
  side: z.string().nullable(),
  amount: z.string().nullable(),
  unit: z.string().nullable(),
  duration: z.string(),
  notes: z.string().optional(),
  timestamp: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid timestamp' }),
});

function saveFeedingLog(req, res) {
  console.log(req.body)
  try {
    const parsed = feedingSchema.parse(req.body);

    const entry = {
      id: feedingLogs.length + 1,
      ...parsed,
    };

    feedingLogs.push(entry);
    return res.status(201).json({ message: 'Feeding log saved', data: entry });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.errors?.[0]?.message || 'Validation failed' });
  }
}

function getFeedingLogs(req, res) {
  res.json(feedingLogs);
}

module.exports = {
  saveFeedingLog,
  getFeedingLogs,
};
