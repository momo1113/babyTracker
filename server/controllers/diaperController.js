const { z } = require('zod');
const { db } = require('../firebaseAdmin');  // import Firestore

const diaperSchema = z.object({
  type: z.enum(['Pee', 'Poop', 'Both']),
  time: z.string().regex(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i, 'Invalid time format'),
  date: z.string().refine(val => !isNaN(new Date(val).getTime()), 'Invalid date'),
  consistency: z.string().optional(),
  color: z.string().optional(),
  notes: z.string().optional(),
});

async function saveDiaperLog(req, res) {
  try {
    const parsed = diaperSchema.parse(req.body);

    // Extra validation
    if (parsed.type !== 'Pee') {
      if (!parsed.consistency) {
        return res.status(400).json({ error: 'Consistency is required for poop or both' });
      }
      if (!parsed.color) {
        return res.status(400).json({ error: 'Color is required for poop or both' });
      }
    }

    const entry = {
      ...parsed,
      timestamp: new Date().toISOString(),
    };

    // Save to Firestore collection "diaperLogs"
    const docRef = await db.collection('diaperLogs').add(entry);

    return res.status(201).json({ message: 'Diaper log saved', id: docRef.id, data: entry });
  } catch (err) {
    return res.status(400).json({ error: err.errors?.[0]?.message || 'Validation failed' });
  }
}

async function getDiaperLogs(req, res) {
  try {
    const snapshot = await db.collection('diaperLogs').get();
    const logs = [];
    snapshot.forEach(doc => logs.push({ id: doc.id, ...doc.data() }));
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch diaper logs' });
  }
}

module.exports = {
  saveDiaperLog,
  getDiaperLogs,
};
