const { z } = require('zod');

const sleepLogs = [];

const sleepSchema = z.object({
  startTime: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid start time'),
  endTime: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid end time'),
  type: z.enum(['Nap', 'Night Sleep']),
  location: z.enum(['Crib', 'Stroller', 'Arms', 'Car Seat']),
  quality: z.enum(['Good', 'Interrupted', 'Fussy']),
  timestamp: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid timestamp'),
});

function saveSleepLog(req, res) {
  try {
    const parsed = sleepSchema.parse(req.body);
    const entry = {
      id: sleepLogs.length + 1,
      ...parsed,
    };
    sleepLogs.push(entry);
    return res.status(201).json({ message: 'Sleep log saved', data: entry });
  } catch (err) {
    return res.status(400).json({ error: err.errors?.[0]?.message || 'Validation failed' });
  }
}

function getSleepLogs(req, res) {
  res.json(sleepLogs);
}

module.exports = {
  saveSleepLog,
  getSleepLogs,
};
