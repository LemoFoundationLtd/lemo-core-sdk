import {assert} from 'chai'
import BigNumber from 'bignumber.js'
import LemoClient from '../../lib/index'
import {miner, formatedMiner, formatedSpecialLemoMiner, formatedNoexistLemoMiner} from '../datas'

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
        assert.deepEqual(result, formatedSpecialLemoMiner)
    })

    it('not exist account', async () => {
        const lemo = new LemoClient()
        const result = await lemo.account.getAccount('0x1234567890123456789012345678901234567890')
        assert.deepEqual(result, formatedNoexistLemoMiner)
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
        assert.strictEqual(result.toMoney(), '1599999999999999999999999900 mo')
    })
})
