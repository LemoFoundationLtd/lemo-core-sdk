import {assert} from 'chai'
import BigNumber from 'bignumber.js'
import LemoClient from '../../lib/index'
import {
    chainID,
    formattedCurrentBlock,
    formattedOneChangeLogBlock,
    formattedBlock0,
    formattedBlock1,
    currentHeight,
    formattedCandidateListRes,
    deputyNodes,
} from '../datas'
import '../mock'
import {DEFAULT_POLL_DURATION} from '../../lib/config'

describe('module_chain_getCurrentBlock', () => {
    it('latestStableBlock with body', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getCurrentBlock(true, true)
        assert.deepEqual(result, formattedCurrentBlock)
    })
    it('latestStableBlock without body', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getCurrentBlock(true, false)
        assert.deepEqual(result, {header: formattedCurrentBlock.header})
    })
    it('formattedCurrentBlock with body', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getCurrentBlock(false, true)
        assert.deepEqual(result, formattedCurrentBlock)
    })
    it('formattedCurrentBlock without body', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getCurrentBlock(false, false)
        assert.deepEqual(result, {header: formattedCurrentBlock.header})
    })
})

describe('module_chain_getBlock', () => {
    it('getBlockByHeight with body', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getBlock(1, true)
        assert.deepEqual(result, formattedBlock1)
    })
    it('getBlockByHeight without body', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getBlock(1)
        assert.deepEqual(result, {header: formattedBlock1.header})
    })
    it('getBlockByHeight(0)', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getBlock(0)
        assert.deepEqual(result, {header: formattedBlock0.header})
    })
    it('getBlockByHash with body', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getBlock(formattedBlock1.header.hash, true)
        assert.deepEqual(result, formattedBlock1)
    })
    it('getBlockByHash without body', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getBlock(formattedBlock1.header.hash, false)
        assert.deepEqual(result, {header: formattedBlock1.header})
    })
    it('getBlockByHash not exist', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getBlock('0x1234')
        assert.equal(result, null)
    })
})

describe('module_chain_getCurrentHeight', () => {
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

describe('module_chain_getGenesis', () => {
    it('getGenesis', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getGenesis()
        assert.deepEqual(result, formattedOneChangeLogBlock)
    })
})

describe('module_chain_getChainID', () => {
    it('getChainID', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getChainID()
        assert.strictEqual(result, chainID)
    })
})

describe('module_chain_getGasPriceAdvice', () => {
    it('getGasPriceAdvice', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getGasPriceAdvice()
        assert.strictEqual(result instanceof BigNumber, true)
        assert.exists(result.toMoney)
        assert.strictEqual(result.toMoney(), '100M mo')
    })
})

describe('module_chain_getNodeVersion', () => {
    it('getNodeVersion', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getNodeVersion()
        assert.equal(result, '1.0.0')
    })
})

describe('module_chain_watchBlock', () => {
    it('watchBlock without body', function itFunc(done) {
        this.timeout(DEFAULT_POLL_DURATION + 50)

        const lemo = new LemoClient()
        lemo.watchBlock(false, block => {
            try {
                assert.deepEqual(block, {header: formattedCurrentBlock.header})
                done()
            } catch (e) {
                done(e)
            }
            lemo.stopWatch()
        })
    })
    it('watchBlock with body', function itFunc(done) {
        this.timeout(DEFAULT_POLL_DURATION + 50)

        const lemo = new LemoClient()
        lemo.watchBlock(true, block => {
            try {
                assert.deepEqual(block, formattedCurrentBlock)
                done()
            } catch (e) {
                done(e)
            }
            lemo.stopWatch()
        })
    })
})

describe('module_chain_getCandidateList', () => {
    it('got 2 candidates', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getCandidateList(0, 10)
        assert.deepEqual(result, formattedCandidateListRes)
    })
    it('got 1 candidate', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getCandidateList(0, 1)
        assert.equal(result.candidateList.length, 1)
    })
    it('got 0 candidate', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getCandidateList(0, 0)
        assert.equal(result.candidateList.length, 0)
    })
})

describe('module_chain_getCandidateTop30', () => {
    it('got 2 candidates', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getCandidateTop30()
        assert.deepEqual(result, formattedCandidateListRes.candidateList)
    })
})

describe('module_chain_getDeputyNodeList', () => {
    it('got 1 deputy nodes', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getDeputyNodeList()
        assert.deepEqual(result, deputyNodes)
    })
})
