const { db } = require('../../firebaseAdmin'); // adjust path if needed

function toDate(timestamp) {
  if (!timestamp) return null;

  if (typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }

  if (timestamp instanceof Date) {
    return timestamp;
  }

  const date = new Date(timestamp);
  return isNaN(date.getTime()) ? null : date;
}

function formatSleepDuration(startTime, endTime) {
  const start = toDate(startTime);
  const end = toDate(endTime);
  if (!start || !end) return '';

  const diffMs = end - start;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
}

exports.getLogsByDate = async (req, res) => {
  try {
    const userId = req.user.uid;  // assuming user ID is set on req.user by auth middleware
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const date = req.params.date; // expected YYYY-MM-DD

    // Calculate start and end timestamps for the day in your local timezone
    const dayStart = new Date(`${date}T00:00:00`);
    const dayEnd = new Date(`${date}T23:59:59.999`);

    // Firestore Timestamp equivalents if needed (if you store as Firestore Timestamp)
    // Or just pass JS Date objects, Firestore SDK can handle it
    const startTimestamp = dayStart;
    const endTimestamp = dayEnd;

    // Query Firestore collections with userId and timestamp range
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

    const feedingLogs = feedingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const diaperLogs = diaperSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const sleepingLogs = sleepSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Prepare logs for response with consistent time and formatting
    const logs = [
      ...feedingLogs.map(log => ({
        type: 'Feeding',
        icon: 'baby-bottle-outline',
        time: toDate(log.timestamp).toISOString(),
        details:
          log.feedingType === 'Breast'
            ? `Breast • ${log.side || ''} • ${log.duration || ''} min`.trim()
            : `Bottle • ${log.amount || ''} ${log.unit || ''}`.trim(),
      })),
      ...diaperLogs.map(log => ({
        type: 'Diaper',
        icon: 'paper-towel',
        time: toDate(log.timestamp).toISOString(),
        details: [log.type, log.color, log.consistency].filter(Boolean).join(' • '),
      })),
      ...sleepingLogs.map(log => ({
        type: 'Sleep',
        icon: 'bed-outline',
        time: toDate(log.startTime).toISOString(),
        details: `Sleep • ${formatSleepDuration(log.startTime, log.endTime)}`,
      })),
    ];

    // Sort by time ascending
    logs.sort((a, b) => new Date(a.time) - new Date(b.time));

    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};
