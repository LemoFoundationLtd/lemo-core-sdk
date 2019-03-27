import {assert} from 'chai'
import {generateAccount} from '../lib/crypto'
import Tx from '../lib/tx/tx'
import Signer from '../lib/tx/signer'
import {txInfos} from './datas'

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
