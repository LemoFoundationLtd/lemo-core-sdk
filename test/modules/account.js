import {assert} from 'chai'
import LemoCore from '../../lib/index'
import {miner, formatedMiner, equities} from '../datas'
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
        const addr = '0x015780F8456F9c1532645087a19DcF9a7e0c7F97'
        const expectedErr = errors.InvalidAddress(addr)
        return lemo.account.getAccount(addr).then(() => {
            assert.fail('success', `throw error: ${expectedErr}`)
        }, e => {
            return assert.equal(e.message, expectedErr)
        })
    })

    it('account is empty', async () => {
        const lemo = new LemoCore()
        const addr = ''
        const expectedErr = errors.InvalidAddress(addr)
        return lemo.account.getAccount(addr).then(() => {
            assert.fail('success', `throw error: ${expectedErr}`)
        }, e => {
            return assert.equal(e.message, expectedErr)
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
        const addr = '0x015780F8456F9c1532645087a19DcF9a7e0c7F97'
        const expectedErr = errors.InvalidAddress(addr)
        return lemo.account.getCandidateInfo(addr).then(() => {
            assert.fail('success', `throw error: ${expectedErr}`)
        }, e => {
            return assert.equal(e.message, expectedErr)
        })
    })
})

describe('module_account_getBalance', () => {
    it('no-balance', async () => {
        const lemo = new LemoCore()
        const result = await lemo.account.getBalance('Lemo846Q4NQCKJ2YWY6GHTSQHC7K24JDC7CPCWYH')
        assert.strictEqual(result, '0')
    })
    it('balance', async () => {
        const lemo = new LemoCore()
        const result = await lemo.account.getBalance('Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG')
        assert.equal(result, '1599999999999999999999999900')
    })
    it('getBalance_error', () => {
        const lemo = new LemoCore()
        const addr = '0x015780F8456F9c1532645087a19DcF9a7e0c7F97'
        assert.throws(() => {
            lemo.account.getBalance(addr)
        }, errors.InvalidAddress(addr))
    })
})

describe('module_account_getVoteFor', () => {
    it('no-vote', async () => {
        const lemo = new LemoCore()
        const result = await lemo.account.getVoteFor('Lemo83DZ5J99JSK5ZH89TCW7T6ZZCWJ8H7FDGA7W')
        assert.strictEqual(result, 'Lemo888888888888888888888888888888888888')
    })
    it('no-address', async () => {
        const lemo = new LemoCore()
        assert.throws(() => {
            lemo.account.getVoteFor('')
        }, errors.InvalidAddress(''))
    })
    it('normal', async () => {
        const lemo = new LemoCore()
        const result = await lemo.account.getVoteFor('Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG')
        assert.strictEqual(result, miner.voteFor)
    })
})

describe('module_account_getAssetEquity', () => {
    it('no-assetId', async () => {
        const lemo = new LemoCore()
        assert.throws(() => {
            lemo.account.getAssetEquity('Lemo83DZ5J99JSK5ZH89TCW7T6ZZCWJ8H7FDGA7W', '')
        }, errors.InvalidNoAssetId())
    })
    it('normal', async () => {
        const lemo = new LemoCore()
        const result = await lemo.account.getAssetEquity('Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', '0x34b04e018488f37f449193af2f24feb3b034c994cde95d30e3181403ac76528a')
        assert.deepEqual(result, equities[0])
    })
    it('no-equity', async () => {
        const lemo = new LemoCore()
        const result = await lemo.account.getAssetEquity('Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24F', '0x34b04e018488f37f449193af2f24feb3b034c994cde95d30e3181403ac76528a')
        assert.strictEqual(result.assertCode, '0x0000000000000000000000000000000000000000000000000000000000000000')
    })
})
