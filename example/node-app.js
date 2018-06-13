#!/usr/bin/env node

var LemoClient = require('../index.js');
var lemoClient = new LemoClient();

lemoClient.setProvider(new LemoClient.providers.HttpProvider('http://localhost:8545'));

var coinbase = lemoClient.lemo.coinbase;
console.log(coinbase);

var balance = lemoClient.lemo.getBalance(coinbase);
console.log(balance.toString(10));
