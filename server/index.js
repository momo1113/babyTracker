const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from backend server!');
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});