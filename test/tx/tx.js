import {assert} from 'chai'
import Tx from '../../lib/tx/tx'
import {TTTL} from '../../lib/config'
import Signer from '../../lib/tx/signer';
import {testPrivate, testTxs, chainID} from '../datas'

describe('Tx_serialize', () => {
    const signer = new Signer(200)

    it('without signature', () => {
        return Promise.all(testTxs.map(async (test, i) => {
            const tx = new Tx(test.txConfig)
            assert.equal(`0x${tx.serialize().toString('hex')}`, test.rlp, `index=${i}`)
        }))
    })
    it('with signature', () => {
        return Promise.all(testTxs.map(async (test, i) => {
            const tx = new Tx(test.txConfig)
            signer.sign(tx, testPrivate)
            assert.equal(`0x${tx.serialize().toString('hex')}`, test.rlpAfterSign, `index=${i}`)
        }))
    })
})

describe('Tx_hash', () => {
    const signer = new Signer(chainID)

    it('without signature', () => {
        return Promise.all(testTxs.map(async (test, i) => {
            const tx = new Tx(test.txConfig)
            assert.equal(`0x${tx.hash().toString('hex')}`, test.hash, `index=${i}`)
        }))
    })
    it('with signature', () => {
        return Promise.all(testTxs.map(async (test, i) => {
            const tx = new Tx(test.txConfig)
            signer.sign(tx, testPrivate)
            assert.equal(`0x${tx.hash().toString('hex')}`, test.hashAfterSign, `index=${i}`)
        }))
    })
})

describe('Tx_expirationTime', () => {
    it('default expiration', () => {
        const before = Math.floor(Date.now() / 1000)
        const tx = new Tx({})
        const after = Math.floor(Date.now() / 1000)
        assert.isAtLeast(tx.expirationTime, before + TTTL)
        assert.isAtMost(tx.expirationTime, after + TTTL)
    })
})
