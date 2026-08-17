/**
 * DNS Fix v2: Patches the global fetch to resolve Supabase domain
 * via Google DNS since local router DNS has stale cache.
 */
const dns = require('dns');
const { Resolver } = dns;

// Create a resolver that uses Google DNS
const resolver = new Resolver();
resolver.setServers(['8.8.8.8', '8.8.4.4']);

// Resolve the domain once at startup and add to hosts-like mapping
const SUPABASE_HOST = 'fccsldwzbjhuawjyyslr.supabase.co';

async function patchDns() {
    return new Promise((resolve, reject) => {
        resolver.resolve4(SUPABASE_HOST, (err, addresses) => {
            if (err) {
                console.error('❌ Could not resolve Supabase domain via Google DNS:', err.message);
                reject(err);
                return;
            }
            
            console.log(`🔧 Resolved ${SUPABASE_HOST} → ${addresses.join(', ')}`);
            
            // Override Node's default DNS lookup to return our resolved IP for the supabase domain
            const originalLookup = dns.lookup;
            dns.lookup = function(hostname, options, callback) {
                if (typeof options === 'function') {
                    callback = options;
                    options = {};
                }
                
                if (hostname === SUPABASE_HOST) {
                    // Return the Google-DNS-resolved IP
                    const ip = addresses[0];
                    if (typeof options === 'object' && options.all) {
                        callback(null, addresses.map(addr => ({ address: addr, family: 4 })));
                    } else {
                        callback(null, ip, 4);
                    }
                    return;
                }
                
                // For all other hostnames, use the original lookup
                return originalLookup.call(dns, hostname, options, callback);
            };
            
            console.log('🔧 DNS lookup patched for Supabase domain');
            resolve();
        });
    });
}

module.exports = patchDns;
