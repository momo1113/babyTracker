const { z } = require('zod');
const { db } = require('../../firebaseAdmin'); // adjust path if needed

const { Timestamp } = require('firebase-admin/firestore');

// Extend baseSchema to include userId
const baseSchema = z.object({
  userId: z.string().min(1, 'Missing userId'), // ✅ Require userId
  feedingType: z.enum(['Breast', 'Bottle', 'Formula']),
  side: z.string().nullable(),
  amount: z.string().nullable(),
  unit: z.string().nullable(),
  duration: z.string(),
  notes: z.string().optional(),
  timestamp: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid timestamp' }),
});

// Additional validations
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

    // Convert timestamp to Firestore Timestamp if it's a string or number
    let timestamp;
    if (parsed.timestamp instanceof Date) {
      timestamp = Timestamp.fromDate(parsed.timestamp);
    } else {
      timestamp = Timestamp.fromDate(new Date(parsed.timestamp));
    }

    const dataToSave = {
      ...parsed,
      timestamp,
    };

    // Save to Firestore under 'feedingLogs'
    const docRef = await db.collection('feedingLogs').add(dataToSave);

    return res.status(201).json({ message: 'Feeding log saved', id: docRef.id });
  } catch (error) {
    console.error(error);
    if (error.errors) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}


async function getFeedingLogs(req, res) {
  try {
    const { userId } = req.query;

    let query = db.collection('feedingLogs');
    if (userId) {
      query = query.where('userId', '==', userId); // Optional filtering
    }

    const snapshot = await query.get();
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
