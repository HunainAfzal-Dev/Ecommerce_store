/**
 * 🧪 Load Test Script
 * Verifies all modules load correctly and lists registered routes.
 */

try {
    const app = require('./app');
    console.log('App loaded successfully - all modules OK');

    // Collect registered routes (handles nested routers)
    const routes = [];

    const getMountPath = (regexp) => {
        const str = regexp.toString();
        const match = str.match(/\/api\/[^\\/]*/);
        return match ? match[0] : '';
    };

    const walk = (stack, prefix) => {
        stack.forEach((r) => {
            if (r.route && r.route.path) {
                const methods = Object.keys(r.route.methods)
                    .filter((m) => r.route.methods[m])
                    .join(',')
                    .toUpperCase();
                routes.push(`  ${methods.padEnd(7)} ${prefix}${r.route.path}`);
            }
            if (r.handle && r.handle.stack) {
                const newPrefix = prefix + (r.regexp ? getMountPath(r.regexp) : '');
                walk(r.handle.stack, newPrefix);
            }
        });
    };

    walk(app._router.stack, '');

    console.log('\nRegistered API routes:');
    routes.forEach((route) => console.log(route));

    console.log('\nTest passed: All modules loaded successfully!');
} catch (err) {
    console.error('LOAD TEST FAILED:', err.message);
    process.exit(1);
}

