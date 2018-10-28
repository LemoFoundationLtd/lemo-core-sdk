import {assert} from 'chai'
import Tx from '../lib/tx'
import {TTTL} from '../lib/config'
import {testPrivate, testAddr, testTxs} from './datas'

describe('Tx_serialize', () => {
    it('without signature', async () => {
        testTxs.forEach((test, i) => {
            const tx = new Tx(test.txConfig)
            assert.equal(`0x${tx.serialize().toString('hex')}`, test.rlp, `index=${i}`)
        })
    })
})

describe('Tx_hash', () => {
    it('without signature', async () => {
        testTxs.forEach((test, i) => {
            const tx = new Tx(test.txConfig)
            assert.equal(`0x${tx.hash().toString('hex')}`, test.hash, `index=${i}`)
        })
    })
})

describe('Tx_sign', () => {
    it('with signature', async () => {
        testTxs.forEach((test, i) => {
            const tx = new Tx(test.txConfig)
            tx.sign(testPrivate)
            assert.equal(`0x${tx.serialize().toString('hex')}`, test.rlpAfterSign, `index=${i}`)
            assert.equal(`0x${tx.hash().toString('hex')}`, test.hashAfterSign, `index=${i}`)
        })
    })
})

describe('Tx_recover', () => {
    it('with signature', async () => {
        testTxs.forEach((test, i) => {
            const tx = new Tx(test.txConfig)
            tx.sign(testPrivate)
            assert.equal(tx.recover(), testAddr, `index=${i}`)
        })
    })
})

describe('Tx_expirationTime', () => {
    it('default expiration', async () => {
        const before = Math.floor(Date.now() / 1000)
        const tx = new Tx({})
        const after = Math.floor(Date.now() / 1000)
        assert.isAtLeast(tx.expirationTime, before + TTTL)
        assert.isAtMost(tx.expirationTime, after + TTTL)
    })
})
