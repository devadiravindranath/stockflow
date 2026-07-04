const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/health.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());

// --------------- Routes ---------------
app.use('/api', healthRoutes);

// --------------- Error Handling ---------------
app.use(errorHandler);

module.exports = app;
