/**
 * 🏗️ Express Application Setup
 *
 * Creates and configures the Express app.
 * Separated from server.js so it can be imported in tests.
 */

const express = require('express');
const cors = require('cors');

const errorHandler = require('./src/middleware/errorHandler');
const apiRoutes = require('./src/routes/index');

const app = express();

// ===== 1️⃣ GLOBAL MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== 2️⃣ HEALTH CHECK ROUTE =====
app.get('/api/health', (req, res) => {
    res.json({
        status: 'Success',
        message: '🚀 Garments Store API is running smoothly!',
        timestamp: new Date().toISOString()
    });
});

// ===== 3️⃣ MOUNT API ROUTES =====
app.use('/api', apiRoutes);

// ===== 4️⃣ 404 HANDLER =====
app.all('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    });
});

// ===== 5️⃣ GLOBAL ERROR HANDLER =====
app.use(errorHandler);

module.exports = app;

