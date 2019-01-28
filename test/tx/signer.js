import {assert} from 'chai'
import Tx from '../../lib/tx/tx'
import Signer from '../../lib/tx/signer';
import {parseV} from '../../lib/tx/tx_helper';
import {testPrivate, testAddr, txInfos} from '../datas'

describe('Signer_new', () => {
    it('chainID 1', () => {
        const signer = new Signer(1)
        assert.equal(signer.chainID, 1)
    })
    it('chainID 0', () => {
        assert.throws(() => {
            new Signer(0)
        }, 'ChainID should not be empty')
    })
    it('no chainID', () => {
        assert.throws(() => {
            new Signer()
        }, 'ChainID should not be empty')
    })
})

describe('Signer_sign', () => {
    it('chainID 1', () => {
        const signer = new Signer(1)
        return Promise.all(txInfos.map(async (test, i) => {
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
        return Promise.all(txInfos.map(async (test, i) => {
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
    it('successfully recover', () => {
        const signer = new Signer(1)
        return Promise.all(txInfos.map(async (test, i) => {
            const tx = new Tx(test.txConfig)
            signer.sign(tx, testPrivate)
            const from = signer.recover(tx)
            assert.equal(from, testAddr, `index=${i}`)
        }))
    })

    it('wrong chainID', () => {
        const signer = new Signer(1)
        const tx = new Tx(txInfos[0].txConfig)
        signer.sign(tx, testPrivate)
        const from = new Signer(200).recover(tx)
        assert.notEqual(from, testAddr)
    })
})
