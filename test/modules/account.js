import {assert} from 'chai'
import BigNumber from 'bignumber.js'
import LemoCore from '../../lib/index'
import {
    chainID,
    miner,
    formatedMiner,
    testAddr,
} from '../datas'

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

describe('module_account_newKeyPair', () => {
    it('newKeyPair', () => {
        const lemo = new LemoCore()
        const account = lemo.account.newKeyPair()
        assert.exists(account.privateKey)
        assert.exists(account.address)
    })
})

describe('module_account_createTempAddress', () => {
    const tests = [
        {input: '0123456789', output: 'Lemo85SY56SGRTQQ63A2Y5ZWBBBGYT3CACBY6AB8'},
        {input: '1231234', output: 'Lemo85SY56SGRTQQ63A2Y48GBNF7ND5BWZRPW9Z3'},
        {input: 'mmsajfoa', output: 'Lemo85SY56SGRTQQ63A2Y48GCTPB294KJBF4AJD3'},
        {input: '0x123wq213', output: 'Lemo85SY56SGRTQQ63A2Y68732H8Y6PJWCCKKSA3'},
        {input: '测试', output: 'Lemo85SY56SGRTQQ63A2Y48GBNCS79CBNPK8Y7TN'},
        {input: 'sanff,da', output: 'Lemo85SY56SGRTQQ63A2Y48GCYCJZKHF3JW4R7C2'},
        {input: 213545, output: 'Lemo85SY56SGRTQQ63A2Y48GBNCRGJC85HPB87RW'},
        {input: [1232312133], output: '', error: errors.InvalidUserId()},
        {input: ['01311111111000000000000'], output: '', error: errors.InvalidUserId()},
        {input: 21352312414157567575656765623145, output: '', error: errors.TXInvalidUserIdLength()},
        {input: '01311111111000000000000', output: '', error: errors.TXInvalidUserIdLength()},
    ]
    tests.forEach(test => {
        it(`the userId is ${test.input}, length is ${test.input.length}`, () => {
            const lemo = new LemoCore({chainID})
            const userId = test.input
            if (test.error) {
                assert.throws(() => {
                    lemo.account.createTempAddress(testAddr, userId)
                }, test.error)
            } else {
                const result = lemo.account.createTempAddress(testAddr, userId)
                assert.equal(result, test.output)
            }
        })
    })
})

describe('module_account_isTempAddress', () => {
    it('account_isTempAddress_false', async () => {
        const lemo = new LemoCore({chainID})
        const result = await lemo.account.isTempAddress(testAddr)
        assert.equal(result, false)
    })
    it('account_isTempAddress_true', async () => {
        const lemo = new LemoCore({chainID})
        const userId = '032479789'
        const address = await lemo.account.createTempAddress(testAddr, userId)
        const result = await lemo.account.isTempAddress(address)
        assert.equal(result, true)
    })
})

describe('module_account_isContractAddress', () => {
    it('account_isContractAddress_false', async () => {
        const lemo = new LemoCore({chainID})
        const result = await lemo.account.isContractAddress(testAddr)
        assert.equal(result, false)
    })
    it('account_isContractAddress_true', async () => {
        const lemo = new LemoCore({chainID})
        const result = await lemo.account.isContractAddress('Lemo84PBJRWCJJ96KPN7PJ7FJZQK8743W7NK5TAD')
        assert.equal(result, true)
    })
})
