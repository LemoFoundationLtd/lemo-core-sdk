![Logo of the project](./logo.png)

# LemoChain JavaScript SDK
[![npm](https://img.shields.io/npm/v/lemo-client.svg?style=flat-square)](https://www.npmjs.com/package/lemo-client)
[![Build Status](https://img.shields.io/travis/lemo-client/lemo-client.svg?style=flat-square)](https://travis-ci.org/lemo-client/lemo-client)
[![code coverage](https://img.shields.io/coveralls/LemoFoundationLtd/lemo-client.svg?style=flat-square)](https://coveralls.io/r/LemoFoundationLtd/lemo-client)
[![install size](https://packagephobia.now.sh/badge?p=lemo-client)](https://packagephobia.now.sh/result?p=lemo-client)
[![gitter chat](https://img.shields.io/gitter/room/LemoFoundationLtd/lemo-client.svg?style=flat-square)](https://gitter.im/LemoFoundationLtd/lemo-client)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![GitHub license](https://img.shields.io/badge/license-LGPL3.0-blue.svg?style=flat-square)](https://github.com/LemoFoundationLtd/lemo-client/blob/master/LICENSE)

This is the LemoChain compatible JavaScript SDK which implements the Generic JSON RPC.


You need to run a local LemoChain node to use this library.

## Installing

### Using Yarn

```bash
yarn add lemo-client
```

### As Browser module

* Include `lemo-client.min.js` in your html file.
* Use the `LemoClient` object directly from global namespace:

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
> NOTE: Every API returns a promise, except `watchXXX` which return `watchId` for stop watching

### chain
jsSDK | 功能 | web端可用
---|---|---
lemo.getBlock(number, withTxList) | 根据高度获取稳定块（已共识） | ✓
lemo.getBlock(hash, withTxList) | 根据hash获取区块 | ✓
lemo.getCurrentBlock(false, withTxList) | 获取当前最新块 | ✓
lemo.getCurrentBlock(true, withTxList) | 获取最新的稳定块（已共识） | ✓
lemo.getCurrentHeight(false) | 获取当前高度 | ✓
lemo.getCurrentHeight(true) | 获取当前稳定块高度（已共识） | ✓
lemo.getGenesis() | 获取创世区块 | ✓
lemo.getChainID() | 获取当前链ID | ✓
lemo.getGasPriceAdvice() | 获取建议gas价格 | ✓
lemo.getNodeVersion() | 节点版本号 | ✓
lemo.getSdkVersion() | js SDK版本号 | ✓
lemo.watchBlock(withTxList, callback) | 监听新的区块 | ✓

### net
jsSDK | 功能 | web端可用
---|---|---
lemo.net.addPeer(nodeAddr) | 连接节点 | ✖
lemo.net.dropPeer(nodeAddr) | 断开节点 | ✖
lemo.net.getPeers() | 获取已连接的节点信息 | ✖
lemo.net.getPeersCount() | 获取已连接的节点数 | ✓
lemo.net.getInfo() | 获取本节点信息 | ✓

### mine
jsSDK | 功能 | web端可用
---|---|---
lemo.mine.start() | 开启挖矿 | ✖
lemo.mine.stop() | 停止挖矿 | ✖
lemo.mine.getMining() | 是否正在出块 | ✓
lemo.mine.getLemoBase() | 获取当前矿工节点的地址 | ✓

### account
jsSDK | 功能 | web端可用
---|---|---
lemo.account.newKeyPair() | 获得秘钥对 | ✖
lemo.account.getBalance(addr) | 获得输入地址余额 | ✓
lemo.account.getAccount(addr) | 获取输入地址的账户信息 | ✓

### tx
jsSDK | 功能 | web端可用
---|---|---
lemo.tx.sendTx(privateKey, txInfo) | 签名并发送交易 | ✓
lemo.tx.send(signedTxInfo) | 发送已签名的交易 | ✓
lemo.tx.sign(privateKey, txInfo) | 签名交易 | ✓
lemo.tx.watchPendingTx(callback) | 监听新的pending交易 | ✖


### 其它
js接口 | 功能 | web端可用
---|---|---
lemo.stopWatch(watchId) | 停止指定的轮询 | ✓
lemo.stopWatch() | 停止所有轮询 | ✓
lemo.isWatching() | 是否正在轮询 | ✓


## Developing

### Requirements

* Node.js
* yarn

```bash
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install yarn
```

### Building

```bash
yarn build
```


### Configuration

There is some configuration in [lib/config.js](https://github.com/LemoFoundationLtd/lemo-client/blob/master/lib/config.js). It is useful for those who want build a private LemoChain

### Testing

```bash
yarn test
```

## Licensing

LGPL-3.0
