# LemoChain JavaScript API

This is the LemoChain compatible JavaScript API which implements the Generic JSON RPC.


You need to run a local LemoChain node to use this library.

## Installation

### Using Yarn

```bash
yarn add lemo-client
```

### As Browser module

* Include `lemo-client.min.js` in your html file.
* Use the `LemoClient` object directly from global namespace:
    ```js
    const lemo = new LemoClient()
    ```

## Example

```js
const LemoClient = require('lemo-client')
const lemo = new LemoClient({
	host: 'http://127.0.0.1:8001'
})

lemo.chain.getBlockByNumber(0)
    .then(function(block) {
		console.log(block)
	})
```

## LemoChain API

lemo.getCurrentBlock(stable)
lemo.getBlock(hashOrHeight)
lemo.getGasPriceAdvice()
lemo.getCurrentHeight(stable)
lemo.getNodeVersion()
lemo.getSdkVersion()
lemo.net.getPeerCount()
lemo.mine.getMining()
lemo.mine.getLemoBase()


## Contribute!

### Requirements

* Node.js
* yarn

```bash
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install yarn
```

### Building (rollup)

```bash
yarn build
```

### Testing (mocha)

```bash
yarn test
```
