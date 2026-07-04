const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());

// --------------- Routes ---------------
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);

// --------------- Error Handling ---------------
app.use(errorHandler);

module.exports = app;
