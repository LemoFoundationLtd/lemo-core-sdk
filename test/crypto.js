import {assert} from 'chai'
import {decodeAddress, encodeAddress, generateAccount} from '../lib/crypto'
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

describe('encodeAddress_decodeAddress', () => {
    const tests = {
        '0x': 'Lemo888888888888888888888888888888888888',
        '0x01': 'Lemo8888888888888888888888888888888888BW',
        '0x02': 'Lemo8888888888888888888888888888888888QR',
        '0x10': 'Lemo888888888888888888888888888888888246',
        '0x0123': 'Lemo88888888888888888888888888888888622H',
        '0x12345678901234567890': 'Lemo888888888888888888QCN9RQT745GKWS6GPA',
        '0x01c96d852165a10915ffa9c2281ef430784840f0': 'Lemo848S799HQ3KPTNSYGDF5TARS3Z8Z2ZCAH5S3',
    }
    Object.entries(tests).forEach(([hex, lemoAddr]) => {
        it(`hex_address_${hex}`, () => {
            const encoded = encodeAddress(hex)
            assert.equal(encoded, lemoAddr)
            const decoded = decodeAddress(lemoAddr)
            assert.equal(decoded, hex)
        })
    })
})
