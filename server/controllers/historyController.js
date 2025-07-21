const axios = require('axios');

const BASE_URL = 'http://192.168.1.9:3000';

const getDateOnly = (timestamp) => {
  return new Date(timestamp).toISOString().split('T')[0]; // 'YYYY-MM-DD'
};

exports.getLogsByDate = async (req, res) => {
  const date = req.params.date; // 'YYYY-MM-DD'
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

    const filteredFeeding = feedingLogs.filter(log => getDateOnly(log.timestamp) === date);
    const filteredDiaper = diaperLogs.filter(log => getDateOnly(log.timestamp) === date);
    const filteredSleeping = sleepingLogs.filter(log => getDateOnly(log.timestamp) === date);

    const logs = [
      ...filteredFeeding.map(log => ({
        type: 'Feeding',
        icon: 'baby-bottle-outline',
        time: new Date(log.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        details: log.amount
          ? `Bottle • ${log.amount} ${log.unit}`
          : `Breast • ${log.side} • ${log.duration} min`,
      })),
      ...filteredDiaper.map(log => ({
        type: 'Diaper',
        icon: 'paper-towel',
        time: new Date(log.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        details: `${log.type} • ${log.color}`,
      })),
      ...filteredSleeping.map(log => ({
        type: 'Sleep',
        icon: 'bed-outline',
        time: new Date(log.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        details: `${log.sleepType} • ${log.duration}`,
      })),
    ];

    logs.sort((a, b) =>
      new Date(`${date}T${a.time}`) - new Date(`${date}T${b.time}`)
    );

    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error.message);
    res.status(500).json({ error: 'Failed to fetch combined logs' });
  }
};
