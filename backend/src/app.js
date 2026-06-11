const express = require('express');
const cors = require('cors');
const rideRoutes = require('./routes/rideRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/rides', rideRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Campus Ride API opérationnelle' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

module.exports = app;