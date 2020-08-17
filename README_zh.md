![Logo of the project](./logo.png)

# LemoChain Core SDK

[![npm](https://img.shields.io/npm/v/lemo-core-sdk.svg?style=flat-square)](https://www.npmjs.com/package/lemo-core-sdk)
[![Build Status](https://travis-ci.org/LemoFoundationLtd/lemo-core-sdk.svg?branch=master)](https://travis-ci.org/LemoFoundationLtd/lemo-core-sdk)
[![Coverage Status](https://coveralls.io/repos/github/LemoFoundationLtd/lemo-core-sdk/badge.svg?branch=master)](https://coveralls.io/github/LemoFoundationLtd/lemo-core-sdk?branch=master)
[![GitHub license](https://img.shields.io/badge/license-LGPL3.0-blue.svg?style=flat-square)](https://github.com/LemoFoundationLtd/lemo-core-sdk/blob/master/LICENSE)

通过 JSON RPC 协议访问 LemoChain Core 节点上的数据

> 需要先在本地通过`--rpc`参数启动一个[LemoChain Core节点](https://github.com/LemoFoundationLtd/lemochain-core)，或远程连接到一个已存在的 LemoChain Core 节点，才能运行本项目

[中文版](https://github.com/LemoFoundationLtd/lemo-core-sdk/blob/master/README_zh.md)  
[English](https://github.com/LemoFoundationLtd/lemo-core-sdk/blob/master/README.md)

## 安装

### 使用 Yarn

```bash 
yarn add lemo-core-sdk
```

### 在浏览器中引入

-   在 html 中引入 `lemo-core-sdk.min.js` 文件
-   通过全局变量 `LemoCore` 使用 SDK

## 示例

```js
const LemoCore = require('lemo-core-sdk')
const lemo = new LemoCore({
    host: 'http://127.0.0.1:8001'
})

lemo.chain.getBlockByNumber(0).then(function(block) {
    console.log(block)
})
```

## LemoChain Core API

> 所有异步接口都返回 Promise 对象  
> 所有接口都可在 LemoChain Core 的控制台中使用，但通过远程连接（如 http、websocket）到节点时，只能使用部分接口

| API                                                                        | 功能                           | 异步 | 可远程使用 |
| -------------------------------------------------------------------------- | ------------------------------ | ----- | ---------- |
| [lemo.getBlock(heightOrHash, withBody)](#submodule-chain-getBlock)         | 根据高度或 hash 获取区块       | ✓    | ✓          |
| [lemo.getNewestBlock(withBody)](#submodule-chain-getNewestBlock)          | 获取最新的块                   | ✓    | ✓          |
| [lemo.getNewestUnstableBlock()](#submodule-chain-getNewestUnstableBlock)          | 获取最新的不稳定块               | ✓    | ✖          |
| [lemo.getNewestHeight()](#submodule-chain-getNewestHeight)         | 获取最新高度                   | ✓    | ✓          |
| [lemo.getNewestUnstableHeight()](#submodule-chain-getNewestUnstableHeight)         | 获取最新不稳定块高度                   | ✓    | ✖          |
| [lemo.getGenesis()](#submodule-chain-getGenesis)                           | 获取创世区块                   | ✓    | ✓          |
| [lemo.getChainID()](#submodule-chain-getChainID)                           | 获取当前链 ID                  | ✓    | ✓          |
| [lemo.getCandidateTop30()](#submodule-chain-getCandidateTop30)             | 获取排名前30的候选节点列表       | ✓    | ✓          |
| [lemo.getDeputyNodeList()](#submodule-chain-getDeputyNodeList)             | 获取当前所有共识节点的信息列表    | ✓    | ✓          |
| [lemo.getTermReward(height)](#submodule-chain-getTermReward) | 获取换届奖励信息                 | ✓    | ✓          |
| [lemo.getAllRewardValue()](#submodule-chain-getAllRewardValue) | 获取所有的收益信息                 | ✓    | ✓          |
| [lemo.getNodeVersion()](#submodule-chain-getNodeVersion)                   | 节点版本号                     | ✓    | ✓          |
| [lemo.watchBlock(withBody, callback)](#submodule-chain-watchBlock)         | 监听新的区块                   | ✖    | ✓          |
| [lemo.stopWatchBlock(subscribeId)](#submodule-chain-stopWatchBlock)            | 停止监听区块                   | ✖    | ✓          |
| [lemo.net.connect(nodeAddr)](#submodule-net-connect)                       | 连接节点                       | ✓    | ✖          |
| [lemo.net.disconnect(nodeAddr)](#submodule-net-disconnect)                 | 断开连接                       | ✓    | ✖          |
| [lemo.net.getConnections()](#submodule-net-getConnections)                 | 获取已建立的连接信息           | ✓    | ✖          |
| [lemo.net.getConnectionsCount()](#submodule-net-getConnectionsCount)       | 获取已建立的连接数             | ✓    | ✓          |
| [lemo.net.getInfo()](#submodule-net-getInfo)                               | 获取本节点信息                 | ✓    | ✓          |
| [lemo.net.getNodeID()](#submodule-net-getNodeID)                               | 获取本节点的nodeId                 | ✓    | ✓          |
| [lemo.net.connect()](#submodule-net-connect)                               | 连接节点                 | ✓    |  ✖         |
| [lemo.net.Disconnect()](#submodule-net-Disconnect)                               | 断开节点连接                 | ✓    |  ✖         |
| [lemo.net.BroadcastConfirm()](#submodule-net-BroadcastConfirm)                               | 广播确认                 | ✓    |  ✖         |
| [lemo.mine.start()](#submodule-mine-start)                                 | 开启挖矿                       | ✓    | ✖          |
| [lemo.mine.stop()](#submodule-mine-stop)                                   | 停止挖矿                       | ✓    | ✖          |
| [lemo.mine.getMining()](#submodule-mine-getMining)                         | 是否正在挖矿                   | ✓    | ✓          |
| [lemo.mine.getMiner()](#submodule-mine-getMiner)                           | 获取当前共识节点的记账收益地址   | ✓    | ✓          |
| [lemo.account.newKeyPair()](#submodule-account-newKeyPair)                 | 创新账户公私钥                 | ✓    | ✓          |
| [lemo.account.getBalance(addr)](#submodule-account-getBalance)             | 获取账户余额                   | ✓    | ✓          |
| [lemo.account.getAccount(addr)](#submodule-account-getAccount)             | 获取账户信息                   | ✓    | ✓          |
| [lemo.account.getCandidateInfo(addr)](#submodule-account-getCandidateInfo) | 获取候选人信息                 | ✓    | ✓          |
| [lemo.account.getVoteFor(addr)](#submodule-account-getVoteFor) | 获取账户的投票信息                 | ✓    | ✓          |
| [lemo.account.getAssetEquity(addr, assetId)](#submodule-account-getAssetEquity) | 获取账户的收益                 | ✓    | ✓          |
| [lemo.account.createTempAddress(from, userId)](#submodule-account-createTempAddress) | 创建临时账户                 | ✖    | ✓          |
| [lemo.account.isTempAddress(address)](#submodule-account-isTempAddress) | 是否是临时账户                 | ✖    | ✓          |
| [lemo.account.isContractAddress(address)](#submodule-account-isContractAddress) | 是否是合约账户                 | ✖    | ✓          |
| [lemo.tx.send(signedTxInfo)](#submodule-tx-send)                           | 发送已签名的交易               | ✓    | ✓          |
| [lemo.tx.waitConfirm(txHash)](#submodule-tx-waitConfirm)                           | 等待交易上链               | ✓    | ✓          |
| [lemo.tx.watchTx(filterTxConfig, callback)](#submodule-tx-watchTx)         | 监听过滤区块的交易            | ✖    | ✓          |
| [lemo.tx.stopWatchTx(subscribeId)](#submodule-tx-stopWatchTx)                | 停止指定交易            | ✖    | ✓          |
| [lemo.tx.watchPendingTx(callback)](#submodule-tx-watchPendingTx)           | 监听新的 pending 交易          | ✖    | ✖          |
| [lemo.stopWatch()](#submodule-global-stopWatch)                     | 停止所有轮询       | ✖    | ✓          |
| [lemo.isWatching()](#submodule-global-isWatching)                          | 是否正在轮询                   | ✖    | ✓          |


| 类属性                                                                        | 描述                           |
| -------------------------------------------------------------------------- | ------------------------------ |
| [LemoCore.SDK_VERSION](#submodule-tool-SDK_VERSION)                          | js SDK 版本号                  |
| [LemoCore.TxType](#submodule-tool-TxType)                                    | 交易类型枚举                  |
| [LemoCore.verifyAddress(addr)](#submodule-tool-verifyAddress)             | LemoChain地址校验             | 
| [LemoCore.moToLemo(mo)](#submodule-tool-moToLemo)             | 将单位从mo转换为LEMO             | 
| [LemoCore.lemoToMo(ether)](#submodule-tool-lemoToMo)             | 将单位从LEMO转换为mo             |
| [LemoCore.toBuffer(data)](#submodule-tool-toBuffer)             | 将数据转换为Buffer类型             | 

---

### 协议

以 json 格式收发数据，遵循[JSON-RPC2.0](https://www.jsonrpc.org/specification)标准  
方便起见，所有数字都需要转换为字符串，以避免数值溢出的情况

#### POST 请求

```
{
    "jsonrpc": "2.0",
    "method": "chain_getBlockByHeight",
    "params": [1, false],
    "id": 1
}
```

-   `jsonrpc` - (string) 固定为`2.0`
-   `method` - (string) API 模块名和方法名，以下划线连接
-   `params` - (Array) API 方法参数列表，直接以对象形式传递参数
-   `id` - (number) 递增的请求 id

#### 正常回包

```
{
    "jsonrpc": "2.0",
    "result": {...},
    "id": 1
}
```

-   `jsonrpc` - (string) 固定为`2.0`
-   `result` - (\*) 返回的数据，可以是任意类型
-   `id` - (number) 对应的请求 id

#### 异常回包

```
{
    "jsonrpc": "2.0",
    "error": {"code": -32601, "message": "Method not found"},
    "id": 1
}
```

-   `jsonrpc` - (string) 固定为`2.0`
-   `error` - (object) 异常信息，包含一个负数`code`和一个描述字符串`message`
-   `id` - (number) 对应的请求 id

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

-   `header` [区块头](#data-structure-header)
-   `transactions` 该块中打包的所有[交易](#data-structure-transaction)列表
-   `changeLogs` 该块对链上数据的[修改记录](#data-structure-changeLog)列表
-   `confirms` 各共识节点验证区块通过后，对该块 hash 的[签名](#data-structure-confirm)列表
-   `events` 该块中所有交易产生的[合约事件](#data-structure-event)列表
-   `deputyNodes` 如果该块是一个`快照块`，则这里保存新一代[共识节点信息](#data-structure-deputyNode)的列表。否则为空

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

-   `hash` 区块 hash
-   `height` 区块高度
-   `parentHash` 上一个区块的 hash
-   `miner` 出块者的账户地址
-   `signData` 出块者对区块 hash 的签名
-   `timestamp` 出块时间戳，单位为秒
-   `gasLimit` 该块中打包的交易消耗的总 gas 上限
-   `gasUsed` 该块中打包的交易消耗的实际 gas
-   `eventBloom` 对区块中的`events`计算出的 Bloom 过滤器，用来快速查询合约事件
-   `changeLogRoot` 将区块中的`changeLogs`以 Merkle 树的形式组织起来，得到的根节点 hash
-   `deputyRoot` 将区块中的`deputyNodes`以 Merkle 树的形式组织起来，得到的根节点 hash
-   `eventRoot` 将区块中的`events`以 Merkle 树的形式组织起来，得到的根节点 hash
-   `transactionRoot` 将区块中的`transactions`以 Merkle 树的形式组织起来，得到的根节点 hash
-   `versionRoot` 该块打包时全局账户版本树的根节点 hash
-   `extraData` (可选) 出块者向区块中添加的自定义信息

<a name="data-structure-transaction"></a>

#### transaction

交易

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

-   `type` 交易类型
-   `chainID` LemoChain的ID
-   `version` 当前交易版本，介于0-128之间
-   `from` 交易发送者的账户地址
-   `to` 交易接收者的账户地址
-   `gasPayer` 代付Gas的账户地址
-   `toName` (可选) 交易接收者的账户名，会与账户地址进行比对校验。类似银行转账时填写的姓名与卡号的关系。最大长度为100字符
-   `amount` 交易金额，`BigNumber`对象，单位`mo`。1`LEMO`=1000000000000000000`mo`=1e18`mo`
-   `data` (可选) 交易附带的数据，可用于调用智能合约。根据交易类型也会有不同的作用
-   `expirationTime` 交易过期时间戳，单位为秒。如果交易过期时间在半小时以后，则可能不会被打包，这取决于节点交易池的配置
-   `gasLimit` 交易消耗的 gas 上限。如果超过这个限制还没运行结束，则交易失败，并且 gas 费用不退还
-   `gasPrice` 交易消耗 gas 的单价，`BigNumber`对象，单位为`mo`。单价越高越优先被打包
-   `hash` 交易 hash
-   `message` (可选) 交易附带的文本消息。最大长度为1024字符
-   `sigs` 交易签名数组，每个字段长度为65个字节
-   `gasPayerSigs` 代付 gas 交易签名数组，每个字段长度为65个字节

<a name="data-transaction-type"></a>

| 交易类型                 | 数值 | 说明                       |
| ----------------------- | --- | -------------------------- |
| lemo.TxType.ORDINARY    | 0   | 普通转账交易或合约执行交易    |
| lemo.TxType.CREATE_CONTRACT    | 1   | 创建智能合约交易    |
| lemo.TxType.VOTE        | 2   | 设置投票对象                |
| lemo.TxType.CANDIDATE   | 3   | 注册或修改候选人信息         |
| lemo.TxType.CREATE_ASSET | 4   | 创建资产信息                |
| lemo.TxType.ISSUE_ASSET  | 5   | 发行资产                   |
| lemo.TxType.REPLENISH_ASSET   | 6   | 增发资产交易           |
| lemo.TxType.MODIFY_ASSET | 7   | 修改资产交易                |
| lemo.TxType.TRANSFER_ASSET| 8   | 交易资产                   |
| lemo.TxType.MODIFY_SIGNER| 9   | 修改多重签名                   |
| lemo.TxType.BOX_TX| 10   | 箱子交易，打包多笔交易，事务性地运行它们      |

| chainID | 说明           |
| ------- | -------------- |
| 1       | LemoChain 主网 |
| 100     | LemoChain 测试网 |

<a name="data-structure-changeLog"></a>

#### changeLog

交易对链上数据的修改记录

```json
{
    "address": "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG",
    "extra": "",
    "newValue": "0x8c052b7d2dcc80cd2e40000000",
    "type": "BalanceLog",
    "version": 1
}
```

-   `address` 产生了数据变化的账号地址
-   `version` 账户数据的版本号，每种`type`的数据版本号彼此独立
-   根据`type`的不同，`newValue`和`extra`内保存的数据也不同

| type        | 功能                 | newValue  | extra |
| ----------- | -------------------- | --------- | ----- |
| BalanceLog  | 账户余额变化         | 新的余额  | -     |
| StorageLog  | 合约账户存储数据变化 | 	value     | 	key   |
| CodeLog     | 合约账户创建         | 合约 code | -     |
| AddEventLog | 产生一条合约日志     | 合约日志  | -     |
| SuicideLog  | 合约账户销毁         | -         | -     |
| VoteForLog | 修改投票对象账号地址 | 新的投票对象地址 | - |
| VotesLog | 候选者收到的票数变化 | 新的票数 | - |
| CandidateProfileLog | 候选者修改自己的节点信息 | 节点信息对象 | - |
| TxCountLog | 交易数量的变化 | 交易数量 | - |
| SignersLog | 多重签名账户的变化 | 多重签名对象 | - |

<a name="data-structure-confirm"></a>

#### confirm

共识节点验证区块通过后，对该块 hash 的签名

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
    "minerAddress": "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG",
    "nodeID": "0x5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0",
    "host": "127.0.0.1",
    "port": "7001",
    "votes": "50000"
}
```

-   `minerAddress` 节点的挖矿收益账号地址
-   `nodeID` 节点的 ID，即节点对区块签名时的私钥对应的公钥。长度为130个字符，需要加`0x`
-   `host` 节点的 IP 地址或域名。最大长度为128字符
-   `port` 与其它节点连接用的端口号
-   `votes` 节点的总票数

<a name="data-structure-account"></a>

#### account

账户信息

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
            "nodeID": "0x5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0",
            "port": "7001"
        }
    }
}
```

-   `address` 账户地址
-   `balance` 账户余额，`BigNumber`对象，并且有`toMoney()`方法可以输出格式化金额
-   `records` 账户数据的修改记录对象。其中 key 是[ChangeLog](data-structure-changeLog)的类型，value 是该类型对应最新的那一条`ChangeLog`的版本号和所在的区块高度
-   `codeHash` 合约账户的代码 hash
-   `root` 合约账户的存储树根节点 hash
-   `txCount` 账户收到或发送的交易数量
-   `voteFor` 投票对象的账户地址
-   `candidate` 如果是候选者账户，则该字段不为空
    - `votes` 候选者收到的总票数
    - `profile` 候选者信息
        - `host` 候选者的节点服务器连接地址，可以是IP或域名
        - `isCandidate` 该账户是否是候选者。用来取消候选者身份
        - `minerAddress` 节点的挖矿收益账号地址
        - `nodeID` 节点的 ID，即节点对区块签名时的私钥对应的公钥。长度为130个字符，需要加`0x`
        - `port` 候选者的节点服务器端口号

---

### 构造函数

```
lemo = new LemoCore({
    chainID: 1, 
    host: 'http://127.0.0.1:8001'
})
```

-   `chainID` 区块链的 chainID，默认值为`1`，即 LemoChain 主链
-   `host` LemoChain 节点的 HTTP 连接地址。默认值`http://127.0.0.1:8001`
    > 注意: 如果连接后出现跨域问题，则需要用参数`--rpccorsdomain http://sdk所在web的域名:端口号`的方式启动 LemoChain 节点

---

### chain 模块 API

<a name="submodule-chain-getBlock"></a>

#### lemo.getBlock

```
lemo.getBlock(heightOrHash [, withBody])
```

根据高度或 hash 获取区块

##### Parameters

1. `number|string` - 区块高度或 hash 字符串。如果是高度，则只能获取稳定块（经过多数共识节点签名确认的区块）
2. `boolean` - (可选) 是否获取交易列表等区块体内容。默认为`false`

##### Returns

`Promise` - 通过`then`可以获取到[区块对象](#data-structure-block)

##### Example

```js
lemo.getBlock(0).then(function(block) {
    console.log(block.header.hash) // "0x11d9153b14adb92a14c16b66c3524d62b4742c0e7d375025525e2f131de37a8b"
})
```

---

<a name="submodule-chain-getNewestBlock"></a>

#### lemo.getNewestBlock

```
lemo.getNewestBlock([withBody])
```

获取最新的块

##### Parameters

1. `boolean` - (可选) 是否获取交易列表等区块体内容。默认为`false`

##### Returns

`Promise` - 通过`then`可以获取到[区块对象](#data-structure-block)

##### Example

```js
lemo.getNewestBlock(true).then(function(block) {
    console.log(block.header.miner) // "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG"
})
```

---

<a name="submodule-chain-getNewestUnstableBlock"></a>

#### lemo.getNewestUnstableBlock

```
lemo.getNewestUnstableBlock()
```

获取最新不稳定的块，可能没有足够的共识节点确认

##### Parameters

无

##### Returns

`Promise` - 通过`then`可以获取到[区块对象](#data-structure-block)，包括区块体

##### Example

```js
lemo.getNewestUnstableBlock().then(function(block) {
    console.log(block.header.miner) // "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG"
})
```

---

<a name="submodule-chain-getNewestHeight"></a>

#### lemo.getNewestHeight

```
lemo.getNewestHeight([stable])
```

获取最新块高度

##### Parameters

无

##### Returns

`Promise` - 通过`then`可以获取到当前区块高度

##### Example

```js
lemo.getNewestHeight().then(function(height) {
    console.log(height) // "100"
})
```

---

<a name="submodule-chain-getNewestUnstableHeight"></a>

#### lemo.getNewestUnstableHeight

```
lemo.getNewestUnstableHeight()
```

获取最新不稳定块高度

##### Parameters

无

##### Returns

`Promise` - 通过`then`可以获取到当前区块高度

##### Example

```js
lemo.getNewestUnstableHeight().then(function(height) {
    console.log(height) // "100"
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
lemo.getGenesis().then(function(block) {
    console.log(block.header.parentHash) // "0x0000000000000000000000000000000000000000000000000000000000000000"
})
```

---

<a name="submodule-chain-getChainID"></a>

#### lemo.getChainID

```
lemo.getChainID()
```

获取 LemoChain 节点的当前链 ID

##### Parameters

无

##### Returns

`Promise` - 通过`then`可以获取到当前 chainID

##### Example

```js
lemo.getChainID().then(function(chainID) {
    console.log(chainID) // "1"
})
```

---

<a name="submodule-chain-getCandidateTop30"></a>
#### lemo.getCandidateTop30
```
lemo.getCandidateTop30()
```
获取排名前30的候选节点列表

##### Parameters
无

##### Returns
`Promise` - 通过`then`可以获取到候选人信息对象的数组。这里的候选人信息与[账户信息](#data-structure-account)中的`candidate`对象一致，只是在这个候选人信息中增加了一个`address`字段，表示账户地址  

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
获取当前所有共识节点的信息

##### Parameters
无

##### Returns
`Promise` - 通过`then`可以获取当前所有共识节点的信息列表  
    `minerAddress` - (string)节点出块账号
    `incomeAddress` - (string)节点收益账号
    `nodeID` - (string)节点ID
    `rank` - (number)出块节点所在的排名
    `votes` - (string)节点所得票数
    `host` - (string)节点域名
    `port` - (number)端口号
    `depositAmount` - (string)质押金额
    `introduction` - (string)节点简介
    `p2pUri` - (string)LemoChain节点的连接地址。该地址可用于[连接节点](#submodule-net-connect)

##### Example
```js
lemo.getDeputyNodeList().then(function(nodeList) {
    console.log(nodeList.length) // 1
    console.log(JSON.stringify(nodeList[0]))
// "{"minerAddress":"Lemo83DZ5J99JSK5ZH89TCW7T6ZZCWJ8H7FDGA7W","incomeAddress":"Lemo83DZ5J99JSK5ZH89TCW7T6ZZCWJ8H7FDGA7W","nodeID":"0x0e7dcd418dbe7717eb0e83162f8810a3c7725e0d386b324dc5f3ef5a27a2a83e393a193f6ab53d3a51b490adeee362357676f50eed3d188824ef1fb3af02b2d0","rank":0,"votes":"50000","host":"127.0.0.1","port":8080,"depositAmount":"5000000000000000000000000","introduction":"ddf","p2pUri":"0e7dcd418dbe7717eb0e83162f8810a3c7725e0d386b324dc5f3ef5a27a2a83e393a193f6ab53d3a51b490adeee362357676f50eed3d188824ef1fb3af02b2d0@127.0.0.1:8080"}"
    lemo.net.connect(nodeList[0].p2pUri)
})
```

---

<a name="submodule-chain-getTermReward"></a>
#### lemo.getTermReward
```
lemo.getTermReward(height)
```
获取换届奖励信息

##### Parameters
1. `number` - 区块高度，将根据该高度找到这一届中发放奖励的区块

##### Returns
`object` - 换届奖励信息，包括：
    `term` - (number)届数，从0开始
    `value` - (string)发放奖励的总量，单位为`mo`
    `rewardHeight` - (number)发放奖励区块的高度

##### Example
```js
lemo.getTermReward(1001).then(function(result){
console.log(JSON.stringify(result)) // {"term":0,"value":"1000000000","rewardHeight":10001}
})
```

---

<a name="submodule-chain-getAllRewardValue"></a>
#### lemo.getAllRewardValue
```
lemo.getAllRewardValue()
```
获取当前节点所有的收益信息

##### Parameters
无

##### Returns
`object` - 换届奖励信息，包括：
    `term` - (number)届数，从0开始
    `value` - (string)该届设置的奖励金额
    `times` - (number)这届奖励金额的修改次数

##### Example
```js
lemo.getAllRewardValue().then(function(result){
console.log(result) // { 0: { term: '1', value: '1000000001', times: '0' } }
})
```

---

<a name="submodule-chain-getNodeVersion"></a>

#### lemo.getNodeVersion

```
lemo.getNodeVersion()
```

获取 LemoChain 节点版本号

##### Parameters

无

##### Returns

`Promise` - 通过`then`可以获取到 LemoChain 节点版本号

##### Example

```js
lemo.getNodeVersion().then(function(version) {
    console.log(version) // "1.0.0"
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
    console.log(d.toUTCString()) // "Thu, 30 Aug 2018 12:00:00 GMT"
})
```

---

<a name="submodule-chain-stopWatchBlock"></a>

#### lemo.stopWatchBlock

```
lemo.stopWatchBlock(subscribeId)
```

停止监听区块

##### Parameters

1. `number` - 获取subscribeId，用于停止监听

##### Returns

无

##### Example

```js
const watchBlockId = lemo.watchBlock(false, function(newBlock) {
    console.log(newBlock)
})
lemo.stopWatchBlock(watchBlockId)
```

---

### net 模块 API

<a name="submodule-net-connect"></a>

#### lemo.net.connect

```
lemo.net.connect(nodeAddr)
```

连接到指定的 LemoChain 节点

##### Parameters

1. `string` - 节点 ID 和 IP 地址

##### Returns

`Promise` - 无返回数据

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

断开与指定 LemoChain 节点的连接

##### Parameters

1. `string` - ip 地址

##### Returns

`Promise` - 通过`then`可以获取到断开连接是否成功

##### Example

```js
lemo.net.disconnect('127.0.0.1:60002').then(function(success) {
    console.log(sucess ? 'success' : 'fail')
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
    console.log(connections)
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

获取已建立的连接数

##### Parameters

无

##### Returns

`Promise` - 通过`then`可以获取到连接数

##### Example

```js
lemo.net.getConnectionsCount().then(function(count) {
    console.log(count) // "1"
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
    console.log(info.nodeName) // "Lemo"
    console.log(info.nodeVersion) // "1.0.0"
    console.log(info.os) // "windows-amd64"
    console.log(info.port) // "60001"
    console.log(info.runtime) // "go1.10.1"
})
```

---

<a name="submodule-net-getNodeID"></a>

#### lemo.net.getNodeID

```
lemo.net.getNodeID()
```

获取当前节点nodeID

##### Parameters

无

##### Returns

`Promise` - 通过`then`可以获取到当前节点的nodeID

##### Example

```js
lemo.net.getNodeID().then(function(info) {
    console.log(info) // "0x0e7dcd418dbe7717eb0e83162f8810a3c7725e0d386b324dc5f3ef5a27a2a83e393a193f6ab53d3a51b490adeee362357676f50eed3d188824ef1fb3af02b2d0"
})
```

---

<a name="submodule-net-connect"></a>
#### lemo.net.connect
```
lemo.net.connect()
```
连接节点

##### Parameters
无

##### Returns
无

##### Example
```js
lemo.net.connect()
```

---

<a name="submodule-net-Disconnect"></a>
#### lemo.net.Disconnect
```
lemo.net.Disconnect()
```
断开节点连接

##### Parameters
无

##### Returns
无

##### Example
```js
lemo.net.Disconnect()
```

---

<a name="submodule-net-BroadcastConfirm"></a>
#### lemo.net.BroadcastConfirm
```
lemo.net.BroadcastConfirm()
```
广播确认

##### Parameters
无

##### Returns
无

##### Example
```js
lemo.net.BroadcastConfirm()
```

---

### mine 模块 API

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
    console.log(isMining ? 'mining' : 'not mining')
})
```

---

<a name="submodule-mine-getMiner"></a>

#### lemo.mine.getMiner

```
lemo.mine.getMiner()
```

获取当前共识节点的记账收益地址，即用于接收交易 gas 的账户地址

##### Parameters

无

##### Returns

`Promise` - 通过`then`可以获取到账号地址

##### Example

```js
lemo.mine.getMiner().then(function(miner) {
    console.log(miner) // "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG"
})
```

---

### account 模块 API

<a name="submodule-account-newKeyPair"></a>

#### lemo.account.newKeyPair

```
lemo.account.newKeyPair()
```

创建新的账户地址和私钥

##### Parameters

无

##### Returns

`Promise` - 通过`then`可以获取到私钥，账号公钥和账号地址

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

获取账户余额

##### Parameters

1. `string` - 账户地址

##### Returns

`Promise` - 通过`then`可以获取到余额的`BigNumber`对象

##### Example

```js
lemo.account.getBalance('Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34').then(function(balance) {
    console.log(balance.toString(10)) // "1600000000000000000000000000"
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
lemo.account.getAccount('Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34').then(function(account) {
    console.log(account.balance.toMoney()) // "1600000000 LEMO"
})
```

---

<a name="submodule-account-getCandidateInfo"></a>
#### lemo.account.getCandidateInfo
```
lemo.account.getCandidateInfo(address)
```
获取候选人信息

##### Parameters
1. `string` - 候选人账户地址

##### Returns
`Promise` - 通过`then`可以获取到候选人信息，即[账户](#data-structure-account)中的`candidate`字段

##### Example
```js
lemo.account.getCandidateInfo('Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34')
    .then(function(candidate) {
        console.log(candidate.votes); // "1599999000"
    })
```

---

<a name="submodule-account-getVoteFor"></a>
#### lemo.account.getVoteFor
```
lemo.account.getVoteFor(address)
```
获取当前账户的投票地址

##### Parameters
1. `string` - 账户地址

##### Returns
`Promise` - 通过`then`可以获取到当前账户所投票的地址

##### Example
```js
lemo.account.getVoteFor('Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG')
    .then(function(info) {
        console.log(info); // "Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG"
    })
```

---

<a name="submodule-account-getAssetEquity"></a>
#### lemo.account.getAssetEquity
```
lemo.account.getAssetEquity(address, assetId)
```
获取账号的收益情况

##### Parameters
1. `string` - 账户地址
2. `string` - 资产id

##### Returns
`Promise` - 通过`then`可以获取到当前资产的信息，包括：
    `assertCode` - (string)资产code
    `assetId` - (string)资产id
    `equity` - (number)资产权益

##### Example
```js
lemo.account.getAssetEquity('Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', '0x34b04e018488f37f449193af2f24feb3b034c994cde95d30e3181403ac76528a')
    .then(function(info) {
        console.log(info.assertCode); // "0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884"
    })
```

---

<a name="submodule-account-createTempAddress"></a>
#### lemo.account.createTempAddress
```
lemo.account.createTempAddress(from, userId)
```
创建临时账户

##### Parameters
1. `string` - 创建者地址
2. `string` - 自定义的用户ID，必须是一个10字节以内的十六进制字符串

##### Returns
`string` - 临时账户地址

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
校验地址是否为临时账户

##### Parameters
1. `string` - 账户地址

##### Returns
`boolean` - 是否是临时账户

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
校验地址是否为合约账户

##### Parameters
1. `string` - 账户地址

##### Returns
`boolean` - 是否是合约账户

##### Example
```js
const result = lemo.account.isContractAddress('Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D')
console.log(result) // false
```

---

<a name="submodule-chain-getTermReward"></a>
#### lemo.getTermReward
```
lemo.getTermReward(height)
```
获取换届奖励信息

##### Parameters
1. `number` - 区块高度

##### Returns
`object` - 换届奖励信息，包括：
    `term` - (number)届数，从0开始
    `value` - (string)发放奖励的总量，单位为`mo`
    `rewardHeight` - (number)发放奖励区块的高度

##### Example
```js
lemo.account.getTermReward(1001).then(function(result){
console.log(JSON.stringify(result)) // {"term":0,"value":"1000000000","rewardHeight":10001}
})
```

---

### tx 模块 API

<a name="submodule-tx-send"></a>

#### lemo.tx.send

```
lemo.tx.send(txConfig)
```

发送已签名的交易

##### Parameters

1. `object|string` - 签名后的[交易](#data-structure-transaction)信息，可以是对象形式也可以是[`lemo.tx.sign`](#submodule-tx-sign)返回的字符串形式  
   相对于[`lemo.tx.sendTx`](#submodule-tx-sendTx)中的交易信息少了`type`、`version`字段，并多出了以下字段
    - `sig` - (string) 交易签名字段
    - `gasPayerSig` - (string) 代付gas交易签名字段

##### Returns

`Promise` - 通过`then`可以获取到交易 hash

##### Example

```js
const txInfo = {from: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG', to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34', amount: 100}
const signedTx = lemo.tx.sign('0xc21b6b2fbf230f665b936194d14da67187732bf9d28768aef1a3cbb26608f8aa', txInfo)
lemo.tx.send(signedTx).then(function(txHash) {
    console.log(txHash) //0x03fea27a8d140574dc648e1cb1a198f5ade450a347095cff7f3d961a11dac505
    })
```

---

<a name="submodule-tx-waitConfirm"></a>

#### lemo.tx.waitConfirm

```
lemo.tx.waitConfirm(txHash)
```

等待交易上链

##### Parameters

1. `string` - 交易hash

##### Returns

`Promise` - 通过`then`可以获取到交易信息

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
监听过滤区块中的交易，返回一个带有此信息的一个数组对象，得到subscribeId

##### Parameters
1. `object` - 交易筛选条件，可输入多个属性
2. `function` - 每次回调会传入过滤出来的交易数组

##### Returns
`number` - 返回subscribeId的值,可用于取消监听

##### Example
```js
lemo.tx.watchTx({to:'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY'}, function(transactions) {
    console.log(transactions[0].version)
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
停止监听过滤区块中的交易

##### Parameters
1. `number` - 得到subscribeId，用于取消监听

##### Returns
无

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

监听新的交易。在调用时会直接返回当前待打包的交易。之后会等到节点接收到新的交易再回调（1.0.0 版未实现）

##### Parameters

1. `Function` - 每次回调会传入[交易对象](#data-structure-transaction)列表

##### Returns

`number` - watchId，可用于[取消监听](#submodule-stopWatch)

##### Example

```js
lemo.watchPendingTx(true, function(transactions) {
    console.log(transactions.length)
})
```

---

### 其它 API

<a name="submodule-tool-SDK_VERSION"></a>

#### LemoCore.SDK_VERSION

```
LemoCore.SDK_VERSION
```

`string` - SDK 版本号字符串

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

[交易类型](#data-transaction-type)枚举类型，其中的值都是`number`类型

##### Example

```js
console.log(LemoCore.TxType.VOTE) // 1
```

---

<a name="submodule-global-stopWatch"></a>

#### lemo.stopWatch

```
lemo.stopWatch()
```

停止所有轮询

##### Parameters

无

##### Returns

无

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

<a name="submodule-tool-verifyAddress"></a>
#### LemoCore.verifyAddress
```
LemoCore.verifyAddress(addr)
```
校验LemoChain地址

##### Parameters
1. `string` - LemoChain地址

##### Returns
`string` - 错误字符串。如果是合法的地址，则返回空字符串

##### Example
```js
const errMsg = LemoCore.verifyAddress('LEMObw')
if (errMsg) {
    console.error(errMsg);
}
```

---

<a name="submodule-tool-moToLemo"></a>
#### LemoCore.moToLemo
```
LemoCore.moToLemo(mo)
```
将单位从mo转换为LEMO

##### Parameters
1. `string|number` - mo

##### Returns
`string` - 返回一个bigNumber类型的对象，如果输入的字符串或数字不合法，则会抛出一个异常

##### Example
```js
const result = LemoCore.moToLemo('0.1')
console.log(result.toString(10)) // '0.0000000000000000001'
```

---

<a name="submodule-tool-lemoToMo"></a>
#### LemoCore.lemoToMo
```
LemoCore.lemoToMo(ether)
```
将单位从LEMO转换为mo

##### Parameters
1. `string|number` - LEMO

##### Returns
`string` - 返回一个bigNumber类型的对象，如果输入的字符串或数字不合法，则会抛出一个异常

##### Example
```js
const result = LemoCore.lemoToMo('0.1')
console.log(result.toString(10)) // '100000000000000000'
```

---

<a name="submodule-tool-toBuffer"></a>
#### LemoCore.toBuffer
```
LemoCore.toBuffer(data)
```
将数据转换为Buffer类型

##### Parameters
1. `number|string|BigNumber|Buffer|null` - 要转换的数据

##### Returns
`Buffer` - 返回一个Buffer类型的对象，如果传入了不支持的类型，则会抛出一个异常

##### Example
```js
const result = LemoCore.toBuffer('{"value": 100}')
console.log(result.toString('hex')) // '100000000000000000'
```

---

## 开发

### 依赖

-   Node.js
-   yarn

```bash
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install yarn
```

### 编译

```bash
yarn build
```

### 测试

```bash
yarn test
```

## 开源协议

LGPL-3.0
