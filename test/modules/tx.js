import {assert} from 'chai'
import LemoTx from 'lemo-tx'
import LemoCore from '../../lib/index'
import {txInfos, chainID, testPrivate, txInfo, tx4} from '../datas'
import '../mock'
import {DEFAULT_POLL_DURATION} from '../../lib/const'
import errors from '../../lib/errors'

describe('module_tx_send', () => {
    it('sign and send', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const lemo = new LemoCore({chainID})
                const result = await lemo.tx.send(test.txConfig, testPrivate)
                assert.equal(result, test.hashAfterSign, `index=${i}`)
            }),
        )
    })
    it('send a string txConfig', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const lemo = new LemoCore({chainID})
                const result = await lemo.tx.send(JSON.stringify(test.txConfig), testPrivate)
                assert.equal(result, test.hashAfterSign, `index=${i}`)
            }),
        )
    })
    it('send a signed tx', async () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const lemo = new LemoCore({chainID})
                const tx = new LemoTx(test.txConfig)
                tx.signWith(testPrivate)
                const result = await lemo.tx.send(tx.toString())
                assert.equal(result, test.hashAfterSign, `index=${i}`)
            }),
        )
    })
    it('send a unsigned tx', () => {
        const lemo = new LemoCore({chainID})
        const tx = new LemoTx(txInfo.txConfig)
        assert.throws(() => {
            lemo.tx.send(tx.toString())
        }, errors.InvalidTxSigs())
    })
})

describe('module_tx_waitConfirm', () => {
    it('waitConfirm_narmal', async () => {
        const lemo = new LemoCore({chainID})
        const txHash = await lemo.tx.send(txInfo.txConfig, testPrivate)
        const result = await lemo.tx.waitConfirm(txHash)
        assert.equal(result.data, txInfo.data)
    })
    it('waitConfirm_timeOut', async () => {
        const lemo = new LemoCore({chainID, httpTimeOut: 1000})
        const txHash = await lemo.tx.send(tx4, testPrivate)
        const expectedErr = errors.InvalidPollTxTimeOut()
        return lemo.tx.waitConfirm(txHash).then(() => {
            assert.fail('success', `throw error: ${expectedErr}`)
        }, e => {
            return assert.equal(e.message, expectedErr)
        })
    })
})

describe('module_tx_watchTx', () => {
    it('watchTx', function itFunc(done) {
        this.timeout(DEFAULT_POLL_DURATION + 1000)
        const lemo = new LemoCore({chainID})
        const testConfig = {
            type: 0,
            version: 1,
            to: 'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY',
            toName: 'aa',
            message: 'aaa',
        }
        const watchTxId = lemo.tx.watchTx(testConfig, () => {
            lemo.tx.stopWatchTx(watchTxId)
            done()
        })
    })
})
