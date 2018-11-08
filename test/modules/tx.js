import {assert} from 'chai'
import LemoClient from '../../lib/index'
import {testTxs, testPrivate, withLemoAddrTestTxs} from '../datas'
import '../mock'

describe('module_tx_sendTx', () => {
    it('sendTx_withHx_address', async () => {
        const promises = Promise.all(
            testTxs.map(async (test, i) => {
                const lemo = new LemoClient()
                const result = await lemo.tx.sendTx(testPrivate, test.txConfig)
                return assert.equal(result, test.hashAfterSign, `index=${i}`)
            }),
        )
        return promises
    })
    it('sendTx_withlemo_address', () => {
        const promises = Promise.all(
            withLemoAddrTestTxs.map(async (test, i) => {
                const lemo = new LemoClient()
                const result = await lemo.tx.sendTx(testPrivate, test.txConfig)
                assert.equal(result, test.hashAfterSign, `index=${i}`)
            }),
        )
        return promises
    })
})

describe('module_tx_sign_send', () => {
    it('sign_send_withHx_address', () => {
        const promises = Promise.all(
            testTxs.map(async (test, i) => {
                const lemo = new LemoClient()
                const json = await lemo.tx.sign(testPrivate, test.txConfig)
                const result = await lemo.tx.send(json)
                assert.equal(result, test.hashAfterSign, `index=${i}`)
            }),
        )
        return promises
    })
    it('sign_send_withlemo_address', () => {
        const promises = Promise.all(
            withLemoAddrTestTxs.map(async (test, i) => {
                const lemo = new LemoClient()
                const json = await lemo.tx.sign(testPrivate, test.txConfig)
                const result = await lemo.tx.send(json)
                assert.equal(result, test.hashAfterSign, `index=${i}`)
            }),
        )
        return promises
    })
})
