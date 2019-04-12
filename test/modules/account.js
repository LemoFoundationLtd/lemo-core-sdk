import {assert} from 'chai'
import BigNumber from 'bignumber.js'
import LemoClient from '../../lib/index'
import {chainID, miner, formatedMiner, formattedSpecialLemoBase, formattedNotExistLemoBase, formattedEquities} from '../datas'

import '../mock'

describe('module_account_getAccount', () => {
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

describe('module_account_getCandidateInfo', () => {
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

describe('module_account_getBalance', () => {
    it('no-balance', async () => {
        const lemo = new LemoClient()
        const result = await lemo.account.getBalance('0x1234567890123456789012345678901234567890')
        assert.strictEqual(result instanceof BigNumber, true)
        assert.exists(result.toMoney)
        assert.strictEqual(result.toMoney(), '0 LEMO')
    })
    it('balance', async () => {
        const lemo = new LemoClient()
        const result = await lemo.account.getBalance('Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG')
        assert.strictEqual(result instanceof BigNumber, true)
        assert.exists(result.toMoney)
        assert.strictEqual(result.toMoney(), '1599999999.9999999999999999 LEMO')
    })
})

describe('module_account_newKeyPair', () => {
    it('newKeyPair', () => {
        const lemo = new LemoClient()
        const account = lemo.account.newKeyPair()
        assert.exists(account.privateKey)
        assert.exists(account.address)
    })
})

describe('module_account_getAssetEquityByAddress', () => {
    it('equities', async () => {
        const lemo = new LemoClient({chainID, host: '127.0.0.1:8001'})
        const result = await lemo.account.getAllAssets('Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', 0, 10)
        result.equities.forEach((item, index) => {
            assert.deepEqual(item, formattedEquities[index])
        })
        assert.equal(result.equities.length, formattedEquities.length)
        assert.equal(result.total, formattedEquities.length)
    })
    it('0 equity', async () => {
        const lemo = new LemoClient({chainID, host: '127.0.0.1:8001'})
        const result = await lemo.account.getAllAssets('Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24A', 0, 10)
        assert.equal(result.equities.length, 0)
        assert.equal(result.total, 0)
    })
    it('get from empty account', async () => {
        const lemo = new LemoClient({chainID, host: '127.0.0.1:8001'})
        const result = await lemo.account.getAllAssets('Lemobw', 0, 10)
        assert.equal(result.equities.length, 0)
        assert.equal(result.total, 0)
    })
})
