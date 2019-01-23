![Logo of the project](./logo.png)

# LemoChain JavaScript SDK
[![npm](https://img.shields.io/npm/v/lemo-client.svg?style=flat-square)](https://www.npmjs.com/package/lemo-client)
[![Build Status](https://travis-ci.org/LemoFoundationLtd/lemo-client.svg?branch=master)](https://travis-ci.org/LemoFoundationLtd/lemo-client)
[![Coverage Status](https://coveralls.io/repos/github/LemoFoundationLtd/lemo-client/badge.svg?branch=master)](https://coveralls.io/github/LemoFoundationLtd/lemo-client?branch=master)
[![install size](https://packagephobia.now.sh/badge?p=lemo-client)](https://packagephobia.now.sh/result?p=lemo-client)
[![gitter chat](https://img.shields.io/gitter/room/LemoFoundationLtd/lemo-client.svg?style=flat-square)](https://gitter.im/LemoFoundationLtd/lemo-client)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![GitHub license](https://img.shields.io/badge/license-LGPL3.0-blue.svg?style=flat-square)](https://github.com/LemoFoundationLtd/lemo-client/blob/master/LICENSE)

This is the LemoChain compatible JavaScript SDK which implements the Generic JSON RPC.


> You need to run a local [LemoChain node](https://github.com/LemoFoundationLtd/lemochain-go) with flag `--rpc` or connect to a remote LemoChain node to use this library.

[中文版](https://github.com/LemoFoundationLtd/lemo-client/blob/master/README_zh.md)  
[English](https://github.com/LemoFoundationLtd/lemo-client/blob/master/README.md)

## Installing

### Using Yarn

```bash
yarn add lemo-client
```

### As Browser module

* Include `lemo-client.min.js` in your html file.
* Use the `LemoClient` object directly from global namespace

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
> Almost every API returns a promise object, except `watchXXX`, `stopWatch` and so on  
> All API available in the console of LemoChain node. But some APIs are not available over remote connection such as http, websocket

API | description | available for remote
---|---|---
[lemo.getBlock(heightOrHash, withBody)](#submodule-chain-getBlock) | Get block by height or block hash | ✓
[lemo.getCurrentBlock(stable, withBody)](#submodule-chain-getCurrentBlock) | Get the newest block | ✓
[lemo.getCurrentHeight(stable)](#submodule-chain-getCurrentHeight) | Get the newest block height | ✓
[lemo.getGenesis()](#submodule-chain-getGenesis) | Get the first block | ✓
[lemo.getChainID()](#submodule-chain-getChainID) | Get the chain ID | ✓
[lemo.getGasPriceAdvice()](#submodule-chain-getGasPriceAdvice) | Get transaction gas price advice | ✓
[lemo.getNodeVersion()](#submodule-chain-getNodeVersion) | Get the version of LemoChain node | ✓
[lemo.getSdkVersion()](#submodule-chain-getSdkVersion) | Get the version of lemo-client | ✓
[lemo.watchBlock(withBody, callback)](#submodule-chain-watchBlock) | Listen for new block | ✓
[lemo.net.connect(nodeAddr)](#submodule-net-connect) | Connect to a LemoChain node | ✖
[lemo.net.disconnect(nodeAddr)](#submodule-net-disconnect) | Disconnect to a LemoChain node | ✖
[lemo.net.getConnections()](#submodule-net-getConnections) | Get the information of connections | ✖
[lemo.net.getConnectionsCount()](#submodule-net-getConnectionsCount) | Get the count of connections | ✓
[lemo.net.getInfo()](#submodule-net-getInfo) | Get current node information | ✓
[lemo.mine.start()](#submodule-mine-start) | Start mining | ✖
[lemo.mine.stop()](#submodule-mine-stop) | Stop mining | ✖
[lemo.mine.getMining()](#submodule-mine-getMining) | True if current LemoChain node is mining | ✓
[lemo.mine.getMiner()](#submodule-mine-getMiner) | Get the mining benefit account address of current LemoChain node | ✓
[lemo.account.newKeyPair()](#submodule-account-newKeyPair) | Create a private key and account address | ✖
[lemo.account.getBalance(addr)](#submodule-account-getBalance) | Get the balance of an account  | ✓
[lemo.account.getAccount(addr)](#submodule-account-getAccount) | Get the information of an account  | ✓
[lemo.tx.sendTx(privateKey, txInfo)](#submodule-tx-sendTx) | Sign and send transaction | ✓
[lemo.tx.sign(privateKey, txInfo)](#submodule-tx-sign) | Sign transaction | ✓
[lemo.tx.send(signedTxInfo)](#submodule-tx-send) | Send a signed transaction | ✓
[lemo.tx.watchPendingTx(callback)](#submodule-tx-watchPendingTx) | Listening for new transactions | ✖
[lemo.tool.verifyAddress(addr)](#submodule-tool-verifyAddress) | Verify a LemoChain address | ✓
[lemo.stopWatch(watchId)](#submodule-stopWatch) | Stop listening | ✓
[lemo.isWatching()](#submodule-isWatching) | True if is listening | ✓

---

### Protocol
Send and receive data by json format, use [JSON-RPC2.0](https://www.jsonrpc.org/specification) standard.  
For convenient, all numbers will be convert to string. So the numbers will never overflow.

#### POST request
```
{
    "jsonrpc": "2.0",
    "method": "chain_getBlockByHeight",
    "params": [1, false],
    "id": 1
}
```
- `jsonrpc` - (string) Always `2.0`
- `method` - (string) API module name and method name connected by `_`
- `params` - (Array) API method parameters, object is available
- `id` - (number) Increasing request id

#### Success response
```
{
    "jsonrpc": "2.0",
    "result": {...},
    "id": 1
}
```
- `jsonrpc` - (string) Always `2.0`
- `result` - (*) The result could be any type
- `id` - (number) The id in request

#### Error response
```
{
    "jsonrpc": "2.0",
    "error": {"code": -32601, "message": "Method not found"},
    "id": 1
}
```
- `jsonrpc` - (string) Always `2.0`
- `error` - (object) The error detail. It contains a negtive number `code` and a string `message`.
- `id` - (number) The id in request

---

### Data structure

<a name="data-structure-block"></a>
#### block
```json
{
    "header": {},
    "transactions": [],
    "changeLogs": [],
    "confirms": [],
    "events": [],
    "deputyNodes": []
}
```
- `header` The [header](#data-structure-header) of block
- `transactions` All [Transactions](#data-structure-transaction) in block
- `changeLogs` The account data [changeLogs](#data-structure-changeLog) by transactions in block
- `confirms` The [signatures](#data-structure-confirm) from deputies after they verified the block
- `events` The [contract events](#data-structure-event) from transactions in block
- `deputyNodes` New [deputy nodes information](#data-structure-deputyNode) If the block is `snapshot block`, or else it is empty

<a name="data-structure-header"></a>
#### header
The header of block
```json
{
    "hash": "0x11d9153b14adb92a14c16b66c3524d62b4742c0e7d375025525e2f131de37a8b",
    "height": "0",
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "miner": "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG",
    "signData": "0x",
    "timestamp": "1535630400",
    "gasLimit": "105000000",
    "gasUsed": "0",
    "eventBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "changeLogRoot": "0x93273cebb4f0728991811d5d7c57ae8f88a83524eedb0af48b3061ed2e8017b8",
    "deputyRoot": "0x49b613bbdf76be3fe761fd60d1ade6d2835315047c53d6e8199737898b8d9b47",
    "eventRoot": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
    "transactionRoot": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
    "versionRoot": "0x1e78c4779248d3d8d3cd9b77bf7b67b4c759ec87d45d52a3e79c928290773f4c",
    "extraData": "0x"
}
```
- `hash` Block hash
- `height` Block height
- `parentHash` Previous block hash
- `miner` Address of the account who produce this block
- `signData` Miner's signatue of the block hash
- `timestamp` The time of block creation in seconds
- `gasLimit` Max gas limit for all transactions in block
- `gasUsed` Used gas of all transactions in block
- `eventBloom` The bloom filter for speed up contract events query. Calculated by `events` in block
- `changeLogRoot` The root hash of block's `changeLogs` Merkle Trie
- `deputyRoot` The root hash of block's `deputyNodes` Merkle Trie
- `eventRoot` The root hash of block's `events` Merkle Trie
- `transactionRoot` The root hash of block's `transactions` Merkle Trie
- `versionRoot` The root hash of global `versions` Merkle Patricia Trie. This trie is storing all accounts' newest version
- `extraData` (optional) The custom data from miner

<a name="data-structure-transaction"></a>
#### transaction
Signed transaction
```json
{
  "from": "Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D",
  "to": "Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY",
  "toName": "",
  "amount": "100",
  "data": "0x",
  "expirationTime": "1541566996",
  "gasLimit": "2000000",
  "gasPrice": "3000000000",
  "hash": "0x6d3062a9f5d4400b2002b436bc69485449891c83e23bf9e27229234da5b25dcf",
  "message": "",
  "r": "0xaf5e573f07e4aaa2932b21b90a4b1b1a317b00a83d66908a0053a337319b149d",
  "s": "0x6c1fbad11a56720fe219ef67c0ada27fa3c76212cc849f519e5fbcbe83a88b6b",
  "v": "0x20001"
}
```
- `from` Sender address. It is generated by the signature data
- `to` Recipient address
- `toName` (optional) Recipient name. It will be checked with `to` for safe
- `amount` Amount in `mo`. 1`LEMO`=1000000000000000000`mo`=1e18`mo`
- `data` (optional) The extra data. It usually using for calling smart contract. It depends on `type` that how to using this field
- `expirationTime` The expiration time of transaction in seconds. If a transaction's expiration time is more than half hour from now, it may not be packaged in block. It depends on the transactions picking logic from miner
- `gasLimit` Max gas limit of transaction. The transaction will be fail if it cost more gas than gasLimit. And the gas will not be refunded
- `gasPrice` Price of every gas in `mo`. The more gas price the more priority
- `hash` Transaction hash
- `message` (optional) Extra text message from sender
- `r` Signature data
- `s` Signature data
- `v` This field is combined from transaction `type`, `version`(current is 0), `signature recovery data`, `chainID`

transaction type | description
---|---
0 | Normal transaction or smart contract execution transaction

chainID | description
---|---
1 | LemoChain main net
100 | LemoChain test net

<a name="data-structure-changeLog"></a>
#### changeLog
The modification record of data on chain
```json
{
    "address": "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG",
    "extra": "",
    "newValue": "0x8c052b7d2dcc80cd2e40000000",
    "type": "BalanceLog",
    "version": "1"
}
```
- `address` The address of account which data is changed
- `version` The version of account data. Every type data has its own version
- Depends on different `type`, the `newValue` and `extra` have different functions

type | description | newValue | extra
---|---|---|---
BalanceLog | The change of account balance | New balance | -
StorageLog | The change of storage in contract account | storage value | storage key
CodeLog | Creation of contract account | Contract's code | -
AddEventLog | Creation a contract event | Contract event | -
SuicideLog | Destroying a contract account | - | -

<a name="data-structure-confirm"></a>
#### confirm
The signature of block hash from a deputy node after him verified the block
```
0x1234
```

<a name="data-structure-event"></a>
#### event
Smart contract event
```json
{
    "address": "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG"
}
```

<a name="data-structure-deputyNode"></a>
#### deputyNode
Deputy node information
```json
{
    "ip": "127.0.0.1",
    "minerAddress": "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG",
    "nodeID": "0x5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0",
    "port": "7001",
    "rank": "0",
    "votes": "50000"
}
```
- `ip` Deputy node IP address
- `minerAddress` The account address to receive mining benefit
- `nodeID` The LemoChain node ID, it is from the public key whose private key is using for sign blocks
- `port` The port to connect other nodes
- `rank` The rank of all deputy nodes
- `votes` The votes count

<a name="data-structure-account"></a>
#### account
Account information
```json
{
    "address": "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG",
    "balance": "1599999999999999999999999900",
    "records": {
        "BalanceLog": {
            "version": "3",
            "height": "1"
        }
    },
    "codeHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "root": "0x0000000000000000000000000000000000000000000000000000000000000000"
}
```
- `address` Account address
- `balance` Account balance. It is a modified `BigNumber` object. It has a method `toMoney()` to output formatted balance
- `records` Modification record object of account. The key is type of [ChangeLog](data-structure-changeLog), value is the newest `ChangeLog`'s version and height of the block which contains this newest `ChangeLog`
- `codeHash` Hash of contract code
- `root` The hash of contranct storage MPT root

---

### Constructor
```
lemo = new LemoClient({
    chainID: 1, 
    host: 'http://127.0.0.1:8001'
})
```
- `chainID` ChainID of LemoChain. Default value is `1`, it represents main net
- `host` LemoChain node's http listening address. The default value is  `http://127.0.0.1:8001`
    > NOTE: If the cross domain issue appear. Try to use flag `--rpccorsdomain http://[domain of the web page]:[port]` to restart LemoChain node.

---

### chain API

<a name="submodule-chain-getBlock"></a>
#### lemo.getBlock
```
lemo.getBlock(heightOrHash [, withBody])
```
Get block by height or block hash

##### Parameters
1. `number|string` - Block height or block hash. If it is block height, only stable blocks will be retrived which confirmed by most deputy nodes
2. `boolean` - (optional) Enable to get block body such as transactions. Default value is `false`

##### Returns
`Promise` - Call `then` method to get [block](#data-structure-block) object

##### Example
```js
lemo.getBlock(0).then(function(block) {
    console.log(block.header.hash); // "0x11d9153b14adb92a14c16b66c3524d62b4742c0e7d375025525e2f131de37a8b"
})
```

---

<a name="submodule-chain-getCurrentBlock"></a>
#### lemo.getCurrentBlock
```
lemo.getCurrentBlock([stable [, withBody]])
```
Get the newest block

##### Parameters
1. `boolean` - (optional) If it is true, only stable blocks will be retrived which confirmed by most deputy nodes. Default value is `true`
2. `boolean` - (optional) Enable to get block body such as transactions. Default value is `false`

##### Returns
`Promise` - Call `then` method to get [block](#data-structure-block) object

##### Example
```js
lemo.getCurrentBlock(true).then(function(block) {
    console.log(block.header.miner); // "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG"
})
```

---

<a name="submodule-chain-getCurrentHeight"></a>
#### lemo.getCurrentHeight
```
lemo.getCurrentHeight([stable])
```
Get the newest block height

##### Parameters
1. `boolean` - (optional) If it is true, only stable blocks will be retrived which confirmed by most deputy nodes. Default value is `true`

##### Returns
`Promise` - Call `then` method to get height string

##### Example
```js
lemo.getCurrentHeight(true).then(function(height) {
    console.log(height); // "100"
})
```

---

<a name="submodule-chain-getGenesis"></a>
#### lemo.getGenesis
```
lemo.getGenesis()
```
Get the first block

##### Parameters
None

##### Returns
`Promise` - Call `then` method to get [block](#data-structure-block) object

##### Example
```js
lemo.getGenesis().then(function(height) {
    console.log(block.header.parentHash); // "0x0000000000000000000000000000000000000000000000000000000000000000"
})
```

---

<a name="submodule-chain-getChainID"></a>
#### lemo.getChainID
```
lemo.getChainID()
```
Get the chain ID from current connected LemoChain node

##### Parameters
None

##### Returns
`Promise` - Call `then` method to get chainID string

##### Example
```js
lemo.getChainID().then(function(chainID) {
    console.log(chainID); // "1"
})
```

---

<a name="submodule-chain-getGasPriceAdvice"></a>
#### lemo.getGasPriceAdvice
```
lemo.getGasPriceAdvice()
```
Get transaction gas price advice

##### Parameters
None

##### Returns
`Promise` - Call `then` method to get gas price advice string in uint `mo`

##### Example
```js
lemo.getGasPriceAdvice().then(function(gasPrice) {
    console.log(gasPrice); // "2000000000"
})
```

---

<a name="submodule-chain-getNodeVersion"></a>
#### lemo.getNodeVersion
```
lemo.getNodeVersion()
```
Get the version of LemoChain node

##### Parameters
None

##### Returns
`Promise` - Call `then` method to get version string

##### Example
```js
lemo.getNodeVersion().then(function(version) {
    console.log(version); // "1.0.0"
})
```

---

<a name="submodule-chain-getSdkVersion"></a>
#### lemo.getSdkVersion
```
lemo.getSdkVersion()
```
Get the version of lemo-client

##### Parameters
None

##### Returns
`Promise` - Call `then` method to get version string

##### Example
```js
lemo.getSdkVersion().then(function(version) {
    console.log(version); // "1.0.0"
})
```

---

<a name="submodule-chain-watchBlock"></a>
#### lemo.watchBlock
```
lemo.watchBlock(withBody, callback)
```
Listen for new block. The callback function will be called at the beginning and every times a new stable block produced.

##### Parameters
1. `boolean` - (optional) Enable to get block body such as transactions. Default value is `false`
2. `Function` - Used to receive [block](#data-structure-block) object

##### Returns
`number` - watchId for [stop watching](#submodule-stopWatch)

##### Example
```js
lemo.watchBlock(true, function(block) {
    const d = new Date(1000 * parseInt(block.header.timestamp, 10))
    console.log(d.toUTCString()); // "Thu, 30 Aug 2018 12:00:00 GMT"
})
```

---

### net API

<a name="submodule-net-connect"></a>
#### lemo.net.connect
```
lemo.net.connect(nodeAddr)
```
Connect to a LemoChain node

##### Parameters
1. `string` - Node ID and IP address

##### Returns
`Promise` - No data input in `then` function

##### Example
```js
lemo.net.connect('5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0@127.0.0.1:60002')
```

---

<a name="submodule-net-disconnect"></a>
#### lemo.net.disconnect
```
lemo.net.disconnect(nodeAddr)
```
Disconnect to a LemoChain node

##### Parameters
1. `string` - ip address

##### Returns
`Promise` - Call `then` method to get boolean

##### Example
```js
lemo.net.disconnect('127.0.0.1:60002').then(function(success) {
    console.log(sucess ? 'success' : 'fail');
})
```

---

<a name="submodule-net-getConnections"></a>
#### lemo.net.getConnections
```
lemo.net.getConnections()
```
Get the information of connections

##### Parameters
None

##### Returns
`Promise` - Call `then` method to get connection information list

##### Example
```js
lemo.net.getConnections().then(function(connections) {
    console.log(connections);
    // [{
    //   localAddress: "127.0.0.1:50825",
    //   nodeID: "ddb5fc36c415799e4c0cf7046ddde04aad6de8395d777db4f46ebdf258e55ee1d698fdd6f81a950f00b78bb0ea562e4f7de38cb0adf475c5026bb885ce74afb0",
    //   remoteAddress: "127.0.0.1:60002"
    // }]
})
```

---

<a name="submodule-net-getConnectionsCount"></a>
#### lemo.net.getConnectionsCount
```
lemo.net.getConnectionsCount()
```
Get the count of connections

##### Parameters
None

##### Returns
`Promise` - Call `then` method to get connection count

##### Example
```js
lemo.net.getConnectionsCount().then(function(count) {
    console.log(count); // "1"
})
```

---

<a name="submodule-net-getInfo"></a>
#### lemo.net.getInfo
```
lemo.net.getInfo()
```
Get current node information

##### Parameters
None

##### Returns
`Promise` - Call `then` method to get node information

##### Example
```js
lemo.net.getInfo().then(function(info) {
    console.log(info.nodeName); // "Lemo"
    console.log(info.nodeVersion); // "1.0.0"
    console.log(info.os); // "windows-amd64"
    console.log(info.port); // "60001"
    console.log(info.runtime); // "go1.10.1"
})
```

---

### mine API

<a name="submodule-mine-start"></a>
#### lemo.mine.start
```
lemo.mine.start()
```
Start mining

##### Parameters
None

##### Returns
`Promise` - No data input in `then` function

##### Example
```js
lemo.mine.start()
```

---

<a name="submodule-mine-stop"></a>
#### lemo.mine.stop
```
lemo.mine.stop()
```
Stop mining

##### Parameters
None

##### Returns
`Promise` - No data input in `then` function

##### Example
```js
lemo.mine.stop()
```

---

<a name="submodule-mine-getMining"></a>
#### lemo.mine.getMining
```
lemo.mine.getMining()
```
True if current LemoChain node is mining

##### Parameters
None

##### Returns
`Promise` - Call `then` method to get boolean

##### Example
```js
lemo.mine.getMining().then(function(isMining) {
    console.log(isMining ? 'mining' : 'not mining');
})
```

---

<a name="submodule-mine-getMiner"></a>
#### lemo.mine.getMiner
```
lemo.mine.getMiner()
```
Get the account address to receive mining benefit

##### Parameters
None

##### Returns
`Promise` - Call `then` method to get account address

##### Example
```js
lemo.mine.getMiner()
    .then(function(miner) {
        console.log(miner); // "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG"
    })
```

---

### account API

<a name="submodule-account-newKeyPair"></a>
#### lemo.account.newKeyPair
```
lemo.account.newKeyPair()
```
Create a private key and account address

##### Parameters
None

##### Returns
`Promise` - Call `then` method to get account key object

##### Example
```js
lemo.account.newKeyPair()
    .then(function(accountKey) {
        console.log(accountKey.private); // "0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52"
        console.log(accountKey.public); // "0x0b3eebecd39c972767ad39e2df2db4c8af91b9f50a038e18f1e20335630d11624a794c5e0e4d6a0547f30bf21ca1d6cf87f6390676f42c2201b15fdc88d5f6f7"
        console.log(accountKey.address); // "Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34"
    })
```

---

<a name="submodule-account-getBalance"></a>
#### lemo.account.getBalance
```
lemo.account.getBalance(address)
```
Get the balance of an account

##### Parameters
1. `string` - account address

##### Returns
`Promise` - Call `then` method to get balance `BigNumber` object

##### Example
```js
lemo.account.getBalance('Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34')
    .then(function(balance) {
        console.log(balance.toString(10)); // "1600000000000000000000000000"
    })
```

---

<a name="submodule-account-getAccount"></a>
#### lemo.account.getAccount
```
lemo.account.getAccount(address)
```
Get the information of an account

##### Parameters
1. `string` - account address

##### Returns
`Promise` - Call `then` method to get [account](#data-structure-account) information

##### Example
```js
lemo.account.getBalance('Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34')
    .then(function(account) {
        console.log(account.balance.toMoney()); // "1600000000 LEMO"
    })
```

---

### tx API

<a name="submodule-tx-sendTx"></a>
#### lemo.tx.sendTx
```
lemo.tx.sendTx(privateKey, txInfo)
```
Sign and send transaction

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction
    - `type` - (number) (optional) Transaction type. Default value is `0`
    - `version` - (number) (optional) Transaction encode version. Default value is `0`
    - `to` - (string) (optional) Recipient address. Empty `to` represents a contract creation transaction with contract code in `data` field
    - `toName` - (string) (optional) Recipient name. It will be checked with `to` for safe
    - `amount` - (number|string) (optional) Amount in `mo`. Default value is `0`
    - `gasPrice` - (number|string) (optional) Max gas limit of transaction. Default value is `3000000000`
    - `gasLimit` - (number|string) (optional) Price of every gas in `mo`. Default value is `2000000`
    - `data` - (Buffer|string) (optional) The extra data. It usually be using for calling smart contract
    - `expirationTime` - (number|string) (optional) The expiration time of transaction in seconds. Default is half hour from now
    - `message` - (string) (optional) Extra text message from sender

##### Returns
`Promise` - Call `then` method to get transaction hash

##### Example
```js
const txInfo = {to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34', amount: 100}
lemo.tx.sendTx('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', txInfo)
    .then(function(txHash) {
        console.log(txHash);
    })
```

---

<a name="submodule-tx-sign"></a>
#### lemo.tx.sign
```
lemo.tx.sign(privateKey, txInfo)
```
Sign transaction and return the signed transaction string  
The API is used for implement safety offline transaction:
1. Sign transaction on a offline device
2. Copy the output string ( untamable ) to a online device
3. Call [`lemo.tx.send`](submodule-tx-send) to send the transaction to LemoChain

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`lemo.tx.sendTx`](submodule-tx-sendTx)

##### Returns
`Promise` - Call `then` method to get signed [transaction](#data-structure-transaction) information string

##### Example
```js
const txInfo = {to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34', amount: 100}
lemo.tx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', txInfo)
    .then(function(signedTx) {
        console.log(signedTx);
        // {"amount":"100","expirationTime":"1535632200","gasLimit":"2000000","gasPrice":"3000000000","r":"0xdefbd406e0aed8a01ac33877a0267ca720e8231b7660d790386ae45686cf8781","s":"0x3de9fea170ec8fba0cd2574878554558616733c45ea03975bb41104bab3bd312","to":"Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34","v":"0x030001"}
    })
```

---

<a name="submodule-tx-send"></a>
#### lemo.tx.send
```
lemo.tx.send(signedTxInfo)
```
Send a signed transaction

##### Parameters
1. `object|string` - Signed [transaction](#data-structure-transaction) information. It could be a string which returned by [`lemo.tx.sign`](submodule-tx-sign), as well as an object like the same parameter in [`lemo.tx.sendTx`](submodule-tx-sendTx), but these fields instead of `type`, `version`:
    - `r` - (Buffer|string) Signature data
    - `s` - (Buffer|string) Signature data
    - `v` - (Buffer|string) This field is combined from transaction `type`, `version`(current is 0), `signature recovery data`, `chainID`

##### Returns
`Promise` - Call `then` method to get transaction hash

##### Example
```js
const txInfo = {to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34', amount: 100}
lemo.tx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', txInfo)
    .then(function(signedTx) {
        return lemo.tx.send(signedTx)
    }).then(function(txHash) {
        console.log(txHash);
    })
```

---

<a name="submodule-tx-watchPendingTx"></a>
#### lemo.tx.watchPendingTx
```
lemo.tx.watchPendingTx(callback)
```
Listen for new transactions. The callback function will be called at the beginning and every times new transactions come. (unimplemented in 1.0.0)

##### Parameters
1. `Function` - Used to receive [transaction](#data-structure-transaction) list

##### Returns
`number` - WatchId for [stop watching](#submodule-stopWatch)

##### Example
```js
lemo.watchPendingTx(true, function(transactions) {
    console.log(transactions.length);
})
```

---

### other API

<a name="submodule-tool-verifyAddress"></a>
#### lemo.tool.verifyAddress
```
lemo.tool.verifyAddress(addr)
```
Verify LemoChain address

##### Parameters
1. `string` - LemoChain address

##### Returns
`string` - Verify error message. If the address is valid, then return empty string

##### Example
```js
const errMsg = lemo.tool.verifyAddress('LEMObw')
if (errMsg) {
    console.error(errMsg);
}
```

---

<a name="submodule-stopWatch"></a>
#### lemo.stopWatch
```
lemo.tx.stopWatch(watchId)
```
Stop listening

##### Parameters
1. `number|undefined` - (optional) The id from `lemo.watchXXX`. If is undefined, then stop all watching

##### Returns
None

##### Example
```js
lemo.stopWatch()
```

---

<a name="submodule-isWatching"></a>
#### lemo.isWatching
```
lemo.tx.isWatching()
```
True if is listening

##### Parameters
None

##### Returns
`boolean` - True if is listening

##### Example
```js
console.log(lemo.isWatching() ? 'watching' : 'not watching')
```

---


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
