const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Import routes
const feedingRoutes = require('./routes/feeding');
const diaperRoutes = require('./routes/diaper'); 

// Register routes
app.use('/feeding', feedingRoutes);
app.use('/diaper', diaperRoutes); 

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
