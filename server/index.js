const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Import routes
const feedingRoutes = require('./routes/feeding');
const diaperRoutes = require('./routes/diaper'); 
const sleepRoutes = require('./routes/sleeping');
const babyProfileRoutes = require('./routes/babyProfile');
const todayLogsRoutes = require('./routes/todayLogs');
const historyRoutes = require('./routes/history');

// Register routes
app.use('/feeding', feedingRoutes);
app.use('/diaper', diaperRoutes); 
app.use('/sleeping', sleepRoutes);
app.use('/baby-profile', babyProfileRoutes); 
app.use('/logs/today', todayLogsRoutes);
app.use('/history', historyRoutes);

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
