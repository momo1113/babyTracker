const { z } = require('zod');
const { db } = require('../firebaseAdmin'); // import your Firestore instance


const baseSchema = z.object({
  feedingType: z.enum(['Breast', 'Bottle', 'Formula']),
  side: z.string().nullable(),
  amount: z.string().nullable(),
  unit: z.string().nullable(),
  duration: z.string(),
  notes: z.string().optional(),
  timestamp: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid timestamp' }),
});

const feedingSchema = baseSchema.superRefine((data, ctx) => {
  if (data.feedingType === 'Breast') {
    if (!data.side) {
      ctx.addIssue({
        path: ['side'],
        code: z.ZodIssueCode.custom,
        message: 'Side is required for Breast feeding',
      });
    }
  } else {
    if (!data.amount) {
      ctx.addIssue({
        path: ['amount'],
        code: z.ZodIssueCode.custom,
        message: 'Amount is required for Bottle or Formula feeding',
      });
    }
    if (!data.unit) {
      ctx.addIssue({
        path: ['unit'],
        code: z.ZodIssueCode.custom,
        message: 'Unit is required for Bottle or Formula feeding',
      });
    }
  }
});

async function saveFeedingLog(req, res) {
  try {
    const parsed = feedingSchema.parse(req.body);

    // Save to Firestore
    const docRef = await db.collection('feedingLogs').add(parsed);

    return res.status(201).json({ message: 'Feeding log saved', id: docRef.id });
  } catch (error) {
    console.error(error);
    // if validation error from zod
    if (error.errors) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    // else Firestore or other errors
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

async function getFeedingLogs(req, res) {
  try {
    const snapshot = await db.collection('feedingLogs').get();
    const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch feeding logs' });
  }
}

module.exports = {
  saveFeedingLog,
  getFeedingLogs,
};
