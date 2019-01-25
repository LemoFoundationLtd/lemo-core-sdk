import {assert} from 'chai'
import LemoClient from '../../lib/index'
import {testTxs, chainID, testPrivate, withLemoAddrTestTxs} from '../datas'
import '../mock'
import {toBuffer} from '../../lib/utils'

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

describe('module_tx_vote', () => {
    it('sign_vote', () => {
        return Promise.all(testTxs.map(async (test, i) => {
            const lemo = new LemoClient({chainID})
            const json = await lemo.tx.signVote(testPrivate, test.txConfig)
            console.log(11, json)
            // assert.equal(result, test.hashAfterSign, `index=${i}`)
        }))
    })
})

describe('module_tx_vote', () => {
    it('sign_vote', () => {
        return Promise.all(testTxs.map(async (test, i) => {
            const lemo = new LemoClient({chainID})
            let json = lemo.tx.signVote(testPrivate, test.txConfig)
            json = JSON.parse(json)
            assert.equal(parseInt(json.v, 16) & 0x1000000, 0x1000000, `index=${i}`)
            assert.equal(json.amount, 0, `index=${i}`)
            assert.equal(json.data, undefined, `index=${i}`)
        }))
    })
})

describe('module_tx_candidate', () => {
    it('sign_candidate', () => {
        return Promise.all(testTxs.map(async (test, i) => {
            const lemo = new LemoClient({chainID})
            const candidateInfo = {
                isCandidate: true,
                minerAddress: 'Lemobw',
                nodeID: '5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
                host: '127.0.0.1',
                port: '7001',
            }
            let json = lemo.tx.signCandidate(testPrivate, test.txConfig, candidateInfo)
            json = JSON.parse(json)
            assert.equal(parseInt(json.v, 16) & 0x2000000, 0x2000000, `index=${i}`)
            const result = JSON.stringify({...candidateInfo, isCandidate: String(candidateInfo.isCandidate)})
            assert.equal(toBuffer(json.data).toString(), result, `index=${i}`)
            assert.equal(json.to, undefined, `index=${i}`)
            assert.equal(json.toName, undefined, `index=${i}`)
            assert.equal(json.amount, 0, `index=${i}`)
        }))
    })
})
