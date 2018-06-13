# LemoChain JavaScript API

This is the LemoChain compatible JavaScript API which implements the Generic JSON RPC spec. It's available on npm as a node module.

[![NPM version][npm-image]][npm-url]

You need to run a local LemoChain node to use this library.

## Installation

### Node.js

```bash
npm install lemo_client
```

### Yarn

```bash
yarn add lemo_client
```

### As Browser module

* Include `lemo_client.min.js` in your html file.

## Usage
Use the `LemoClient` object directly from global namespace:

```js
console.log(LemoClient); // {lemo: .., shh: ...} // it's here!
```

Set a provider (HttpProvider)

```js
if (typeof lemoClient !== 'undefined') {
  lemoClient = new LemoClient(lemoClient.currentProvider);
} else {
  // set the provider you want from LemoClient.providers
  lemoClient = new LemoClient(new LemoClient.providers.HttpProvider("http://localhost:8545"));
}
```

Set a provider (HttpProvider using [HTTP Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication))

```js
lemoClient.setProvider(new LemoClient.providers.HttpProvider('http://host.url', 0, BasicAuthUsername, BasicAuthPassword));
```

There you go, now you can use it:

```js
var coinbase = lemoClient.lemo.coinbase;
var balance = lemoClient.lemo.getBalance(coinbase);
```

You can find more examples in [`example`](https://github.com/LemoFoundationLtd/lemo_client/tree/master/example) directory.


## Contribute!

### Requirements

* Node.js
* npm

```bash
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
sudo apt-get install nodejs-legacy
```

### Building (gulp)

```bash
npm run build
```


### Testing (mocha)

```bash
npm test
```


[npm-image]: https://badge.fury.io/js/lemo_client.svg
[npm-url]: https://npmjs.org/package/lemo_client
