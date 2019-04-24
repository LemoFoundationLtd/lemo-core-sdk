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

API | description | asynchronous | available for remote
---|---|---|---
[lemo.getBlock(heightOrHash, withBody)](#submodule-chain-getBlock) | Get block by height or block hash | ✓ | ✓
[lemo.getNewestBlock(withBody)](#submodule-chain-getNewestBlock) | Get the newest block | ✓ | ✓
[lemo.getNewestUnstableBlock()](#submodule-chain-getNewestUnstableBlock) | Get the newest unstable block | ✓ | ✖
[lemo.getNewestHeight()](#submodule-chain-getNewestHeight) | Get the newest block height | ✓ | ✓
[lemo.getNewestUnstableHeight()](#submodule-chain-getNewestUnstableHeight) | Get the newest unstable block height | ✓ | ✖
[lemo.getGenesis()](#submodule-chain-getGenesis) | Get the first block | ✓ | ✓
[lemo.getChainID()](#submodule-chain-getChainID) | Get the chain ID | ✓ | ✓
[lemo.getGasPriceAdvice()](#submodule-chain-getGasPriceAdvice) | Get transaction gas price advice | ✓ | ✓
[lemo.getCandidateList()](#submodule-chain-getCandidateList) | Get paged candidates information | ✓ | ✓
[lemo.getCandidateTop30()](#submodule-chain-getCandidateTop30) | Get top 30 candidates information | ✓ | ✓
[lemo.getDeputyNodeList()](#submodule-chain-getDeputyNodeList) | Get the address list of current deputy nodes | ✓ | ✓
[lemo.getNodeVersion()](#submodule-chain-getNodeVersion) | Get the version of LemoChain node | ✓ | ✓
[lemo.getSdkVersion()](#submodule-chain-getSdkVersion) | Get the version of lemo-client | ✖ | ✓
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
[lemo.account.getAssetInfo(assetCode)](#submodule-account-getAssetInfo) | Obtain release information for the specified asset type | ✓ | ✓
[lemo.account.getAssetMetaData(assetId)](#submodule-account-getAssetMetaData) | Obtain custom data saved in the specified asset | ✓ | ✓
[lemo.tx.getTx(txHash)](#submodule-tx-getTx) | Get transaction by the its hash | ✓    | ✓
[lemo.tx.getTxListByAddress(address, index, limit)](#submodule-tx-getTxListByAddress)  | Get paged transactions by account address | ✓ | ✓
[lemo.tx.sendTx(privateKey, txInfo)](#submodule-tx-sendTx) | Sign and send transaction | ✓ | ✓
[lemo.tx.sign(privateKey, txInfo)](#submodule-tx-sign) | Sign transaction | ✖ | ✓
[lemo.tx.signVote(privateKey, txInfo)](#submodule-tx-signVote) | Sign a special transaction for vote | ✖ | ✓ 
[lemo.tx.signCandidate(privateKey, txInfo, candidateInfo)](#submodule-tx-signCandidate) | Sign a special transaction for register/edit candidate | ✖ | ✓ 
[lemo.tx.signCreateAsset(privateKey, txConfig, createAssetInfo)](#submodule-tx-signCreateAsset) | Sign a special transaction for create candidate | ✖ | ✓ 
[lemo.tx.signIssueAsset(privateKey, txConfig, issueAssetInfo)](#submodule-tx-signIssueAsset) | Sign a special transaction for the issuance of asset | ✖ | ✓ 
[lemo.tx.signReplenishAsset(privateKey, txConfig, replenishInfo)](#submodule-tx-signReplenishAsset) | Sign a special transaction for replenish asset | ✖ | ✓ 
[lemo.tx.signModifyAsset(privateKey, txConfig, modifyInfo)](#submodule-tx-signModifyAsset) | Sign a special transaction for modify asset | ✖ | ✓ 
[lemo.tx.signTransferAsset(privateKey, txConfig, transferAssetInfo)](#submodule-tx-signTransferAsset) | Sign a special transaction for transfer asset | ✖ | ✓ 
[lemo.tx.signNoGas(privateKey, txConfig, payer)](#submodule-tx-signNoGas) | Sign a special transaction for free gas | ✖ | ✓ 
[lemo.tx.signReimbursement(privateKey, noGasTxStr, gasPrice, gasLimit)](#submodule-tx-signReimbursement) | Sign a special transaction for gas reimbursement | ✖ | ✓ 
[lemo.tx.send(signedTxInfo)](#submodule-tx-send) | Send a signed transaction | ✓ | ✓
[lemo.tx.watchTx(filterTxConfig, callback)](#submodule-tx-watchTx) | listen and filter for transaction of block | ✖ | ✓ |
[lemo.tx.stopWatchTx(subscribeId)](#submodule-tx-stopWatchTx) | Stop listening transaction | ✖ | ✓ |
[lemo.tx.watchPendingTx(callback)](#submodule-tx-watchPendingTx) | Listening for new transactions | ✖ | ✖
[lemo.stopWatch()](#submodule-global-stopWatch) | Stop listening | ✖ | ✓
[lemo.isWatching()](#submodule-global-isWatching) | True if is listening | ✖ | ✓
[lemo.tool.verifyAddress(addr)](#submodule-tool-verifyAddress) | Verify a LemoChain address | ✖ | ✓
[lemo.tool.moToLemo(mo)](#submodule-tool-moToLemo) | Convert the unit from mo to LEMO | ✖ | ✓
[lemo.tool.lemoToMo(ether)](#submodule-tool-lemoToMo) | Convert the unit from LEMO to mo | ✖ | ✓

| constant | description |
| --- | --- |
| [lemo.SDK_VERSION](#submodule-global-SDK_VERSION) | The version of js SDK |
| [lemo.TxType](#submodule-global-TxType) | Enum of transaction type |

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
  "expirationTime": 1541566996,
  "gasLimit": 2000000,
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
- `toName` (optional) Recipient name. It will be checked with `to` for safe. The max limit of length is 100.
- `amount` Amount in `mo`. It is a `BigNumber` object. 1`LEMO`=1000000000000000000`mo`=1e18`mo`
- `data` (optional) The extra data. It usually using for calling smart contract. It depends on `type` that how to using this field
- `expirationTime` The expiration time of transaction in seconds. If a transaction's expiration time is more than half hour from now, it may not be packaged in block. It depends on the transactions picking logic from miner
- `gasLimit` Max gas limit of transaction. The transaction will be fail if it cost more gas than gasLimit. And the gas will not be refunded
- `gasPrice` Price of every gas in `mo`. It is a `BigNumber` object. The more gas price the more priority
- `hash` Transaction hash
- `message` (optional) Extra text message from sender. The max limit of length is 1024.
- `r` Signature data
- `s` Signature data
- `v` This field is combined from transaction `type`, `version`(current is 0), `signature recovery data`, `chainID`

<a name="data-transaction-type"></a>
transaction type | number value | description
---|---|---
lemo.TxType.ORDINARY | 0 | Normal transaction or smart contract execution transaction
lemo.TxType.VOTE | 1 | Set vote target
lemo.TxType.CANDIDATE | 2 | Register or modify candidate information

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
    "nodeID": "5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0",
    "host": "127.0.0.1",
    "port": "7001",
    "votes": "50000"
}
```
- `minerAddress` The account address to receive mining benefit
- `nodeID` The LemoChain node ID, it is from the public key whose private key is using for sign blocks. The length should be 128 characters without `0x`
- `host` Deputy node IP address or domain. The max limit of length is 128.
- `port` The port to connect other nodes
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
            "version": 3,
            "height": 1
        }
    },
    "codeHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "root": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "txCount": 0,
    "voteFor": "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG",
    "candidate": {
        "votes": "1599999000",
        "profile": {
            "host": "www.lemochain.com",
            "isCandidate": "true",
            "minerAddress": "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG",
            "nodeID": "5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0",
            "port": "7001"
        }
    }
}
```
- `address` Account address
- `balance` Account balance. It is a modified `BigNumber` object. It has a method `toMoney()` to output formatted balance
- `records` Modification record object of account. The key is type of [ChangeLog](data-structure-changeLog), value is the newest `ChangeLog`'s version and height of the block which contains this newest `ChangeLog`
- `codeHash` Hash of contract code
- `root` The hash of contranct storage MPT root
- `txCount` Transactions count from or to this account
- `voteFor` Vote target address of this account
- `candidate` If this account is a consensus candidate, then this property exist
    - `votes` Received votes count for a candidate account
    - `profile` Candidate account profile
        - `host` Ip or domain of the candidate node server
        - `isCandidate` This account is or isn't a candidate. It is used to cancel candidate
        - `minerAddress` The address of miner account who receive miner benefit
        - `nodeID` The LemoChain node ID, it is from the public key whose private key is using for sign blocks. The length should be 128 characters without `0x`
        - `port` Port of the candidate node server

---

### Constructor
```
lemo = new LemoClient({
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

<a name="submodule-chain-getCandidateList"></a>
#### lemo.getCandidateList
```
lemo.getCandidateList(index, limit)
```
Get paged candidates information

##### Parameters
1. `number` - Index of the first required candidates
2. `number` - Max count of required candidates

##### Returns
`Promise` - Call `then` method to get a `{candidateList:Array, total:number}` object  
    - `candidateList` Candidate information list. It is very similar with `candidate` in [account](#data-structure-account). There is an account `address` field in every candidate item  
    - `total` Candidate's count  

##### Example
```js
lemo.getCandidateList(0, 10).then(function(result) {
    console.log(result.total) // 1
    console.log(result.candidateList[0].address) // Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG
    console.log(JSON.stringify(result.candidateList)) // [{"address":"Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG","profile":{"host":"127.0.0.1","isCandidate":true,"minerAddress":"Lemobw","nodeID":"5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0","port":7001},"votes":"1599999000"}]
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
    console.log(JSON.stringify(candidateList)) // [{"address":"Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG","profile":{"host":"127.0.0.1","isCandidate":true,"minerAddress":"Lemobw","nodeID":"5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0","port":7001},"votes":"1599999000"}]
})
```

---

<a name="submodule-chain-getDeputyNodeList"></a>
#### lemo.getDeputyNodeList
```
lemo.getDeputyNodeList()
```
Get the address list of current deputy nodes

##### Parameters
None

##### Returns
`Promise` - Call `then` method to get the address list of current deputy nodes. The address can be used to [connect](#submodule-net-connect) LemoChain node.  

##### Example
```js
lemo.getDeputyNodeList().then(function(nodeList) {
    console.log(nodeList.length) // 1
    console.log(nodeList[0]) // "5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0@149.28.68.93:7003"
    lemo.net.connect(nodeList[0])
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

<a name="submodule-account-getAllAssets"></a>
#### lemo.account.getAllAssets
```
lemo.account.getAllAssets(address, index, limit)
```
Obtain all asset equities held in the specified account

##### Parameters
1. `string` - Account address
2. `number` - Index of equities
3. `number` - The count of equities required

##### Returns
`Promise` - Call `then` method to get information about all assets.

##### Example
```js
lemo.account.getAllAssets('Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', 0, 10).then(function(result) {
    console.log(result.equities[0].assetId) // '0x34b04e018488f37f449193af2f24feb3b034c994cde95d30e3181403ac76528a'
})
```

---

<a name="submodule-account-getAssetInfo"></a>
#### lemo.account.getAssetInfo
```
lemo.account.getAssetInfo(assetCode)
```
Obtain release information for the specified asset type

##### Parameters
1. `string` - Account type

##### Returns
`Promise` - Call `then` method to get release information about the specified asset type.

##### Example
```js
lemo.account.getAssetInfo('0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884').then(function(result) {
    console.log(result.category) // 1
    console.log(result.profile.suggestedGasLimit) //"60000"
})
```

---

<a name="submodule-account-getAssetMetaData"></a>
#### lemo.account.getAssetMetaData
```
lemo.account.getAssetMetaData(assetId)
```
Obtain custom data saved in the specified asset

##### Parameters
1. `string` - Asset ID

##### Returns
`Promise` - Call `then` method to get custom data saved in the specified asset. There are some new fields in this object:
    - `string` Asset owner address

##### Example
```js
lemo.account.getAssetMetaData('0x34b04e018488f37f449193af2f24feb3b034c994cde95d30e3181403ac76528a').then(function(result) {
    console.log(result.metaDate) // "This is user-defined data"
    console.log(result.owner) //"Lemo8498CBCJSY9G7JF4CGZDP64PRRNGP4HQ2QPF"
})
```

---

### tx API

---

<a name="submodule-tx-getTx"></a>

#### lemo.tx.getTx

```
lemo.tx.getTx(txHash)
```

Get transaction by the its hash

##### Parameters

1. `string` - transaction's hash

##### Returns

`Promise` - Call `then` method to get [transaction](#data-structure-transaction). There are some new fields in this object:  
    - `blockHash` Hash of the block which contains the transaction  
    - `blockHeight` Height of the block which contains the transaction  
    - `minedTime` Mined time seconds of the block which contains the transaction  

##### Example

```js
lemo.tx.getTx('0x94ad0a9869cb6418f6a67df76d1293b557adb567ca3d29bfc8d8ff0d5f4ac2de').then(function(tx) {
    console.log(tx.from) // "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG"
    console.log(tx.to) // "Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY"
    console.log(tx.amount) // "100"
    console.log(tx.gasPrice) // "3000000000"
    console.log(tx.gasLimit) // 2000000
    console.log(tx.expirationTime) // 1541649535
    console.log(tx.message) // ''
    console.log(tx.blockHeight) // 100
    console.log(tx.minedTime) // 1541649535
    console.log(tx.blockHash) // '0x425f4ca99da879aa97bd6feaef0d491096ff3437934a139f423fecf06f9fd5ab'
})
```

---

<a name="submodule-tx-getTxListByAddress"></a>

#### lemo.tx.getTxListByAddress

```
lemo.tx.getTxListByAddress(address, index, limit)
```

Get paged transactions by account address

##### Parameters

1. `string` - Account address
2. `number` - Index of the first required transaction
3. `number` - Max count of required transactions

##### Returns

`Promise` - Call `then` method to get a `{txList:Array, total:number}` object  
    - `txList` [Transaction](#data-structure-transaction) array. There is a `minedTime` field in every item to record the mined time of the block which contains the transaction  
    - `total` Transaction's count in this account  

##### Example

```js
lemo.tx.getTxListByAddress('Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', 0, 10).then(function(result) {
    console.log(result.total) // 1
    console.log(result.txList[0].minedTime) // 1541649535
    console.log(JSON.stringify(result.txList)) // [{"to":"Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY","toName":"","gasPrice":"3000000000","gasLimit":2000000,"amount":"1.0000000000000000000000001e+25","data":"0x","expirationTime":1541649535,"message":"","v":"0x020001","r":"0x1aebf7c6141dc54b3f181e56d287785f2ce501c70466016f96d8b7171d80555c","s":"0x584179c208ad9bc9488b969b9d06635dda05b932b1966d43b6255ca63288903c","from":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","minedTime":1541649535}]
})
```

---

<a name="submodule-tx-sendTx"></a>
#### lemo.tx.sendTx
```
lemo.tx.sendTx(privateKey, txconfig, waitConfirm)
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
3. `boolean` - (optional) Waiting for [transaction](#data-structure-transaction) consensus.default value is `true`

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
3. Call [`lemo.tx.send`](#submodule-tx-send) to send the transaction to LemoChain

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`lemo.tx.sendTx`](#submodule-tx-sendTx)

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information

##### Example
```js
const txInfo = {to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34', amount: 100}
const signedTx = lemo.tx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', txInfo)
console.log(signedTx)
// {"amount":"100","expirationTime":"1535632200","gasLimit":"2000000","gasPrice":"3000000000","r":"0xdefbd406e0aed8a01ac33877a0267ca720e8231b7660d790386ae45686cf8781","s":"0x3de9fea170ec8fba0cd2574878554558616733c45ea03975bb41104bab3bd312","to":"Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34","v":"0x030001"}
```

---

<a name="submodule-tx-signVote"></a>
#### lemo.tx.signVote
```
lemo.tx.signVote(privateKey, txInfo)
```
Sign a transaction for vote and return the signed transaction string  
The API is used like [`lemo.tx.sign`](#submodule-tx-sign). The only difference is filling special data in transaction

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`lemo.tx.sendTx`](#submodule-tx-sendTx). For this API, `to` means vote target. And `amount`, `data` fields will be ignored. 

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information

##### Example
```js
const txInfo = {to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34'}
const signedTxStr = lemo.tx.signVote('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', txInfo)
console.log(signedTxStr)
// {"gasPrice":"3000000000","gasLimit":"2000000","amount":"0","expirationTime":"1548337992","v":"0x010300c8","r":"0xc9230ed3a37b85603cd0ac690994d6f207d0744e9d451f9ff02ae0ef5c83ba21","s":"0x61848625fea8a18c0648d6c0f21407a4c347a5815bc01956842c91aec053fd38","to":"Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34"}
```

---

<a name="submodule-tx-signCandidate"></a>
#### lemo.tx.signCandidate
```
lemo.tx.signCandidate(privateKey, txInfo, candidateInfo)
```
Sign a transaction for register/edit candidate and return the signed transaction string  
The API is used like [`lemo.tx.sign`](#submodule-tx-sign). The only difference is filling special data in transaction

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`lemo.tx.sendTx`](#submodule-tx-sendTx). For this API, `to`, `toName`, `amount`, `data` fields will be ignored. 
3. `object` - Candidate information. It is same with `candidate.profile` in [account](#data-structure-account)

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information

##### Example
```js
const txInfo = {to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34'}
const candidateInfo = {
    isCandidate: true,
    minerAddress: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
    nodeID: '5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
    host: '127.0.0.1',
    port: '7001'
}
const signedTxStr = lemo.tx.signCandidate('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', txInfo, candidateInfo)
console.log(signedTxStr)
// {"gasPrice":"3000000000","gasLimit":"2000000","amount":"0","expirationTime":"1548337908","v":"0x020300c8","r":"0x3a3bfc3c82c3f712b25917d9aa347474f3b1842f05c0d54c84442a7eea7cccde","s":"0x2a9bbf04db371dd11846ee46a0ffeafe6b4955b929fcda9391c3a026a984763b","data":"0x7b22697343616e646964617465223a747275652c226d696e657241646472657373223a224c656d6f3833474e3732475948324e5a3842413732395a39544354374b5135464333435236444a47222c226e6f64654944223a223565333630303735356639623531326136353630336233386533303838356339386362616337303235396333323335633962336634326565353633623438306564656133353162613066663537343861363338666530616566663564383435626633376133623433373833313837316234386664333266333363643961336330222c22686f7374223a223132372e302e302e31222c22706f7274223a2237303031227d"}
```

---

<a name="submodule-tx-signCreateAsset"></a>
#### lemo.tx.signCreateAsset
```
lemo.tx.signCreateAsset(privateKey, txConfig, createAssetInfo)
```
Sign a transaction for create assets and return the signed transaction string  
The API is used like [`lemo.tx.sign`](#submodule-tx-sign). The only difference is filling special data in transaction

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`lemo.tx.sendTx`](#submodule-tx-sendTx). For this API, `to`, `amount`, `toName`fields will be ignored. 
3. `object` - Create of assets information.

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information

##### Example
```js
const txInfo = {to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34'}
const createAssetInfo = {
    category: 1,
    decimals: 18,
    isReplenishable: true,
    isDivisible: true,
    profile: {
        name: 'Demo Asset',
        symbol: 'DT',
        description: 'demo asset',
        suggestedGasLimit: '60000',
    },
}
const signCreateAsset = lemo.tx.signCreateAsset('0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb', txInfo, createAssetInfo)
console.log(signCreateAsset)
// {"type":"3","version":"1","chainID":"200","gasPrice":"3000000000","gasLimit":"2000000","amount":"0","expirationTime":"1544584596","data":"0x7b2263617465676f7279223a312c22646563696d616c73223a31382c2269735265706c656e69736861626c65223a747275652c226973446976697369626c65223a747275652c2270726f66696c65223a7b226e616d65223a2244656d6f204173736574222c2273796d626f6c223a224454222c226465736372697074696f6e223a2264656d6f206173736574222c227375676765737465644761734c696d6974223a223630303030222c2273746f70223a2266616c7365227d7d","sig":"0xf1c837a5621c1e62800099ead94668da3a6a8358187a3251e5e2936dea7205df5eeb75fc4c7737caa8a0b63cf1846f22426696ce96a581188c9fb6fece257fc900"}
```

---

<a name="submodule-tx-signIssueAsset"></a>
#### lemo.tx.signIssueAsset
```
lemo.tx.signIssueAsset(privateKey, txConfig, issueAssetInfo)
```
Sign a transaction for the issuance of assets and return the signed transaction string  
The API is used like [`lemo.tx.sign`](#submodule-tx-sign). The only difference is filling special data in transaction

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`lemo.tx.sendTx`](#submodule-tx-sendTx). For this API, `to`, `toName`, `amount`, `data` fields will be ignored. 
3. `object` - Transfer of assets information. includes `assetCode`, `metaData`, `supplyAmount` field

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information

##### Example
```js
const txInfo = {to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34'}
const issueAssetInfo = {
    assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
    metaData: 'issue asset metaData',
    supplyAmount: '100000',
}
const signIssueAsset = lemo.tx.signIssueAsset('0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb', txInfo, issueAssetInfo)
console.log(signIssueAsset)
// {"type":"4","version":"1","chainID":"200","gasPrice":"3000000000","gasLimit":"2000000","amount":"0","expirationTime":"1544584596","data":"0x7b226173736574436f6465223a22307864306265666433383530633537346237663661643666373934336665313962323132616666623930313632393738616463323139336130333563656438383834222c226d65746144617461223a226973737565206173736574206d65746144617461222c22737570706c79416d6f756e74223a22313030303030227d","sig":"0x4b92594415a58adbade0774753922d7e34ae32f0545f38efa67d5fcbca6821fd0b57ef2ada36ef994fd06426feadabd030130b9e7e30064a4b2bf60c6b5832a400"}
```

---

<a name="submodule-tx-signReplenishAsset"></a>
#### lemo.tx.signReplenishAsset
```
lemo.tx.signReplenishAsset(privateKey, txConfig, replenishInfo)
```
Sign a transaction for replenish assets and return the signed transaction string  
The API is used like [`lemo.tx.sign`](#submodule-tx-sign). The only difference is filling special data in transaction

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`lemo.tx.sendTx`](#submodule-tx-sendTx). For this API, `amount` field will be ignored.
3. `object` - Replenish assets information. includes `assetID`, `replenishAmount` fields

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information

##### Example
```js
const txInfo = {to: 'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY'}
const replenishAssetInfo = {
    assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
    replenishAmount: '100000',
}
const signReplenishAsset = lemo.tx.signReplenishAsset('0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb', txInfo, replenishAssetInfo)
console.log(signReplenishAsset)
// {"type":"5","version":"1","chainID":"200","gasPrice":"3000000000","gasLimit":"2000000","amount":"0","expirationTime":"1555916116","to":"Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY","data":"0x7b2261737365744964223a22307864306265666433383530633537346237663661643666373934336665313962323132616666623930313632393738616463323139336130333563656438383834222c227265706c656e697368416d6f756e74223a22313030303030227d","sig":"0xa9c28cf5efbf2ff91028a719038edfe98c4a2ddb19ae74b5a01f83ac58c25bff4b4a4ce78462be3de8185c6c31355247f47411bf0682fcd63602e38dd3f56f3501"}
```

---

<a name="submodule-tx-signModifyAsset"></a>
#### lemo.tx.signModifyAsset
```
lemo.tx.signModifyAsset(privateKey, txConfig, modifyInfo)
```
Sign a transaction for modify assets and return the signed transaction string  
The API is used like [`lemo.tx.sign`](#submodule-tx-sign). The only difference is filling special data in transaction

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`lemo.tx.sendTx`](#submodule-tx-sendTx).  For this API, `amount`, `to`, `toName` fields will be ignored.
3. `object` - Assets modification information. It contains `assetCode` and `info` fields. The `info` contains the fields you want to modify, such as `name`, `symbol`, `description`, `stop`, `suggestedGasLimit`.

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information

##### Example
```js
const txInfo = {to: 'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY'}
const ModifyAssetInfo = {
    assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
    info: {
        name: 'Demo Asset',
        symbol: 'DT',
        description: 'demo asset',
    },
}
const signModifyAsset = lemo.tx.signModifyAsset('0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb', txInfo, ModifyAssetInfo)
console.log(signModifyAsset)
// {"type":"6","version":"1","chainID":"200","gasPrice":"3000000000","gasLimit":"2000000","amount":"0","expirationTime":"1555916025","data":"0x7b226173736574436f6465223a22307864306265666433383530633537346237663661643666373934336665313962323132616666623930313632393738616463323139336130333563656438383834222c22696e666f223a7b226e616d65223a2244656d6f204173736574222c2273796d626f6c223a224454222c226465736372697074696f6e223a2264656d6f206173736574227d7d","sig":"0xc62aebe4539e9bfd7bbd2c87255426863986922431896883dee80bac0546fc926683f365c20e8a8812e382f1755318194aa32bf5bdd39bc21aba83a9a095208800"}
```

---

<a name="submodule-tx-signTransferAsset"></a>
#### lemo.tx.signTransferAsset
```
lemo.tx.signTransferAsset(privateKey, txConfig, transferAssetInfo)
```
Sign a transaction for transaction assets and return the signed transaction string  
The API is used like [`lemo.tx.sign`](#submodule-tx-sign). The only difference is filling special data in transaction

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`lemo.tx.sendTx`](#submodule-tx-sendTx).
3. `object` - Transaction assets information. includes `assetID` field

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information

##### Example
```js
const txInfo = {to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34'}
const transferAsset = {
    assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
}
const signTransferAsset = lemo.tx.signTransferAsset('0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb', txInfo, transferAsset)
console.log(signTransferAsset)
// {"type":"7","version":"1","chainID":"200","gasPrice":"3000000000","gasLimit":"2000000","amount":"0","expirationTime":"1544584596","data":"0x7b2261737365744964223a22307864306265666433383530633537346237663661643666373934336665313962323132616666623930313632393738616463323139336130333563656438383834227d","sig":"0x1555aa9541db00b02bc0d0632052b3a5533031315d200369cd9001965abec98e231a53ca5b89d82e88f5d2fd76e11f10bfed759f0d5cbca06527100e580bf1a801"}
```

---

<a name="submodule-tx-signNoGas"></a>
#### lemo.tx.signNoGas
```
lemo.tx.signNoGas(privateKey, txConfig, payer)
```
Sign a transaction for gas free transaction and return the signed transaction string  
1. Sign a gas free transaction with transaction information and `payer` account address. The transaction information is exclude `gasLimit` and `gasPrice` field
2. Send the output string to gas payer
3. The payer sign the string with his private key, fill `gasLimit` and `gasPrice` field. Then return a final transaction string
4. Call [`lemo.tx.send`](#submodule-tx-send) to send the transaction string to LemoChain

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`lemo.tx.sendTx`](#submodule-tx-sendTx). For this API, `gasLimit`, `gasPrice` fields will be ignored.
3. `string` - The address of gas payer account.

##### Returns
`string` - The string for [`lemo.tx.signReimbursement`](#submodule-tx-signReimbursement)

##### Example
```js
const txInfo = {to: 'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY'}
const payer = 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'
const noGasInfo = lemo.tx.signNoGas('0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb', txInfo, payer)
console.log(noGasInfo)
// {"type":0,"version":1,"chainID":200,"to":"Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY","toName":"","gasPrice":3000000000,"gasLimit":2000000,"amount":0,"data":"","expirationTime":1555915830,"message":"","sig":"0x5d2d0564b2f7bdecb62e405160bbb4f56a365108335fc21553624a7db1f9ff211cc86a911a185e8c5e690155237750ece4c710adfd69294309a38f9f43f658c900","gasPayerSig":"","from":"Lemo83RZBGSQH7ZYS9SY32H37KAN3R3N2DBJP4R6","payer":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D"}
```

---

<a name="submodule-tx-signReimbursement"></a>
#### lemo.tx.signReimbursement
```
lemo.tx.signReimbursement(privateKey, noGasTxStr, gasPrice, gasLimit)
```
Sign a gas reimbursement transaction for paying gas to a free gas transaction, then return the signed transaction string  
See [`lemo.tx.signNoGas`](#submodule-tx-signNoGas)

##### Parameters
1. `string` - Account private key
2. `string` - The string returned by the [`lemo.tx.signNoGas`](#submodule-tx-signNoGas) method
3. `string` - Price of every gas in `mo`.
4. `string` - Max gas limit of transaction.

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information

##### Example
```js
const txInfo = {to: 'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY'}
const payer = 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'
const noGasInfo = lemo.tx.signNoGas('0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb', txInfo, payer)
const result = lemo.tx.signReimbursement('0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb', noGasInfo, 2, 100)
console.log(result)
// {"type":"0","version":"1","chainID":"200","gasPrice":"2","gasLimit":"100","amount":"0","expirationTime":"1555915737","to":"Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY","sig":"0xaaf375a16de05e64c977e1a234661ec113fafc9c9d227ccd570ccfa232a72f93659f267c7e47bb51059eda5045f2f46c509dbd933181a85197a121dc26e2d03f01","gasPayerSig":"0x0edb211e684bfda13969aa9115c292a485bdb43061b54148b140b97cd0322b3d7d973004d8caf0c4de3975d0d553baa6d0d7d41a6ce0d14c0b754cecb4b020a900"}
```

---

<a name="submodule-tx-send"></a>
#### lemo.tx.send
```
lemo.tx.send(txConfig, waitConfirm)
```
Send a signed transaction

##### Parameters
1. `object|string` - Signed [transaction](#data-structure-transaction) information. It could be a string which returned by [`lemo.tx.sign`](#submodule-tx-sign), as well as an object like the same parameter in [`lemo.tx.sendTx`](#submodule-tx-sendTx), but these fields instead of `type`, `version`:
    - `r` - (Buffer|string) Signature data
    - `s` - (Buffer|string) Signature data
    - `v` - (Buffer|string) This field is combined from transaction `type`, `version`(current is 0), `signature recovery data`, `chainID`
2. `boolean` - (optional) Waiting for [transaction](#data-structure-transaction) consensus.default value is `true`

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

<a name="submodule-global-SDK_VERSION"></a>

#### lemo.SDK_VERSION

```
lemo.SDK_VERSION
```

`string` - The version of SDK

##### Example

```js
console.log(lemo.SDK_VERSION) // "1.0.0"
```

---

<a name="submodule-global-TxType"></a>

#### lemo.TxType

```
lemo.TxType
```

Enum of [transaction type](#data-transaction-type), the value is `number` type

##### Example

```js
console.log(lemo.TxType.VOTE) // 1
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

<a name="submodule-tool-moToLemo"></a>
#### lemo.tool.moToLemo
```
lemo.tool.moToLemo(mo)
```
Convert the unit from mo to LEMO

##### Parameters
1. `string|number` - mo

##### Returns
`bigNumber` - It returns an object of type bigNumber. If input an illegal string or number, it will throw an exception.

##### Example
```js
const result = lemo.tool.moToLemo('0.1')
console.log(result.toString(10));// '0.0000000000000000001'
const errorMsg = lemo.tool.moToLemo('-0.1')
console.log(errorMsg);// Error: The value entered is in the wrong format
```

---

<a name="submodule-tool-lemoToMo"></a>
#### lemo.tool.lemoToMo
```
lemo.tool.lemoToMo(ether)
```
Convert the unit from LEMO to mo

##### Parameters
1. `string|number` - LEMO

##### Returns
`bigNumber` - It returns an object of type bigNumber. If input an illegal string or number, it will throw an exception.

##### Example
```js
const result = lemo.tool.lemoToMo('0.1')
console.log(result.toString(10)) // '100000000000000000'
const errorMsg = lemo.tool.lemoToMo('-0.1')
console.log(errorMsg);// Error: The value entered is in the wrong format
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
