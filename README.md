![Logo of the project](./logo.png)

# LemoChain Core SDK
[![npm](https://img.shields.io/npm/v/lemo-core-sdk.svg?style=flat-square)](https://www.npmjs.com/package/lemo-core-sdk)
[![Build Status](https://travis-ci.org/LemoFoundationLtd/lemo-core-sdk.svg?branch=master)](https://travis-ci.org/LemoFoundationLtd/lemo-core-sdk)
[![Coverage Status](https://coveralls.io/repos/github/LemoFoundationLtd/lemo-core-sdk/badge.svg?branch=master)](https://coveralls.io/github/LemoFoundationLtd/lemo-core-sdk?branch=master)
[![GitHub license](https://img.shields.io/badge/license-LGPL3.0-blue.svg?style=flat-square)](https://github.com/LemoFoundationLtd/lemo-core-sdk/blob/master/LICENSE)

This is the LemoChain Core node SDK which implements the Generic JSON RPC.


> You need to run a local [LemoChain Core node](https://github.com/LemoFoundationLtd/lemochain-core) with flag `--rpc` or connect to a remote LemoChain Core node to use this library.

[中文版](https://github.com/LemoFoundationLtd/lemo-core-sdk/blob/master/README_zh.md)  
[English](https://github.com/LemoFoundationLtd/lemo-core-sdk/blob/master/README.md)

## Installing

### Using Yarn

```bash
yarn add lemo-core-sdk
```

### As Browser module

* Include `lemo-core-sdk.min.js` in your html file.
* Use the `LemoCore` object directly from global namespace

## Example

```js
const LemoCore = require('lemo-core-sdk')
const lemo = new LemoCore({
    host: 'http://127.0.0.1:8001'
})

lemo.chain.getBlockByNumber(0)
    .then(function(block) {
        console.log(block)
    })
```

## LemoChain Core API
> Almost every API returns a promise object, except `watchXXX`, `stopWatch` and so on  
> All API available in the console of LemoChain core. But some APIs are not available over remote connection such as http, websocket

API | description | asynchronous | available for remote
---|---|---|---
[lemo.getBlock(heightOrHash, withBody)](#submodule-chain-getBlock) | Get block by height or block hash | ✓ | ✓
[lemo.getNewestBlock(withBody)](#submodule-chain-getNewestBlock) | Get the newest block | ✓ | ✓
[lemo.getNewestUnstableBlock()](#submodule-chain-getNewestUnstableBlock) | Get the newest unstable block | ✓ | ✖
[lemo.getNewestHeight()](#submodule-chain-getNewestHeight) | Get the newest block height | ✓ | ✓
[lemo.getNewestUnstableHeight()](#submodule-chain-getNewestUnstableHeight) | Get the newest unstable block height | ✓ | ✖
[lemo.getGenesis()](#submodule-chain-getGenesis) | Get the first block | ✓ | ✓
[lemo.getChainID()](#submodule-chain-getChainID) | Get the chain ID | ✓ | ✓
[lemo.getCandidateTop30()](#submodule-chain-getCandidateTop30) | Get top 30 candidates information | ✓ | ✓
[lemo.getDeputyNodeList()](#submodule-chain-getDeputyNodeList) | Get the address list of current deputy nodes | ✓ | ✓
[lemo.getNodeVersion()](#submodule-chain-getNodeVersion) | Get the version of LemoChain node | ✓ | ✓
[lemo.getSdkVersion()](#submodule-chain-getSdkVersion) | Get the version of lemo-core-sdk | ✖ | ✓
[lemo.watchBlock(withBody, callback)](#submodule-chain-watchBlock) | Listen for new block | ✖ | ✓
[lemo.stopWatchBlock(subscribeId)](#submodule-chain-stopWatchBlock) | Stop listening block | ✖ | ✓
[lemo.net.connect(nodeAddr)](#submodule-net-connect) | Connect to a LemoChain node | ✓ | ✖
[lemo.net.disconnect(nodeAddr)](#submodule-net-disconnect) | Disconnect to a LemoChain node | ✓ | ✖
[lemo.net.getConnections()](#submodule-net-getConnections) | Get the information of connections | ✓ | ✖
[lemo.net.getConnectionsCount()](#submodule-net-getConnectionsCount) | Get the count of connections | ✓ | ✓
[lemo.net.getInfo()](#submodule-net-getInfo) | Get current node information | ✓ | ✓
[lemo.mine.start()](#submodule-mine-start) | Start mining | ✓ | ✖
[lemo.mine.stop()](#submodule-mine-stop) | Stop mining | ✓ | ✖
[lemo.mine.getMining()](#submodule-mine-getMining) | True if current LemoChain node is mining | ✓ | ✓
[lemo.mine.getMiner()](#submodule-mine-getMiner) | Get the mining benefit account address of current LemoChain node | ✓ | ✓
[lemo.account.newKeyPair()](#submodule-account-newKeyPair) | Create a private key and account address | ✓ | ✓
[lemo.account.getBalance(addr)](#submodule-account-getBalance) | Get the balance of an account | ✓ | ✓
[lemo.account.getAccount(addr)](#submodule-account-getAccount) | Get the information of an account | ✓ | ✓
[lemo.account.getCandidateInfo(addr)](#submodule-account-getCandidateInfo) | Get the information of an candidate | ✓ | ✓
[lemo.account.getAllAssets(address, index, limit)](#submodule-account-getAllAssets) | Obtain all asset equities held in the specified account | ✓ | ✓
[lemo.account.createTempAddress(from, userId)](#submodule-account-createTempAddress) | create a temp address | ✖ | ✓
[lemo.account.isTempAddress(address)](#submodule-account-isTempAddress) | True if the current address is a temporary account | ✖ | ✓
[lemo.account.isContractAddress(address)](#submodule-account-isContractAddress) | True if the current address is a contract account | ✖ | ✓
[lemo.tx.send(signedTxInfo, privateKey)](#submodule-tx-send) | Send transaction | ✓ | ✓
[lemo.tx.waitConfirm(txHash)](#submodule-tx-waitConfirm)                           |  wait for the transaction to be confirmed               | ✓    | ✓ 
[lemo.tx.watchTx(filterTxConfig, callback)](#submodule-tx-watchTx) | listen and filter for transaction of block | ✖ | ✓ |
[lemo.tx.stopWatchTx(subscribeId)](#submodule-tx-stopWatchTx) | Stop listening transaction | ✖ | ✓ |
[lemo.stopWatch()](#submodule-global-stopWatch) | Stop listening | ✖ | ✓
[lemo.isWatching()](#submodule-global-isWatching) | True if is listening | ✖ | ✓

| Class Properties | description |
| --- | --- |
| [LemoCore.SDK_VERSION](#submodule-tool-SDK_VERSION) | The version of js SDK |
| [LemoCore.TxType](#submodule-tool-TxType) | Enum of transaction type |
| [LemoCore.BigNumber](https://github.com/MikeMcl/bignumber.) | The BigNumber library

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
  "type": "1",
  "chainID": "1",
  "version": "1",
  "from": "Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D",
  "to": "Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY",
  "gasPayer": "",
  "toName": "",
  "amount": "100",
  "data": "0x",
  "expirationTime": 1541566996,
  "gasLimit": 2000000,
  "gasPrice": "3000000000",
  "hash": "0x6d3062a9f5d4400b2002b436bc69485449891c83e23bf9e27229234da5b25dcf",
  "message": "",
  "sigs": ["0xd9a9f9f41ea020185a6480fe6938d776f0a675d89057c071fc890e09742a4dd96edb9d48c9978c2f12fbde0d0445f2ff5f08a448b91469511c663567d0b015f601"],
  "gasPayerSigs": ["0x800be6a0cf31ab9e86d547fb8cf964339276233a2b260ad8a4b4c93b39a48d6b1761e125f601bc6953e30eaad3e698c12add332a5740f1618915c12432dc610601"]
}
```
- `type` The type of transaction
- `chainID` The LemoChain id
- `version` Current transaction version, Between 0 and 128
- `from` Sender address.
- `to` Recipient address
- `gasPayer` Account address of gas reimbursement agent
- `toName` (optional) Recipient name. It will be checked with `to` for safe. The max limit of length is 100.
- `amount` Amount in `mo`. It is a `BigNumber` object. 1`LEMO`=1000000000000000000`mo`=1e18`mo`
- `data` (optional) The extra data. It usually using for calling smart contract. It depends on `type` that how to using this field
- `expirationTime` The expiration time of transaction in seconds. If a transaction's expiration time is more than half hour from now, it may not be packaged in block. It depends on the transactions picking logic from miner
- `gasLimit` Max gas limit of transaction. The transaction will be fail if it cost more gas than gasLimit. And the gas will not be refunded
- `gasPrice` Price of every gas in `mo`. It is a `BigNumber` object. The more gas price the more priority
- `hash` Transaction hash
- `message` (optional) Extra text message from sender. The max limit of length is 1024.
- `sigs` Transaction signature array, each field length is 65 bytes
- `gasPayerSigs` An array of paid gas transaction signature data, each field length is 65 bytes

<a name="data-transaction-type"></a>

transaction type | number value | description
---|---|---
lemo.TxType.ORDINARY | 0 | Normal transaction or smart contract execution transaction
lemo.TxType.CREATE_CONTRACT | 1 | Create contract
lemo.TxType.VOTE | 2 | Set vote target
lemo.TxType.CANDIDATE | 3 | Register or modify candidate information
lemo.TxType.CREATE_ASSET | 4 | Create asset information
lemo.TxType.ISSUE_ASSET | 5 | Issue asset
lemo.TxType.REPLENISH_ASSET | 6 | Replenish asset transaction
lemo.TxType.MODIFY_ASSET | 7 | Modify asset transaction
lemo.TxType.TRANSFER_ASSET | 8 | Transfer assets
lemo.TxType.MODIFY_SIGNER | 9 | Modify account signers
lemo.TxType.BOX_TX | 10 | Package multiple transactions and run them transactional

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
    "version": 1
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
VoteForLog | The change of vote target address in account | new vote target address | -
VotesLog | The change of received votes count in candidate account | new votes count | -
CandidateProfileLog | The change of candidate profile in account | candidate profile map | -
TxCountLog | The change of number of transactions which send from the account | Number of transactions | -
SignersLog | The change of singers address and weight of the account | signers profile map | -

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
    "minerAddress": "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG",
    "nodeID": "0x5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0",
    "host": "127.0.0.1",
    "port": "7001",
    "votes": "50000"
}
```
- `minerAddress` The account address to receive mining benefit
- `nodeID` The LemoChain node ID, it is from the public key whose private key is using for sign blocks. The length should be 130 characters with `0x`
- `host` Deputy node IP address or domain. The max limit of length is 128.
- `port` The port to connect other nodes
- `votes` The votes count

<a name="data-structure-account"></a>
#### account
Account information
```json
{
    "address": "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG",
    "assetCodeRoot": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "assetIdRoot": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "balance": "1599999999999999999999999900",
    "records": {
        "BalanceLog": {
            "version": 3,
            "height": 1
        }
    },
    "codeHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "equityRoot": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "root": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "txCount": 0,
    "voteFor": "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG",
    "candidate": {
        "votes": "1599999000",
        "profile": {
            "host": "www.lemochain.com",
            "isCandidate": "true",
            "minerAddress": "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG",
            "nodeID": "0x5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0",
            "port": "7001"
        }
    },
    "signers": [{"address": "Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY","weight": "60"}, {"address": "Lemo842BJZ4DKCC764C63Y6A943775JH6NQ3Z33Y", "weight":  "50"}]
}
```
- `address` Account address
- `assetCodeRoot` The hash of created assets MPT root
- `assetIdRoot` The hash of issued assets MPT root
- `balance` Account balance. It is a modified `BigNumber` object. It has a method `toMoney()` to output formatted balance
- `records` Modification record object of account. The key is type of [ChangeLog](data-structure-changeLog), value is the newest `ChangeLog`'s version and height of the block which contains this newest `ChangeLog`
- `codeHash` Hash of contract code
- `equityRoot` The hash of asset equities MPT root
- `root` The hash of contract storage MPT root
- `txCount` Transactions count from or to this account
- `voteFor` Vote target address of this account
- `candidate` If this account is a consensus candidate, then this property exist
    - `votes` Received votes count for a candidate account
    - `profile` Candidate account profile
        - `host` Ip or domain of the candidate node server
        - `isCandidate` This account is or isn't a candidate. It is used to cancel candidate
        - `minerAddress` The address of miner account who receive miner benefit
        - `nodeID` The LemoChain node ID, it is from the public key whose private key is using for sign blocks. The length should be 130 characters with `0x`
        - `port` Port of the candidate node server
- `signers` The signers for a multi-sign account. It is necessary to collect over 100 weight to sign a transaction
    - `address` The signer's account address
    - `weight` Weight for the signer

---

### Constructor
```
lemo = new LemoCore({
    chainID: 1, 
    host: 'http://127.0.0.1:8001'
})
```
- `chainID` The ID of LemoChain. Default value is `1`, it represents main net
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

<a name="submodule-chain-getNewestBlock"></a>
#### lemo.getNewestBlock
```
lemo.getNewestBlock([withBody])
```
Get the newest block

##### Parameters
1. `boolean` - (optional) Enable to get block body such as transactions. Default value is `false`

##### Returns
`Promise` - Call `then` method to get [block](#data-structure-block) object

##### Example
```js
lemo.getNewestBlock(true).then(function(block) {
    console.log(block.header.miner); // "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG"
})
```

---

<a name="submodule-chain-getNewestUnstableBlock"></a>
#### lemo.getNewestUnstableBlock
```
lemo.getNewestUnstableBlock()
```
Get the newest unstable block which may not has enough confirms by deputy nodes

##### Parameters
None

##### Returns
`Promise` - Call `then` method to get [block](#data-structure-block) object with body

##### Example
```js
lemo.getNewestUnstableBlock().then(function(block) {
    console.log(block.header.miner); // "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG"
})
```

---

<a name="submodule-chain-getNewestHeight"></a>
#### lemo.getNewestHeight
```
lemo.getNewestHeight()
```
Get the newest block height

##### Parameters
None

##### Returns
`Promise` - Call `then` method to get height string

##### Example
```js
lemo.getNewestHeight().then(function(height) {
    console.log(height); // "100"
})
```

---

<a name="submodule-chain-getNewestUnstableHeight"></a>
#### lemo.getNewestUnstableHeight
```
lemo.getNewestUnstableHeight()
```
Get the newest unstable block height

##### Parameters
None

##### Returns
`Promise` - Call `then` method to get height string

##### Example
```js
lemo.getNewestUnstableHeight().then(function(height) {
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
lemo.getGenesis().then(function(block) {
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

<a name="submodule-chain-getCandidateTop30"></a>
#### lemo.getCandidateTop30
```
lemo.getCandidateTop30()
```
Get top 30 candidates information

##### Parameters
None

##### Returns
`Promise` - Call `then` method to get a candidate information list. The item in list is very similar with `candidate` in [account](#data-structure-account). There is an account `address` field in every candidate item  

##### Example
```js
lemo.getCandidateTop30().then(function(candidateList) {
    console.log(candidateList.length) // 1
    console.log(candidateList[0].address) // Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG
    console.log(JSON.stringify(candidateList)) // [{"address":"Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG","profile":{"host":"127.0.0.1","isCandidate":true,"minerAddress":"Lemobw","nodeID":"0x5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0","port":7001},"votes":"1599999000"}]
})
```

---

<a name="submodule-chain-getDeputyNodeList"></a>
#### lemo.getDeputyNodeList
```
lemo.getDeputyNodeList()
```
Get information of current deputy nodes

##### Parameters
None

##### Returns
`Promise` - Call `then` method to get the address list of current deputy nodes. The address can be used to [connect](#submodule-net-connect) LemoChain node.  
    `minerAddress` - (string)The address of miner account who receive miner benefit
    `incomeAddress` - (string)Nodal incomeAddress
    `nodeID` - (string)The LemoChain node ID, it is from the public key whose private key is using for sign blocks. The length should be 130 characters with `0x`
    `rank` - (string)The rank of the outgoing node
    `votes` - (string)Node votes
    `host` - (string)The LemoChain node ID, it is from the public key whose private key is using for sign blocks. The length should be 130 characters with `0x`
    `port` - (string)Port of the candidate node server
    `depositAmount` - (string)deposit amount
    `introduction` - (string)Introduction of node
    `p2pUri` - (string)Connection uri of a LemoChain node

##### Example
```js
lemo.getDeputyNodeList().then(function(nodeList) {
    console.log(nodeList.length) // 1
    console.log(JSON.stringify(nodeList[0]))
// "{"minerAddress":"Lemo83DZ5J99JSK5ZH89TCW7T6ZZCWJ8H7FDGA7W","incomeAddress":"Lemo83DZ5J99JSK5ZH89TCW7T6ZZCWJ8H7FDGA7W","nodeID":"0x0e7dcd418dbe7717eb0e83162f8810a3c7725e0d386b324dc5f3ef5a27a2a83e393a193f6ab53d3a51b490adeee362357676f50eed3d188824ef1fb3af02b2d0","rank":"0","votes":"50000","host":"127.0.0.1","port":"8080","depositAmount":"5000000000000000000000000","introduction":"ddf","p2pUri":"0e7dcd418dbe7717eb0e83162f8810a3c7725e0d386b324dc5f3ef5a27a2a83e393a193f6ab53d3a51b490adeee362357676f50eed3d188824ef1fb3af02b2d0@127.0.0.1:8080"}"
    lemo.net.connect(nodeList[0].p2pUri)
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

<a name="submodule-chain-stopWatchBlock"></a>
#### lemo.stopWatchBlock 
```
lemo.stopWatchBlock(subscribeId) 
```
Stop watching and filtering transactions of block

##### Parameters
1. `number` - Get the subscribeId, it is used to stop watching

##### Returns
None

##### Example
```js
const watchBlockId = lemo.watchBlock(false, function(newBlock) {
    console.log(newBlock)
})
lemo.stopWatchBlock(watchBlockId)
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
    //   nodeID: "0xddb5fc36c415799e4c0cf7046ddde04aad6de8395d777db4f46ebdf258e55ee1d698fdd6f81a950f00b78bb0ea562e4f7de38cb0adf475c5026bb885ce74afb0",
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
const result = lemo.account.newKeyPair()
console.log(result.private) // "0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52"
console.log(result.address) // "Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34"
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
lemo.account.getAccount('Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34')
    .then(function(account) {
        console.log(account.balance.toMoney()); // "1600000000 LEMO"
    })
```

---

<a name="submodule-account-getCandidateInfo"></a>
#### lemo.account.getCandidateInfo
```
lemo.account.getCandidateInfo(address)
```
Get the information of an candidate

##### Parameters
1. `string` - candidate account address

##### Returns
`Promise` - Call `then` method to get candidate information. It is same with `candidate` in [account](#data-structure-account)

##### Example
```js
lemo.account.getCandidateInfo('Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34')
    .then(function(candidate) {
        console.log(candidate.votes); // "1599999000"
    })
```

---

<a name="submodule-account-createTempAddress"></a>
#### lemo.account.createTempAddress
```
lemo.account.createTempAddress(from, userId)
```
create a temp account

##### Parameters
1. `string` - account address
2. `string` - customized user id, which's length should be 10 bytes in hexadecimal at most

##### Returns
`string` - Temporary account address

##### Example
```js
const userId = '1110000000000000000'
const result = lemo.account.createTempAddress('Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', userId)
console.log(result) // Lemo85SY56SGRTQQ63A2Y43KYA8C7QAZB37P3KY5
```

---

<a name="submodule-account-isTempAddress"></a>
#### lemo.account.isTempAddress
```
lemo.account.isTempAddress(address)
```
True if the specific address is a temporary account

##### Parameters
1. `string` - Asset ID

##### Returns
`boolean` - True if the current address is a temporary account

##### Example
```js
const result = lemo.account.isTempAddress('Lemo85SY56SGRTQQ63A2Y43KYA8C7QAZB37P3KY5')
console.log(result) // true
```

---

<a name="submodule-account-isContractAddress"></a>
#### lemo.account.isContractAddress
```
lemo.account.isContractAddress(address)
```
Verify that the account is temporary

##### Parameters
1. `string` - Asset ID

##### Returns
`boolean` - True if the current address is a contract account

##### Example
```js
const result = lemo.account.isContractAddress('Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D')
console.log(result) // false
```

---

### tx API

---

<a name="submodule-tx-send"></a>
#### lemo.tx.send
```
lemo.tx.send(txConfig, privateKey)
```
Send a transaction

##### Parameters
1. `object|string` - Unsinged [transaction](#data-structure-transaction) information. Or a [LemoTx](https://github.com/LemoFoundationLtd/lemo-tx) object or json string.  
2. `string` - (optional) Account private key, it will be used to sign if exist  

##### Returns
`Promise` - Call `then` method to get transaction hash

##### Example
```js
const txInfo = {from: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG', to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34', amount: 100}
lemo.tx.send(txInfo, '0xc21b6b2fbf230f665b936194d14da67187732bf9d28768aef1a3cbb26608f8aa').then(function(txHash) {
    console.log(txHash) // 0x03fea27a8d140574dc648e1cb1a198f5ade450a347095cff7f3d961a11dac505
})
```
```js
const tx = new LemoTx({chainID: 100, from: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG', to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34', amount: 100})
tx.signWith('0xc21b6b2fbf230f665b936194d14da67187732bf9d28768aef1a3cbb26608f8aa')
lemo.tx.send(tx).then(function(txHash) {
    console.log(txHash) // 0x03fea27a8d140574dc648e1cb1a198f5ade450a347095cff7f3d961a11dac505
})
```

---

<a name="submodule-tx-waitConfirm"></a>

#### lemo.tx.waitConfirm

```
lemo.tx.waitConfirm(txHash)
```

wait for the transaction to be confirmed

##### Parameters

1. `string` - transaction hash

##### Returns

`Promise` - Call `then` method to get transaction hash

##### Example

```js
lemo.tx.waitConfirm(0xe71cd6d98b1e48ddccf36ed655700478971a8514abf7c4d2173512201222c6c0).then(function(result) {
  console.log(JSON.stringify(result))
  // {"blockHash":"0x425f4ca99da879aa97bd6feaef0d491096ff3437934a139f423fecf06f9fd5ab","height":"100","time":"1541649535","tx":{"chainID":200,"version":"1","type":"0","to":"Lemo846Q4NQCKJ2YWY6GHTSQHC7K24JDC7CPCWYH","toName":"aa","gasPrice":"2","gasLimit":"100","amount":"1","data":"0x0c","expirationTime":"1544584596","message":"aaa","from":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","sigs":["0x8c0499083cb3d27bead4f21994aeebf8e75fa11df6bfe01c71cad583fc9a3c70778a437607d072540719a866adb630001fabbfb6b032d1a8dfbffac7daed8f0201"]}}
})
```
---

<a name="submodule-tx-watchTx"></a>
#### lemo.tx.watchTx
```
lemo.tx.watchTx(filterTxConfig, callback)
```
Listen for transactions of block. Returns an array with transactions from block body, and the value of the subscribeId

##### Parameters
1. `object` - This is the condition used to filter the transactions, can enter multiple attributes
2. `function` - Used to receive transaction list

##### Returns
`Promise` - Returns the value of the subscribeId, it is used to stop watching

##### Example
```js
lemo.tx.watchTx({to:'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY'}, function(transaction) {
    console.log(transaction[0].version)
}); //"1"

lemo.tx.watchTx({to:'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY', from:'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}, function(transactions) {
    console.log(transactions[0].version)
}); //"1"
```

---

<a name="submodule-tx-stopWatchTx"></a>
#### lemo.tx.stopWatchTx
```
lemo.tx.stopWatchTx(subscribeId)
```
Stop watching and filtering transactions of block

##### Parameters
1. `number` - Get the subscribeId, it is used to stop watching

##### Returns
None

##### Example
```js
const watchTxId = lemo.tx.watchTx({to:'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY'}, function(transaction) {
    console.log(transaction[0].version)
}); 
lemo.tx.stopWatchTx(watchTxId)
```

---

<a name="submodule-global-stopWatch"></a>
#### lemo.stopWatch
```
lemo.stopWatch()
```
Stop listening

##### Parameters
None

##### Returns
None

##### Example
```js
lemo.stopWatch()
```

---

<a name="submodule-global-isWatching"></a>
#### lemo.isWatching
```
lemo.isWatching()
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

### Class Properties

<a name="submodule-tool-SDK_VERSION"></a>

#### LemoCore.SDK_VERSION

```
LemoCore.SDK_VERSION
```

`string` - The version of SDK

##### Example

```js
console.log(LemoCore.SDK_VERSION) // "1.0.0"
```

---

<a name="submodule-tool-TxType"></a>

#### LemoCore.TxType

```
LemoCore.TxType
```

Enum of [transaction type](#data-transaction-type), the value is `number` type

##### Example

```js
console.log(LemoCore.TxType.VOTE) // 1
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

### Testing

```bash
yarn test
```

## Licensing

LGPL-3.0
