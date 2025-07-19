const { z } = require('zod');

const diaperLogs = [];

// Zod schema
const diaperSchema = z.object({
  type: z.enum(['Pee', 'Poop', 'Both']),
  time: z.string().regex(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i, 'Invalid time format'),
  date: z.string().refine(val => !isNaN(new Date(val).getTime()), 'Invalid date'),
  consistency: z.string().optional(),
  color: z.string().optional(),
  notes: z.string().optional(),
});

function saveDiaperLog(req, res) {
  try {
    const parsed = diaperSchema.parse(req.body);

    // Extra rules: if type is not "Pee", consistency and color are required
    if (parsed.type !== 'Pee') {
      if (!parsed.consistency) {
        return res.status(400).json({ error: 'Consistency is required for poop or both' });
      }
      if (!parsed.color) {
        return res.status(400).json({ error: 'Color is required for poop or both' });
      }
    }

    const entry = {
      id: diaperLogs.length + 1,
      ...parsed,
      timestamp: new Date().toISOString(),
    };

    diaperLogs.push(entry);
    return res.status(201).json({ message: 'Diaper log saved', data: entry });
  } catch (err) {
    return res.status(400).json({ error: err.errors?.[0]?.message || 'Validation failed' });
  }
}

function getDiaperLogs(req, res) {
  res.json(diaperLogs);
}

module.exports = {
  saveDiaperLog,
  getDiaperLogs,
};
