import {assert} from 'chai'
import LemoClient from '../../lib/index'
import {testTxs, chainID, testPrivate, withLemoAddrTestTxs} from '../datas'
import '../mock'

describe('module_tx_sendTx', () => {
    it('sendTx_with_hex_address', () => {
        return Promise.all(testTxs.map(async (test, i) => {
            const lemo = new LemoClient({chainID})
            const result = await lemo.tx.sendTx(testPrivate, test.txConfig)
            return assert.equal(result, test.hashAfterSign, `index=${i}`)
        }))
    })
    it('sendTx_with_lemo_address', () => {
        return Promise.all(withLemoAddrTestTxs.map(async (test, i) => {
            const lemo = new LemoClient({chainID})
            const result = await lemo.tx.sendTx(testPrivate, test.txConfig)
            assert.equal(result, test.hashAfterSign, `index=${i}`)
        }))
    })
})

describe('module_tx_sign_send', () => {
    it('sign_send_with_hex_address', () => {
        return Promise.all(testTxs.map(async (test, i) => {
            const lemo = new LemoClient({chainID})
            const json = await lemo.tx.sign(testPrivate, test.txConfig)
            const result = await lemo.tx.send(json)
            assert.equal(result, test.hashAfterSign, `index=${i}`)
        }))
    })
    it('sign_send_with_lemo_address', () => {
        return Promise.all(withLemoAddrTestTxs.map(async (test, i) => {
            const lemo = new LemoClient({chainID})
            const json = await lemo.tx.sign(testPrivate, test.txConfig)
            const result = await lemo.tx.send(json)
            assert.equal(result, test.hashAfterSign, `index=${i}`)
        }))
    })
})
