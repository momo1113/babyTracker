const axios = require('axios');

const BASE_URL = 'http://192.168.1.9:3000'; // or your server URL
const TIME_ZONE = 'America/Los_Angeles'; // adjust to your local time zone

const toLocalDateString = (isoString) =>
  new Date(isoString).toLocaleDateString('en-CA', { timeZone: TIME_ZONE });

exports.getLogsByDate = async (req, res) => {
  const date = req.params.date; // expected format: YYYY-MM-DD
  console.log('getLogsByDate', date);

  try {
    const [feedingRes, diaperRes, sleepingRes] = await Promise.all([
      axios.get(`${BASE_URL}/feeding`),
      axios.get(`${BASE_URL}/diaper`),
      axios.get(`${BASE_URL}/sleeping`),
    ]);

    const feedingLogs = feedingRes.data;
    const diaperLogs = diaperRes.data;
    const sleepingLogs = sleepingRes.data;

    // Filter logs by local date
    const filteredFeeding = feedingLogs.filter((log) => {
      const logDate = toLocalDateString(log.timestamp);
      return logDate === date;
    });

    const filteredDiaper = diaperLogs.filter((log) => {
      const logDate = toLocalDateString(log.timestamp);
      return logDate === date;
    });

    const filteredSleeping = sleepingLogs.filter((log) => {
      const startDate = toLocalDateString(log.startTime);
      return startDate === date;
    });

    // Normalize and combine
    const logs = [
      ...filteredFeeding.map((log) => ({
        type: 'Feeding',
        icon: 'baby-bottle-outline',
        time: log.timestamp,
        details:
          log.feedingType === 'Breast'
            ? `Breast • ${log.side || ''} • ${log.duration || ''} min`.trim()
            : `Bottle • ${log.amount || ''} ${log.unit || ''}`.trim(),
      })),
      ...filteredDiaper.map((log) => ({
        type: 'Diaper',
        icon: 'paper-towel',
        time: log.timestamp,
        details: [log.diaperType, log.color, log.texture].filter(Boolean).join(' • '),
      })),
      ...filteredSleeping.map((log) => ({
        type: 'Sleep',
        icon: 'bed-outline',
        time: log.startTime,
        details: `Sleep • ${formatSleepDuration(log.startTime, log.endTime)}`,
      })),
    ];

    // Sort logs by timestamp ascending
    logs.sort((a, b) => new Date(a.time) - new Date(b.time));

    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error.message);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};

function formatSleepDuration(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end - start;

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
}
