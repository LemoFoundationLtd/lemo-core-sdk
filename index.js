var LemoClient = require('./lib/lemo_client');

// dont override global variable
if (typeof window !== 'undefined' && typeof window.LemoClient === 'undefined') {
    window.LemoClient = LemoClient;
}

module.exports = LemoClient;
