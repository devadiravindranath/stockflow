require('dotenv').config();

const app = require('./app');
const { initDatabase } = require('./models/database');

// Initialize Database Schema
initDatabase();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[StockFlow] Server running on port ${PORT}`);
  console.log(`[StockFlow] Environment: ${process.env.NODE_ENV || 'development'}`);
});
