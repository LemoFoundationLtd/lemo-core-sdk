import {assert} from 'chai'
import HttpConn from '../../lib/network/conn/http_conn'
import Requester from '../../lib/network/requester'

const miner = {
    address: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
    balance: '1600000000000000000000000000',
    codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    records: {
        1: {
            height: '1',
            version: '1',
        },
    },
    root: '0x0000000000000000000000000000000000000000000000000000000000000000',
}
const conn = new HttpConn()
const requester = new Requester(conn)

describe('requester_account_getAccount', () => {
    it('account_getAccount', async () => {
        const result = await requester.send('account_getAccount', [miner.address])
        assert.deepEqual(result, miner)
    })
})

describe('requester_chain_getBlockByHeight', () => {
    it('chain_getBlockByHeight', async () => {
        const result = await requester.send('chain_getBlockByHeight', [1, true])
        assert.deepEqual(result, null)
    })
})

describe('requester_sendBatch', () => {
    it('account_getAccount&chain_getBlockByHeight', async () => {
        const batchArr = [{method: 'account_getAccount', params: [miner.address]}, {method: 'chain_getBlockByHeight', params: [1, true]}]
        const batchResult = await requester.sendBatch(batchArr)
        const result = batchResult.map(item => item.result)
        assert.deepEqual(result, [miner, null])
    })
})

describe('requester_watch', () => {
    it('watch&stop', async () => {
        const result = requester.watch('account_getAccount', [miner.address], () => {})
        assert.strictEqual(result, 1)
        requester.stopWatch(result)
        const isWatchResult = requester.isWatching()
        // bug (should be false)
        assert.strictEqual(isWatchResult, false)
    })
})

describe('requester_stopAll', () => {
    it('stopAll', async () => {
        requester.watch('account_getAccount', [miner.address], () => {})
        requester.watch('chain_getBlockByHeight', [1, true], () => {})
        requester.reset()
        const result = requester.isWatching()
        assert.strictEqual(result, false)
    })
})
