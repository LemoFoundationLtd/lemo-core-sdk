import {assert} from 'chai'
import BigNumber from 'bignumber.js'
import LemoClient from '../../lib/index'
import {miner, formatedMiner, formattedSpecialLemoBase, formattedNotExistLemoBase} from '../datas'

import '../mock'

describe('account_getAccount', () => {
    it('account with miner balance', async () => {
        const lemo = new LemoClient()
        const result = await lemo.account.getAccount(miner.address)

        assert.deepEqual(result, formatedMiner)
    })
    it('account with special balance', async () => {
        const lemo = new LemoClient()
        const result = await lemo.account.getAccount('0x015780F8456F9c1532645087a19DcF9a7e0c7F97')
        assert.deepEqual(result, formattedSpecialLemoBase)
    })

    it('not exist account', async () => {
        const lemo = new LemoClient()
        const result = await lemo.account.getAccount('0x1234567890123456789012345678901234567890')
        assert.deepEqual(result, formattedNotExistLemoBase)
    })
})

describe('account_getCandidateInfo', () => {
    it('candidate', async () => {
        const lemo = new LemoClient()
        const result = await lemo.account.getCandidateInfo(miner.address)

        assert.deepEqual(result, formatedMiner.candidate)
    })
    it('not candidate', async () => {
        const lemo = new LemoClient()
        const result = await lemo.account.getCandidateInfo('0x015780F8456F9c1532645087a19DcF9a7e0c7F97')
        assert.equal(result, undefined)
    })
})

describe('account_getBalance', () => {
    it('no-balance', async () => {
        const lemo = new LemoClient()
        const result = await lemo.account.getBalance('0x1234567890123456789012345678901234567890')
        assert.strictEqual(result instanceof BigNumber, true)
        assert.exists(result.toMoney)
        assert.strictEqual(result.toMoney(), '0 mo')
    })
    it('balance', async () => {
        const lemo = new LemoClient()
        const result = await lemo.account.getBalance('Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG')
        assert.strictEqual(result instanceof BigNumber, true)
        assert.exists(result.toMoney)
        assert.strictEqual(result.toMoney(), '1599999999.9999999999999999 LEMO')
    })
})
