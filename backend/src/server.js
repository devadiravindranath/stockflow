require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[StockFlow] Server running on port ${PORT}`);
  console.log(`[StockFlow] Environment: ${process.env.NODE_ENV || 'development'}`);
});
