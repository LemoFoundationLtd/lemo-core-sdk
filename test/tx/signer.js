import {assert} from 'chai'
import Tx from '../../lib/tx/tx'
import Signer from '../../lib/tx/signer';
import {parseV} from '../../lib/tx/tx_helper';
import {testPrivate, testAddr, testTxs} from '../datas'

describe('Signer_sign', () => {
    it('chainID 1', () => {
        const signer = new Signer(1)
        return Promise.all(testTxs.map(async (test, i) => {
            const tx = new Tx(test.txConfig)
            signer.sign(tx, testPrivate)
            const parsed = parseV(tx.v)
            assert.equal(parsed.type, tx.type, `index=${i}`)
            assert.equal(parsed.version, tx.version, `index=${i}`)
            assert.equal(parsed.chainID, signer.chainID, `index=${i}`)
        }))
    })

    it('chainID 100', () => {
        const signer = new Signer(100)
        return Promise.all(testTxs.map(async (test, i) => {
            const tx = new Tx(test.txConfig)
            signer.sign(tx, testPrivate)
            const parsed = parseV(tx.v)
            assert.equal(parsed.type, tx.type, `index=${i}`)
            assert.equal(parsed.version, tx.version, `index=${i}`)
            assert.equal(parsed.chainID, signer.chainID, `index=${i}`)
        }))
    })
})

describe('Signer_recover', () => {
    const signer = new Signer(1)

    it('with signature', () => {
        return Promise.all(testTxs.map(async (test, i) => {
            const tx = new Tx(test.txConfig)
            signer.sign(tx, testPrivate)
            const from = signer.recover(tx)
            assert.equal(testAddr, from, `index=${i}`)
        }))
    })
})
