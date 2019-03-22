import {assert} from 'chai'
import Tx from '../../lib/tx/tx'
import Signer from '../../lib/tx/signer';
import {testPrivate, testAddr, txInfos} from '../datas'
import {generateAccount} from '../../lib/crypto';
import {TX_SIG_BYTE_LENGTH} from '../../lib/const';

describe('Signer_new', () => {
    it('chainID', () => {
        new Signer()
    })
})

describe('Signer_sign', () => {
    it('successfully sign', () => {
        const signer = new Signer()
        return Promise.all(txInfos.map(async (test, i) => {
            const tx = new Tx(test.txConfig)
            const sig = signer.sign(tx, testPrivate)
            assert.exists(sig, `index=${i}`)
            assert.equal(sig.length, TX_SIG_BYTE_LENGTH * 2 + 2, `index=${i}`)
        }))
    })
})

describe('Signer_recover', () => {
    it('sign and recover', () => {
        const signer = new Signer()
        return Promise.all(txInfos.map(async (test, i) => {
            const tx = new Tx(test.txConfig)
            tx.signWith(testPrivate)
            const from = signer.recover(tx)
            assert.equal(from, testAddr, `index=${i}`)
        }))
    })
})

describe('GenerateAccount', () => {
    it('check account', () => {
        const signer = new Signer()
        const account = generateAccount()
        return Promise.all(txInfos.map(async (test, i) => {
            const tx = new Tx(test.txConfig)
            tx.signWith(account.privateKey)
            const from = signer.recover(tx)
            assert.equal(from, account.address, `index=${i}`)
        }))
    })
})
