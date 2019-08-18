import {assert} from 'chai'
import BigNumber from 'bignumber.js'
import LemoCore from '../../lib/index'
import {miner, formatedMiner} from '../datas'
import '../mock'
import errors from '../../lib/errors'

describe('module_account_getAccount', () => {
    it('account with miner balance', async () => {
        const lemo = new LemoCore()
        const result = await lemo.account.getAccount(miner.address)
        assert.deepEqual(result, formatedMiner)
    })
    it('account with special balance', async () => {
        const lemo = new LemoCore()
        lemo.account.getAccount('0x015780F8456F9c1532645087a19DcF9a7e0c7F97').catch(e => {
            assert.equal(e.message, errors.InvalidAddress('0x015780F8456F9c1532645087a19DcF9a7e0c7F97'))
        })
    })

    it('account is empty', async () => {
        const lemo = new LemoCore()
        lemo.account.getAccount('').catch(e => {
            assert.equal(e.message, errors.InvalidAddress(''))
        })
    })
})

describe('module_account_getCandidateInfo', () => {
    it('candidate', async () => {
        const lemo = new LemoCore()
        const result = await lemo.account.getCandidateInfo(miner.address)
        assert.deepEqual(result, formatedMiner.candidate)
    })
    it('not candidate', async () => {
        const lemo = new LemoCore()
        const result = await lemo.account.getCandidateInfo('Lemo846Q4NQCKJ2YWY6GHTSQHC7K24JDC7CPCWYH')
        assert.equal(result, undefined)
    })
    it('error candidate', () => {
        const lemo = new LemoCore()
        lemo.account.getCandidateInfo('0x015780F8456F9c1532645087a19DcF9a7e0c7F97').catch(e => {
            assert.equal(e.message, errors.InvalidAddress('0x015780F8456F9c1532645087a19DcF9a7e0c7F97'))
        })
    })
})

describe('module_account_getBalance', () => {
    it('no-balance', async () => {
        const lemo = new LemoCore()
        const result = await lemo.account.getBalance('Lemo846Q4NQCKJ2YWY6GHTSQHC7K24JDC7CPCWYH')
        assert.strictEqual(result instanceof BigNumber, true)
        assert.exists(result.toMoney)
        assert.strictEqual(result.toMoney(), '0 LEMO')
    })
    it('balance', async () => {
        const lemo = new LemoCore()
        const result = await lemo.account.getBalance('Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG')
        assert.strictEqual(result instanceof BigNumber, true)
        assert.exists(result.toMoney)
        assert.strictEqual(result.toMoney(), '1599999999.9999999999999999 LEMO')
    })
    it('getBalance_error', () => {
        const lemo = new LemoCore()
        lemo.account.getBalance('0x015780F8456F9c1532645087a19DcF9a7e0c7F97').catch(e => {
            assert.equal(e.message, errors.InvalidAddress('0x015780F8456F9c1532645087a19DcF9a7e0c7F97'))
        })
    })
})
