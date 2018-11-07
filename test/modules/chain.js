import {assert} from 'chai'
import BigNumber from 'bignumber.js'
import LemoClient from '../../lib/index'
import {testTx, currentBlock, severalChangeLogsBlock, oneChangeLogsBlock} from '../datas'

describe('chain_getCurrentBlock', () => {
    it('latestStableBlock', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getCurrentBlock(true)
        assert.deepEqual(result, currentBlock)
    })
    it('currentBlock', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getCurrentBlock(false)
        assert.deepEqual(result, currentBlock)
    })
})

describe('chain_getBlock', () => {
    it('getBlockByHash', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getBlock(testTx.hash)
        assert.equal(result, null)
    })
    it('getBlockByHeight', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getBlock(1, true)
        assert.deepEqual(result, severalChangeLogsBlock)
    })
    it('getBlock(0)', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getBlock(0)
        assert.deepEqual(result, oneChangeLogsBlock)
    })
})

describe('chain_getCurrentHeight', () => {
    it('latestStableHeight', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getCurrentHeight(true)
        assert.strictEqual(result, 13)
    })
    it('currentHeight', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getCurrentHeight(false)
        assert.strictEqual(result, 13)
    })
})

describe('chain_getGenesis', () => {
    it('getGenesis', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getGenesis()
        assert.deepEqual(result, oneChangeLogsBlock)
    })
})

describe('chain_getChainID', () => {
    it('getChainID', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getChainID()
        assert.strictEqual(result, 1)
    })
})

describe('chain_getGasPriceAdvice', () => {
    it('getGasPriceAdvice', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getGasPriceAdvice()
        assert.strictEqual(result instanceof BigNumber, true)
        assert.exists(result.toMoney)
        assert.strictEqual(result.toMoney(), '100M mo')
    })
})

describe('chain_getNodeVersion', () => {
    it('getNodeVersion', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getNodeVersion()
        assert.equal(result, '1.0.0')
    })
})

describe('chain_watchBlock', () => {
    const callback = () => {}
    it('watchBlock false', async () => {
        const lemo = new LemoClient()
        const result = lemo.watchBlock(false, callback)
        assert.equal(result, 0)
        lemo.stopWatch(false, callback)
    })
    it('watchBlock true', () => {
        const lemo = new LemoClient()
        const result = lemo.watchBlock(true, callback)
        assert.equal(result, 0)
        lemo.stopWatch(false, callback)
    })
    it('watchBlock id++', () => {
        function getId() {
            const id = lemo.watchBlock(true, callback)
            return id
        }
        const lemo = new LemoClient()
        for (let i = 0; i < 3; i++) {
            getId()
            if (i === 2) {
                assert.equal(getId(), 3)
            }
        }
        lemo.stopWatch(false, callback)
    })
})
