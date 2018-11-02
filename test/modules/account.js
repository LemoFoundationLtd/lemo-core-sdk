import { assert } from 'chai'
import BigNumber from 'bignumber.js'
import LemoClient from '../../lib/index'
import { lemoBase } from '../datas'
import '../mock'

describe('account_getAccount', () => {
    it('account with balance', async () => {
        const lemo = new LemoClient()
        const result = await lemo.account.getAccount(lemoBase.address)
        assert.deepEqual(result, {
            'address': lemoBase.address,
            'balance': new BigNumber('1600000000000000000000000000'),
            'codeHash': '0x0000000000000000000000000000000000000000000000000000000000000000',
            'records': {
                'BalanceLog': {
                    'Height': 1,
                    'Version': 1,
                },
            },
            'root': '0x0000000000000000000000000000000000000000000000000000000000000000',
        })
    })

    it('not exist account', async () => {
        const lemo = new LemoClient()
        const result = await lemo.account.getAccount('0x1234567890123456789012345678901234567890')
        assert.deepEqual(result, {
            'address': '0x1234567890123456789012345678901234567890',
            'balance': new BigNumber(0),
            'codeHash': '0x0000000000000000000000000000000000000000000000000000000000000000',
            'records': {},
            'root': '0x0000000000000000000000000000000000000000000000000000000000000000',
        })
    })
})


describe('account_getBalance', () => {
    it('balance', async () => {
        const lemo = new LemoClient()
        const result = await lemo.account.getBalance('0x1234567890123456789012345678901234567890')
        assert.equal(result, 0)
    })
})