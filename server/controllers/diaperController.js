const { z } = require('zod');
const { db } = require('../../firebaseAdmin'); // adjust path if needed
const { Timestamp } = require('firebase-admin/firestore');

const diaperSchema = z.object({
  userId: z.string(),
  type: z.enum(['Pee', 'Poop', 'Both']),
  consistency: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  notes: z.string().optional(),
  timestamp: z.string().refine(val => !isNaN(new Date(val).getTime()), 'Invalid timestamp'),
});


async function saveDiaperLog(req, res) {
  try {
    const parsed = diaperSchema.parse(req.body);

    // Extra validation for poop or both
    if (parsed.type !== 'Pee') {
      if (!parsed.consistency) {
        return res.status(400).json({ error: 'Consistency is required for poop or both' });
      }
      if (!parsed.color) {
        return res.status(400).json({ error: 'Color is required for poop or both' });
      }
    }

    // Convert ISO string to Firestore Timestamp (preserving local time)
    const timestamp = Timestamp.fromDate(new Date(parsed.timestamp));

    const entry = {
      userId: parsed.userId,
      type: parsed.type,
      consistency: parsed.consistency || null,
      color: parsed.color || null,
      notes: parsed.notes || '',
      timestamp,
    };

    const docRef = await db.collection('diaperLogs').add(entry);

    return res.status(201).json({ message: 'Diaper log saved', id: docRef.id, data: entry });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.errors?.[0]?.message || 'Validation failed' });
  }
}

module.exports = { saveDiaperLog };


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
