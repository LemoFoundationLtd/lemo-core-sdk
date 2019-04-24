import nock from 'nock'
import Tx from '../lib/tx/tx'
import {
    miner,
    emptyAccount,
    currentBlock,
    block1,
    block0,
    currentHeight,
    oneChangeLogBlock,
    chainID,
    HxGasPriceAdvice,
    nodeVersion,
    isMining,
    peersCount,
    infos,
    txRes1,
    txRes2,
    txRes3,
    txInfos,
    txList,
    candidateList,
    deputyNodes,
    equities,
    creatAsset,
    metaData,
    creatAsset1,
    metaData1,
} from './datas'

const mockInfos = [
    {
        method: 'account_getAccount',
        paramsCount: 1,
        reply([address]) {
            const result = address === miner.address ? miner : emptyAccount
            return {...result, address}
        },
    },
    {
        method: 'account_getBalance',
        paramsCount: 1,
        reply([address]) {
            return address === miner.address ? miner.balance : emptyAccount.balance
        },
    },
    {
        method: 'account_getAssetEquity',
        paramsCount: 3,
        reply([address, index, limit]) {
            let list = []
            if (address === 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D') {
                list = equities.slice(index, index + limit)
            }
            return {equities: list, total: String(list.length)}
        },
    },
    {
        method: 'account_getAsset',
        paramsCount: 1,
        reply([assetCode]) {
            const result = assetCode === creatAsset.assetCode ? creatAsset : creatAsset1
            return {...result}
        },
    },
    {
        method: 'account_getMetaData',
        paramsCount: 1,
        reply([assetId]) {
            const result = assetId === metaData.assetId ? metaData : metaData1
            return {...result}
        },
    },
    {
        method: 'chain_currentBlock',
        paramsCount: 1,
        reply([withBody]) {
            return withBody ? currentBlock : {...currentBlock, transactions: null}
        },
    },
    {
        method: 'chain_getBlockByHeight',
        paramsCount: 2,
        reply([height, withBody]) {
            let result = null
            if (height === 2) {
                result = currentBlock
            } else if (height === 1) {
                result = block1
            } else if (height === 0) {
                result = block0
            }
            if (result && !withBody) {
                result = {...result, transactions: null}
            }
            return result
        },
    },
    {
        method: 'chain_getBlockByHash',
        paramsCount: 2,
        reply([hash, withBody]) {
            let result = null
            if (hash === currentBlock.header.hash) {
                result = currentBlock
            } else if (hash === block1.header.hash) {
                result = block1
            } else if (hash === block0.header.hash) {
                result = block0
            }
            if (result && !withBody) {
                result = {...result, transactions: null}
            }
            return result
        },
    },
    {
        method: 'chain_currentHeight',
        paramsCount: 0,
        reply() {
            return currentHeight
        },
    },
    {
        method: 'chain_genesis',
        paramsCount: 0,
        reply() {
            return oneChangeLogBlock
        },
    },
    {
        method: 'chain_chainID',
        paramsCount: 0,
        reply() {
            return chainID
        },
    },
    {
        method: 'chain_gasPriceAdvice',
        paramsCount: 0,
        reply() {
            return HxGasPriceAdvice
        },
    },
    {
        method: 'chain_nodeVersion',
        paramsCount: 0,
        reply() {
            return nodeVersion
        },
    },
    {
        method: 'chain_getCandidateList',
        paramsCount: 2,
        reply([index, limit]) {
            return {
                candidateList: candidateList.slice(index, index + limit),
                total: candidateList.length,
            }
        },
    },
    {
        method: 'chain_getCandidateTop30',
        paramsCount: 0,
        reply() {
            return candidateList
        },
    },
    {
        method: 'chain_getDeputyNodeList',
        paramsCount: 0,
        reply() {
            return deputyNodes
        },
    },
    {
        method: 'mine_isMining',
        paramsCount: 0,
        reply() {
            return isMining
        },
    },
    {
        method: 'mine_miner',
        paramsCount: 0,
        reply() {
            return miner.address
        },
    },
    {
        method: 'net_peersCount',
        paramsCount: 0,
        reply() {
            return peersCount
        },
    },
    {
        method: 'net_info',
        paramsCount: 0,
        reply() {
            return infos
        },
    },
    {
        method: 'tx_getTxByHash',
        paramsCount: 1,
        reply([hash]) {
            const txIndex = txInfos.findIndex(item => {
                return item.hashAfterSign === hash
            })
            const arr = [txRes1, txRes2, txRes3]
            return txIndex !== -1 ? arr[txIndex] : null
        },
    },
    {
        method: 'tx_getTxListByAddress',
        paramsCount: 3,
        reply([address, index, limit]) {
            let list = []
            if (address === 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D') {
                list = txList.slice(index, index + limit)
            }
            return {txList: list, total: String(list.length)}
        },
    },
    {
        method: 'tx_sendTx',
        paramsCount: 1,
        reply([txConfig]) {
            return new Tx(txConfig).hash()
        },
    },
]

function startMock() {
    nock('http://127.0.0.1:8001')
        // .log(console.log)
        .post('/', body => {
            const mockInfo = mockInfos.find(info => info.method === body.method)
            return (
                body.jsonrpc === '2.0'
                && typeof body.id === 'number'
                && Array.isArray(body.params)
                && mockInfo
                && body.params.length === mockInfo.paramsCount
            )
        })
        .times(10000000000)
        .reply((uri, body) => {
            const mockInfo = mockInfos.find(info => info.method === body.method)
            const result = mockInfo.reply(body.params)
            return [
                200,
                {
                    jsonrpc: '2.0',
                    id: 123,
                    result,
                },
            ]
        })
}

startMock()
