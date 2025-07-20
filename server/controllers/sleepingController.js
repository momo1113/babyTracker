const { z } = require('zod');
const { db } = require('../firebaseAdmin');  // import Firestore instance

const sleepSchema = z.object({
  startTime: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid start time'),
  endTime: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid end time'),
  type: z.enum(['Nap', 'Night Sleep']),
  location: z.enum(['Crib', 'Stroller', 'Arms', 'Car Seat']),
  quality: z.enum(['Good', 'Interrupted', 'Fussy']),
  timestamp: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid timestamp'),
});

async function saveSleepLog(req, res) {
  try {
    const parsed = sleepSchema.parse(req.body);

    // Save to Firestore in "sleepLogs" collection
    const docRef = await db.collection('sleepLogs').add(parsed);

    return res.status(201).json({
      message: 'Sleep log saved',
      id: docRef.id,
      data: parsed,
    });
  } catch (err) {
    return res.status(400).json({ error: err.errors?.[0]?.message || 'Validation failed' });
  }
}

async function getSleepLogs(req, res) {
  try {
    const snapshot = await db.collection('sleepLogs').get();
    const logs = [];
    snapshot.forEach(doc => {
      logs.push({ id: doc.id, ...doc.data() });
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sleep logs' });
  }
}

module.exports = {
  saveSleepLog,
  getSleepLogs,
};
