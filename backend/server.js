/**
 * 🚀 Server Entry Point
 *
 * Starts the HTTP server.
 */

// DNS fix: bypass stale router DNS cache (project was recently resumed)
const patchDns = require('./fix-dns');

require('dotenv').config();

// ===== HANDLE UNCAUGHT EXCEPTIONS =====
process.on('uncaughtException', (err) => {
    console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
    console.error(err.name, err.message);
    console.error(err.stack);
    process.exit(1);
});

// ===== HANDLE UNHANDLED PROMISE REJECTIONS =====
process.on('unhandledRejection', (err) => {
    console.error('❌ UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

// ===== START THE SERVER (after DNS patch) =====
let server;

async function start() {
    try {
        await patchDns();
    } catch (err) {
        console.error('⚠️  DNS patch failed, continuing with system DNS:', err.message);
    }

    const app = require('./app');
    const PORT = process.env.PORT || 5000;

    server = app.listen(PORT, () => {
        console.log(`🚀 Garments Store API running on port ${PORT}`);
        console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    });
}

start();


