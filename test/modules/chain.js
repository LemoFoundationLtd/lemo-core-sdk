import {assert} from 'chai'
import BigNumber from 'bignumber.js'
import LemoClient from '../../lib/index'
import {chainID, currentBlock, oneChangeLogsBlock, block0, formatBlock, currentHeight} from '../datas'
import '../mock'
import {POLL_DURATION} from '../../lib/config'

describe('chain_getCurrentBlock', () => {
    it('latestStableBlock with body', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getCurrentBlock(true, true)
        assert.deepEqual(result, currentBlock)
    })
    it('latestStableBlock without body', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getCurrentBlock(true, false)
        assert.deepEqual(result, {...currentBlock, transactions: null})
    })
    it('currentBlock with body', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getCurrentBlock(false, true)
        assert.deepEqual(result, currentBlock)
    })
    it('currentBlock without body', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getCurrentBlock(false, false)
        assert.deepEqual(result, {...currentBlock, transactions: null})
    })
})

describe('chain_getBlock', () => {
    it('getBlockByHeight with body', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getBlock(1, true)
        assert.deepEqual(result, formatBlock)
    })
    it('getBlockByHeight without body', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getBlock(1)
        assert.deepEqual(result, {...formatBlock, transactions: null})
    })
    it('getBlockByHeight(0)', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getBlock(0)
        assert.deepEqual(result, block0)
    })
    it('getBlockByHash with body', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getBlock(formatBlock.header.hash, true)
        assert.deepEqual(result, formatBlock)
    })
    it('getBlockByHash without body', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getBlock(formatBlock.header.hash, false)
        assert.deepEqual(result, {...formatBlock, transactions: null})
    })
    it('getBlockByHash not exist', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getBlock('0x1234')
        assert.equal(result, null)
    })
})

describe('chain_getCurrentHeight', () => {
    it('latestStableHeight', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getCurrentHeight(true)
        assert.strictEqual(result, currentHeight)
    })
    it('currentHeight', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getCurrentHeight(false)
        assert.strictEqual(result, currentHeight)
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
        assert.strictEqual(result, chainID)
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
    it('watchBlock without body', function itFunc(done) {
        this.timeout(POLL_DURATION + 50)

        const lemo = new LemoClient()
        lemo.watchBlock(false, block => {
            try {
                assert.deepEqual(block, {...currentBlock, transactions: null})
                done()
            } catch (e) {
                done(e)
            }
            lemo.stopWatch()
        })
    })
    it('watchBlock with body', function itFunc(done) {
        this.timeout(POLL_DURATION + 50)

        const lemo = new LemoClient()
        lemo.watchBlock(true, block => {
            try {
                assert.deepEqual(block, currentBlock)
                done()
            } catch (e) {
                done(e)
            }
            lemo.stopWatch()
        })
    })
})
