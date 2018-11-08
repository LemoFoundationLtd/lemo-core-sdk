import {assert} from 'chai'
import BigNumber from 'bignumber.js'
import LemoClient from '../../lib/index'
import {miner} from '../datas'
import '../mock'

describe('account_getAccount', () => {
    it('account with miner balance', async () => {
        const lemo = new LemoClient()
        const result = await lemo.account.getAccount(miner.address)
        console.log(result.balance.toString(10))
        assert.deepEqual(result, {
            address: miner.address,
            balance: new BigNumber('1600000000000000076235669504'),
            codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            records: {
                BalanceLog: {
                    height: '1',
                    version: '3',
                },
            },
            root: '0x0000000000000000000000000000000000000000000000000000000000000000',
        })
    })
    it('account with special balance', async () => {
        const lemo = new LemoClient()
        const result = await lemo.account.getAccount('0x015780F8456F9c1532645087a19DcF9a7e0c7F97')
        assert.deepEqual(result, {
            address: '0x015780F8456F9c1532645087a19DcF9a7e0c7F97',
            balance: new BigNumber(0),
            codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            records: {},
            root: '0x0000000000000000000000000000000000000000000000000000000000000000',
        })
    })

    it('not exist account', async () => {
        const lemo = new LemoClient()
        const result = await lemo.account.getAccount('0x1234567890123456789012345678901234567890')
        assert.deepEqual(result, {
            address: '0x1234567890123456789012345678901234567890',
            balance: new BigNumber(0),
            codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            records: {},
            root: '0x0000000000000000000000000000000000000000000000000000000000000000',
        })
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
        assert.strictEqual(result.toMoney(), '1600000000 LEMO')
    })
})
