import nock from 'nock'
import Tx from '../lib/tx/tx'
import {
    miner,
    emptyAccount,
    currentBlock,
    txsBlock,
    block0,
    testTx,
    currentHeight,
    oneChangeLogsBlock,
    chainID,
    HxGasPriceAdvice,
    nodeVersion,
    isMining,
    peersCount,
    infos,
} from './datas'

const mockInfos = [
    {
        method: 'account_getAccount',
        paramsCount: 1,
        reply(args) {
            const result = args[0] === miner.address ? miner : emptyAccount
            result.address = args[0]
            return result
        },
    },
    {
        method: 'account_getBalance',
        paramsCount: 1,
        reply(args) {
            const result = args[0] === miner.address ? miner.balance : emptyAccount.balance

            return result
        },
    },
    {
        method: 'chain_latestStableBlock',
        paramsCount: 1,
        reply() {
            return currentBlock
        },
    },
    {
        method: 'chain_currentBlock',
        paramsCount: 1,
        reply() {
            return currentBlock
        },
    },
    {
        method: 'chain_getBlockByHeight',
        paramsCount: 2,
        reply(args) {
            let result
            if (args[0] === 1 && args[1] === true) {
                result = txsBlock
            } else if (args[0] === 0) {
                result = block0
            }
            return result
        },
    },
    {
        method: 'chain_getBlockByHash',
        paramsCount: 2,
        reply(args) {
            let result
            if (args[0] === txsBlock.header.hash && args[1] === true) {
                result = txsBlock
            } else if (args[0] === testTx.hash) {
                result = null
            }
            return result
        },
    },
    {
        method: 'chain_latestStableHeight',
        paramsCount: 0,
        reply() {
            return currentHeight
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
            return oneChangeLogsBlock
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
        method: 'tx_sendTx',
        paramsCount: 1,
        reply(args) {
            const tx = new Tx(args[0])
            return `0x${tx.hash().toString('hex')}`
        },
    },
]

function startMock() {
    nock('http://127.0.0.1:8001')
        // .log(console.log)
        .post('/', body => {
            const mockInfo = mockInfos.find(info => info.method === body.method)
            return (
                body.jsonrpc === '2.0' &&
                typeof body.id === 'number' &&
                Array.isArray(body.params) &&
                mockInfo &&
                body.params.length === mockInfo.paramsCount
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
