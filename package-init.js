/* jshint ignore:start */


// Browser environment
if(typeof window !== 'undefined') {
    LemoClient = (typeof window.LemoClient !== 'undefined') ? window.LemoClient : require('lemo-client');
    BigNumber = (typeof window.BigNumber !== 'undefined') ? window.BigNumber : require('bignumber.js');
}


// Node environment
if(typeof global !== 'undefined') {
    LemoClient = (typeof global.LemoClient !== 'undefined') ? global.LemoClient : require('./dist/lemo-client');
    BigNumber = (typeof global.BigNumber !== 'undefined') ? global.BigNumber : require('bignumber.js');
}

/* jshint ignore:end */
