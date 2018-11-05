import { assert } from 'chai'
import LemoClient from '../../lib/index'
import { testTxs, testPrivate, testAddr } from '../datas'
import '../mock'

describe('module_tx_sendTx', () => {
    it('sendTx_noLEMO', () => {
        testTxs.forEach(async (test, i) => {
            const lemo = new LemoClient()
            const result = await lemo.tx.sendTx(testPrivate, test.txConfig)
            assert.equal(result, test.hashAfterSign, `index=${i}`)
        })
    })
    it('sendTx_LEMO', () => {
        testTxs.forEach(async (test, i) => {
            const lemo = new LemoClient()
            const result = await lemo.tx.sendTx(testAddr, test.txConfig)
            assert.equal(result, test.hashAfterSign, `index=${i}`)
        })
    })
})

describe('module_tx_sign_send', () => {
    it('sign_send_noLEMO', () => {
        testTxs.forEach(async (test, i) => {
            const lemo = new LemoClient()
            const json = await lemo.tx.sign(testPrivate, test.txConfig)
            const result = await lemo.tx.send(JSON.parse(json))
            assert.equal(result, test.hashAfterSign, `index=${i}`)
        })
    })
    it('sign_send_LEMO', () => {
        testTxs.forEach(async (test, i) => {
            const lemo = new LemoClient()
            const json = await lemo.tx.sign(testAddr, test.txConfig)
            const result = await lemo.tx.send(JSON.parse(json))
            assert.equal(result, test.hashAfterSign, `index=${i}`)
        })
    })
})