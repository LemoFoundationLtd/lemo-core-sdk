![Logo of the project](./logo.png)

# LemoChain JavaScript SDK
[![npm](https://img.shields.io/npm/v/lemo-client.svg?style=flat-square)](https://www.npmjs.com/package/lemo-client)
[![Build Status](https://img.shields.io/travis/lemo-client/lemo-client.svg?style=flat-square)](https://travis-ci.org/lemo-client/lemo-client)
[![code coverage](https://img.shields.io/coveralls/LemoFoundationLtd/lemo-client.svg?style=flat-square)](https://coveralls.io/r/LemoFoundationLtd/lemo-client)
[![install size](https://packagephobia.now.sh/badge?p=lemo-client)](https://packagephobia.now.sh/result?p=lemo-client)
[![gitter chat](https://img.shields.io/gitter/room/LemoFoundationLtd/lemo-client.svg?style=flat-square)](https://gitter.im/LemoFoundationLtd/lemo-client)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![GitHub license](https://img.shields.io/badge/license-LGPL3.0-blue.svg?style=flat-square)](https://github.com/LemoFoundationLtd/lemo-client/blob/master/LICENSE)

通过 JSON RPC 协议访问LemoChain上的数据


> 需要先在本地通过`--rpc`参数启动一个[LemoChain节点](https://github.com/LemoFoundationLtd/lemochain-go)，或远程连接到一个已存在的LemoChain节点，才能运行本项目

[中文版](https://github.com/LemoFoundationLtd/lemo-client/blob/master/README_zh.md)  
[English](https://github.com/LemoFoundationLtd/lemo-client/blob/master/README.md)

## 安装

### 使用Yarn

```bash
yarn add lemo-client
```

### 在浏览器中引入

* 在html中引入 `lemo-client.min.js` 文件
* 通过全局变量 `LemoClient` 使用SDK

## 示例

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
> 大多数接口都返回Promise对象, 除了 `watchXXX`、`stopWatch` 等  
> 所有接口都可在LemoChain节点的控制台中使用，但通过远程连接（如http、websocket）到节点时，只能使用部分接口

API | 功能 | 可远程使用
---|---|---
[lemo.getBlock(heightOrHash, withBody)](#submodule-chain-getBlock) | 根据高度或hash获取区块 | ✓
[lemo.getCurrentBlock(stable, withBody)](#submodule-chain-getCurrentBlock) | 获取最新的块 | ✓
[lemo.getCurrentHeight(stable)](#submodule-chain-getCurrentHeight) | 获取当前高度 | ✓
[lemo.getGenesis()](#submodule-chain-getGenesis) | 获取创世区块 | ✓
[lemo.getChainID()](#submodule-chain-getChainID) | 获取当前链ID | ✓
[lemo.getGasPriceAdvice()](#submodule-chain-getGasPriceAdvice) | 获取建议gas价格 | ✓
[lemo.getNodeVersion()](#submodule-chain-getNodeVersion) | 节点版本号 | ✓
[lemo.getSdkVersion()](#submodule-chain-getSdkVersion) | js SDK版本号 | ✓
[lemo.watchBlock(withBody, callback)](#submodule-chain-watchBlock) | 监听新的区块 | ✓
[lemo.net.connect(nodeAddr)](#submodule-net-connect) | 连接节点 | ✖
[lemo.net.disconnect(nodeAddr)](#submodule-net-disconnect) | 断开连接 | ✖
[lemo.net.getConnections()](#submodule-net-getConnections) | 获取已建立的连接信息 | ✖
[lemo.net.getConnectionsCount()](#submodule-net-getConnectionsCount) | 获取已建立的连接数 | ✓
[lemo.net.getInfo()](#submodule-net-getInfo) | 获取本节点信息 | ✓
[lemo.mine.start()](#submodule-mine-start) | 开启挖矿 | ✖
[lemo.mine.stop()](#submodule-mine-stop) | 停止挖矿 | ✖
[lemo.mine.getMining()](#submodule-mine-getMining) | 是否正在挖矿 | ✓
[lemo.mine.getMiner()](#submodule-mine-getMiner) | 获取当前共识节点的记账收益地址 | ✓
[lemo.account.newKeyPair()](#submodule-account-newKeyPair) | 创新账户公私钥 | ✖
[lemo.account.getBalance(addr)](#submodule-account-getBalance) | 获取账户余额 | ✓
[lemo.account.getAccount(addr)](#submodule-account-getAccount) | 获取账户信息 | ✓
[lemo.tx.sendTx(privateKey, txInfo)](#submodule-tx-sendTx) | 签名并发送交易 | ✓
[lemo.tx.sign(privateKey, txInfo)](#submodule-tx-sign) | 签名交易 | ✓
[lemo.tx.send(signedTxInfo)](#submodule-tx-send) | 发送已签名的交易 | ✓
[lemo.tx.watchPendingTx(callback)](#submodule-tx-watchPendingTx) | 监听新的pending交易 | ✖
[lemo.stopWatch(watchId)](#submodule-stopWatch) | 停止指定的轮询或所有轮询 | ✓
[lemo.isWatching()](#submodule-isWatching) | 是否正在轮询 | ✓

---

### 协议
以json格式收发数据，遵循[JSON-RPC2.0](https://www.jsonrpc.org/specification)标准  
方便起见，所有数字都需要转换为字符串，以避免数值溢出的情况

#### POST请求
```
{
    "jsonrpc": "2.0",
    "method": "chain_getBlockByHeight",
    "params": [1, false],
    "id": 1
}
```
- `jsonrpc` - (string) 固定为`2.0`
- `method` - (string) API模块名和方法名，以下划线连接
- `params` - (Array) API方法参数列表，直接以对象形式传递参数
- `id` - (number) 递增的请求id

#### 正常回包
```
{
    "jsonrpc": "2.0",
    "result": {...},
    "id": 1
}
```
- `jsonrpc` - (string) 固定为`2.0`
- `result` - (*) 返回的数据，可以是任意类型
- `id` - (number) 对应的请求id

#### 异常回包
```
{
    "jsonrpc": "2.0",
    "error": {"code": -32601, "message": "Method not found"},
    "id": 1
}
```
- `jsonrpc` - (string) 固定为`2.0`
- `error` - (object) 异常信息，包含一个负数`code`和一个描述字符串`message`
- `id` - (number) 对应的请求id

---

### 数据结构

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
- `header` [区块头](#data-structure-header)
- `transactions` 该块中打包的所有[交易](#data-structure-transaction)列表
- `changeLogs` 该块对链上数据的[修改记录](#data-structure-changeLog)列表
- `confirms` 各共识节点验证区块通过后，对该块hash的[签名](#data-structure-confirm)列表
- `events` 该块中所有交易产生的[合约事件](#data-structure-event)列表
- `deputyNodes` 如果该块是一个`快照块`，则这里保存新一代[共识节点信息](#data-structure-deputyNode)的列表。否则为空

<a name="data-structure-header"></a>
#### header
区块头
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
- `hash` 区块hash
- `height` 区块高度
- `parentHash` 上一个区块的hash
- `miner` 出块者的账户地址
- `signData` 出块者对区块hash的签名
- `timestamp` 出块时间戳，单位为秒
- `gasLimit` 该块中打包的交易消耗的总gas上限
- `gasUsed` 该块中打包的交易消耗的实际gas
- `eventBloom` 对区块中的`events`计算出的Bloom过滤器，用来快速查询合约事件
- `changeLogRoot` 将区块中的`changeLogs`以Merkle树的形式组织起来，得到的根节点hash
- `deputyRoot` 将区块中的`deputyNodes`以Merkle树的形式组织起来，得到的根节点hash
- `eventRoot` 将区块中的`events`以Merkle树的形式组织起来，得到的根节点hash
- `transactionRoot` 将区块中的`transactions`以Merkle树的形式组织起来，得到的根节点hash
- `versionRoot` 该块打包时全局账户版本树的根节点hash
- `extraData` (可选) 出块者向区块中添加的自定义信息

<a name="data-structure-transaction"></a>
#### transaction
交易
```json
{
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
- `to` 交易接收者的账户地址
- `toName` (可选) 交易接收者的账户名，会与账户地址进行比对校验。类似银行转账时填写的姓名与卡号的关系
- `amount` 交易金额，单位`mo`。1`LEMO`=1000000000000000000`mo`=1e18`mo`
- `data` (可选) 交易附带的数据，可用于调用智能合约。根据交易类型也会有不同的作用
- `expirationTime` 交易过期时间戳，单位为秒。如果交易过期时间在半小时以后，则可能不会被打包，这取决于节点交易池的配置
- `gasLimit` 交易消耗的gas上限。如果超过这个限制还没运行结束，则交易失败，并且gas费用不退还
- `gasPrice` 交易消耗gas的单价，单位为`mo`。单价越高越优先被打包
- `hash` 交易hash
- `message` (可选) 交易附带的文本消息
- `r` 交易签名字段
- `s` 交易签名字段
- `v` 交易类型、交易编码版本号(当前为0)、交易签名字段、chainID这4个字段组合而成的数据

交易类型 | 说明
---|---
0 | 普通转账交易或合约执行交易

chainID | 说明
---|---
1 | LemoChain主网

<a name="data-structure-changeLog"></a>
#### changeLog
交易对链上数据的修改记录
```json
{
    "address": "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG",
    "extra": "",
    "newValue": "0x8c052b7d2dcc80cd2e40000000",
    "type": "BalanceLog",
    "version": "1"
}
```
- `address` 产生了数据变化的账号地址
- `version` 账户数据的版本号，每种`type`的数据版本号彼此独立
- 根据`type`的不同，`newValue`和`extra`内保存的数据也不同

type | 功能 | newValue | extra
---|---|---|---
BalanceLog | 账户余额变化 | 新的余额 | -
StorageLog | 合约账户存储数据变化 | value | key
CodeLog | 合约账户创建 | 合约code | -
AddEventLog | 产生一条合约日志 | 合约日志 | -
SuicideLog | 合约账户销毁 | - | -

<a name="data-structure-confirm"></a>
#### confirm
共识节点验证区块通过后，对该块hash的签名
```
0x1234
```

<a name="data-structure-event"></a>
#### event
合约事件
```json
{
    "address": "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG"
}
```

<a name="data-structure-deputyNode"></a>
#### deputyNode
共识节点的信息
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
- `ip` 节点的IP地址
- `minerAddress` 节点的挖矿收益账号地址
- `nodeID` 节点的ID，即节点对区块签名时的私钥对应的公钥
- `port` 与其它节点连接用的端口号
- `rank` 节点的排名
- `votes` 节点的总票数

<a name="data-structure-account"></a>
#### account
账户信息
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
- `address` 账户地址
- `balance` 账户余额，`BigNumber`对象，并且有`toMoney()`方法可以输出格式化金额
- `records` 账户数据的修改记录对象。其中key是[ChangeLog](data-structure-changeLog)的类型，value是该类型对应最新的那一条`ChangeLog`的版本号和所在的区块高度
- `codeHash` 合约账户的代码hash
- `root` 合约账户的存储树根节点hash

---

### 构造函数
```
lemo = new LemoClient({
    host: 'http://127.0.0.1:8001'
})
```
- `host` LemoChain节点的HTTP连接地址。默认值`http://127.0.0.1:8001`
> 注意: 如果连接后出现跨域问题，则需要用参数`--rpccorsdomain http://sdk所在web的域名:端口号`的方式启动LemoChain节点

---

### chain模块API

<a name="submodule-chain-getBlock"></a>
#### lemo.getBlock
```
lemo.getBlock(heightOrHash [, withBody])
```
根据高度或hash获取区块

##### Parameters
1. `number|string` - 区块高度或hash字符串。如果是高度，则只能获取稳定块（经过多数共识节点签名确认的区块）
2. `boolean` - (可选) 是否获取交易列表等区块体内容。默认为`false`

##### Returns
`Promise` - 通过`then`可以获取到[区块对象](#data-structure-block)

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
获取最新的块

##### Parameters
1. `boolean` - (可选) 是否只获取稳定块（经过多数共识节点签名确认的区块）。默认为`true`
2. `boolean` - (可选) 是否获取交易列表等区块体内容。默认为`false`

##### Returns
`Promise` - 通过`then`可以获取到[区块对象](#data-structure-block)

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
获取当前高度

##### Parameters
1. `boolean` - (可选) 是否只获取稳定块（经过多数共识节点签名确认的区块）。默认为`true`

##### Returns
`Promise` - 通过`then`可以获取到当前区块高度

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
获取创世区块

##### Parameters
无

##### Returns
`Promise` - 通过`then`可以获取到[区块对象](#data-structure-block)

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
获取LemoChain节点的当前链ID

##### Parameters
无

##### Returns
`Promise` - 通过`then`可以获取到当前chainID

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
获取建议gas价格

##### Parameters
无

##### Returns
`Promise` - 通过`then`可以获取到建议gas价格，单位为`mo`

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
获取LemoChain节点版本号

##### Parameters
无

##### Returns
`Promise` - 通过`then`可以获取到LemoChain节点版本号

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
获取SDK版本号

##### Parameters
无

##### Returns
`Promise` - 通过`then`可以获取到SDK版本号

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
监听新的区块。在调用时会直接返回当前最新的区块。之后会等到产生了新的稳定块再回调

##### Parameters
1. `boolean` - 是否获取交易列表等区块体内容。默认为`false`
2. `Function` - 每次回调会传入[区块对象](#data-structure-block)

##### Returns
`number` - watchId，可用于[取消监听](#submodule-stopWatch)

##### Example
```js
lemo.watchBlock(true, function(block) {
    const d = new Date(1000 * parseInt(block.header.timestamp, 10))
    console.log(d.toUTCString()); // "Thu, 30 Aug 2018 12:00:00 GMT"
})
```

---

### net模块API

<a name="submodule-net-connect"></a>
#### lemo.net.connect
```
lemo.net.connect(nodeAddr)
```
连接到指定的LemoChain节点

##### Parameters
1. `string` - ip地址

##### Returns
`Promise` - 无返回数据

##### Example
```js
lemo.net.connect('127.0.0.1:60002')
```

---

<a name="submodule-net-disconnect"></a>
#### lemo.net.disconnect
```
lemo.net.disconnect(nodeAddr)
```
断开与指定LemoChain节点的连接

##### Parameters
1. `string` - ip地址

##### Returns
`Promise` - 通过`then`可以获取到断开连接是否成功

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
获取已建立的连接信息

##### Parameters
无

##### Returns
`Promise` - 通过`then`可以获取到连接信息列表

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
获取已建立的连接数

##### Parameters
无

##### Returns
`Promise` - 通过`then`可以获取到连接数

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
获取本节点信息

##### Parameters
无

##### Returns
`Promise` - 通过`then`可以获取到节点信息

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

### mine模块API

<a name="submodule-mine-start"></a>
#### lemo.mine.start
```
lemo.mine.start()
```
开启挖矿

##### Parameters
无

##### Returns
`Promise` - 无返回数据

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
停止挖矿

##### Parameters
无

##### Returns
`Promise` - 无返回数据

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
是否正在挖矿

##### Parameters
无

##### Returns
`Promise` - 通过`then`可以获取到是否正在挖矿

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
获取当前共识节点的记账收益地址，即用于接收交易gas的账户地址

##### Parameters
无

##### Returns
`Promise` - 通过`then`可以获取到账号地址

##### Example
```js
lemo.mine.getMiner()
    .then(function(miner) {
        console.log(miner); // "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG"
    })
```

---

### account模块API

<a name="submodule-account-newKeyPair"></a>
#### lemo.account.newKeyPair
```
lemo.account.newKeyPair()
```
创新账户公私钥

##### Parameters
无

##### Returns
`Promise` - 通过`then`可以获取到私钥，账号公钥和账号地址

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
获取账户余额

##### Parameters
1. `string` - 账户地址

##### Returns
`Promise` - 通过`then`可以获取到余额的`BigNumber`对象

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
获取账户信息

##### Parameters
1. `string` - 账户地址

##### Returns
`Promise` - 通过`then`可以获取到[账户](#data-structure-account)信息

##### Example
```js
lemo.account.getBalance('Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34')
    .then(function(account) {
        console.log(account.balance.toMoney()); // "1600000000 LEMO"
    })
```

---

### tx模块API

<a name="submodule-tx-sendTx"></a>
#### lemo.tx.sendTx
```
lemo.tx.sendTx(privateKey, txInfo)
```
签名并发送交易

##### Parameters
1. `string` - 账户私钥
2. `object` - 签名前的交易信息
    - `type` - (number) (选填) 交易类型，默认值为`0`
    - `version` - (number) (选填) 交易编码版本号，默认值为`0`
    - `chainId` - (number) (选填) 区块链的chainID，默认值为`1`，即LemoChain主链
    - `to` - (string) (选填) 交易接收者的账户地址。为空表示这是创建智能合约的交易，必须携带`data`
    - `toName` - (string) (选填) 交易接收者的账户名，会与账户地址进行比对校验。类似银行转账时填写的姓名与卡号的关系
    - `amount` - (number|string) (选填) 交易金额，单位`mo`，默认值为`0`
    - `gasPrice` - (number|string) (选填) 交易消耗的gas上限，默认值为`3000000000`
    - `gasLimit` - (number|string) (选填) 交易消耗gas的单价，单位为`mo`，默认值为`2000000`
    - `data` - (Buffer|string) (选填) 交易附带的数据，可用于调用智能合约，默认为空
    - `expirationTime` - (number) (选填)交易过期时间戳，单位为秒，默认值为半小时后
    - `message` - (string) (选填)交易附带的文本消息，默认为空

##### Returns
`Promise` - 通过`then`可以获取到交易hash

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
签名交易并返回出签名后的交易信息字符串  
该方法用于实现安全的离线交易
1. 在离线电脑上签名
2. 将签名后的数据拷贝到联网电脑上
3. 通过[`lemo.tx.send`](submodule-tx-send)方法发送到LemoChain

##### Parameters
1. `string` - 账户私钥
2. `object` - 签名前的交易信息，细节参考[`lemo.tx.sendTx`](submodule-tx-sendTx)

##### Returns
`Promise` - 通过`then`可以获取到签名后的[交易](#data-structure-transaction)信息字符串

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
发送已签名的交易

##### Parameters
1. `object|string` - 签名后的[交易](#data-structure-transaction)信息，可以是对象形式也可以是[`lemo.tx.sign`](submodule-tx-sign)返回的字符串形式  
    相对于[`lemo.tx.sendTx`](submodule-tx-sendTx)中的交易信息少了`type`、`version`、`chainId`字段，并多出了以下字段
    - `r` - (Buffer|string) 交易签名字段
    - `s` - (Buffer|string) 交易签名字段
    - `v` - (Buffer|string) `type`、`version`、交易签名字段、`chainId`这4个字段组合而成的数据

##### Returns
`Promise` - 通过`then`可以获取到交易hash

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
监听新的交易。在调用时会直接返回当前待打包的交易。之后会等到节点接收到新的交易再回调（1.0.0版未实现）

##### Parameters
1. `Function` - 每次回调会传入[交易对象](#data-structure-transaction)列表

##### Returns
`number` - watchId，可用于[取消监听](#submodule-stopWatch)

##### Example
```js
lemo.watchPendingTx(true, function(transactions) {
    console.log(transactions.length);
})
```

---

### 其它API

<a name="submodule-stopWatch"></a>
#### lemo.stopWatch
```
lemo.tx.stopWatch(watchId)
```
停止轮询

##### Parameters
1. `number|undefined` - (选填) `lemo.watchXXX`接口返回的id。若不填，则停止所有轮询

##### Returns
无

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
是否正在轮询

##### Parameters
无

##### Returns
`boolean` - 是否正在轮询

##### Example
```js
console.log(lemo.isWatching() ? 'watching' : 'not watching')
```

---


## 开发

### 依赖

* Node.js
* yarn

```bash
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install yarn
```

### 编译

```bash
yarn build
```


### 配置项

在 [lib/config.js](https://github.com/LemoFoundationLtd/lemo-client/blob/master/lib/config.js) 文件中有一些配置项，如果搭建LemoChain私链的话可以用到

### 测试

```bash
yarn test
```

## 开源协议

LGPL-3.0
