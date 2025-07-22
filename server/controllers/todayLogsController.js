const admin = require('firebase-admin');
const { db } = require('../../firebaseAdmin'); // adjust path if needed
const { Timestamp } = require('firebase-admin/firestore');

function toDate(timestamp) {
  return timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
}

async function getTodayLogs(req, res) {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Missing userId' });
    }

    // Use Firestore Timestamp objects
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const startTimestamp = admin.firestore.Timestamp.fromDate(startOfDay);
    const endTimestamp = admin.firestore.Timestamp.fromDate(endOfDay);

    const [feedingSnap, diaperSnap, sleepSnap] = await Promise.all([
      db.collection('feedingLogs')
        .where('userId', '==', userId)
        .where('timestamp', '>=', startTimestamp)
        .where('timestamp', '<=', endTimestamp)
        .get(),

      db.collection('diaperLogs')
        .where('userId', '==', userId)
        .where('timestamp', '>=', startTimestamp)
        .where('timestamp', '<=', endTimestamp)
        .get(),

      db.collection('sleepLogs')
        .where('userId', '==', userId)
        .where('timestamp', '>=', startTimestamp)
        .where('timestamp', '<=', endTimestamp)
        .get(),
    ]);

    const feedingLogs = feedingSnap.docs.map(doc => ({
      id: doc.id,
      type: 'Feeding',
      time: toDate(doc.data().timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      details: formatFeedingDetails(doc.data()),
      timestamp: toDate(doc.data().timestamp),
    }));

      console.log('feedingLogs',feedingLogs);
    const diaperLogs = diaperSnap.docs.map(doc => ({
      id: doc.id,
      type: 'Diaper',
      time: toDate(doc.data().timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      details: formatDiaperDetails(doc.data()),
      timestamp: toDate(doc.data().timestamp),
    }));

    const sleepLogs = sleepSnap.docs.map(doc => ({
      id: doc.id,
      type: 'Sleeping',
      time: toDate(doc.data().timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      details: formatSleepDetails(doc.data()),
      timestamp: toDate(doc.data().timestamp),
    }));

    const allLogs = [...feedingLogs, ...diaperLogs, ...sleepLogs];
    allLogs.sort((a, b) => b.timestamp - a.timestamp);

    res.json(allLogs);
  } catch (err) {
    console.error('Error fetching today logs:', err);
    res.status(500).json({ error: "Failed to fetch today's logs" });
  }
}

// --- Format helpers unchanged ---

function formatFeedingDetails(data) {
  const details = [];

  if (data.feedingType === 'Breast') {
    details.push({ label: 'Type', value: `Breast (${data.side})` });
    details.push({ label: 'Duration', value: data.duration + ' minutes' });
  } else {
    details.push({ label: 'Type', value: `${data.feedingType}` });
    details.push({ label: 'Amount', value: `${data.amount} ${data.unit}` });
    if (data.duration) {
      details.push({ label: 'Duration', value: data.duration + ' minutes' });
    }
  }

  if (data.notes) {
    details.push({ label: 'Notes', value: data.notes });
  }

  return details;
}

function formatDiaperDetails(data) {
  const details = [{ label: 'Type', value: data.type }];
  if (data.consistency) details.push({ label: 'Consistency', value: data.consistency });
  if (data.color) details.push({ label: 'Color', value: data.color });
  if (data.notes) details.push({ label: 'Notes', value: data.notes });
  return details;
}

function formatSleepDetails(data) {
  const details = [];
  if (data.startTime && data.endTime) {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    const durationMin = Math.round((end - start) / 60000);
    details.push({ label: 'Duration', value: `${durationMin} minutes` });
  }

  details.push({ label: 'Quality', value: data.quality });
  details.push({ label: 'Location', value: data.location });
  if (data.notes) {
    details.push({ label: 'Notes', value: data.notes });
  }

  return details;
}

module.exports = {
  getTodayLogs,
};
