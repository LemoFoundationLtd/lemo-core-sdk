import {assert} from 'chai'
import {sign, recover, pubKeyToAddress, decodeAddress} from '../lib/crypto'
import {toBuffer} from '../lib/utils'
import {testTxs} from './datas'

const testPrivate = '0xc21b6b2fbf230f665b936194d14da67187732bf9d28768aef1a3cbb26608f8aa'
const pubKey = '0x5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0'
const pubAddress = 'Lemo3J2JD6T9GPB9F2GSG5KBP9PF5S3RDPKJ74C'

describe('crypto_recover', () => {
    it('recover', () => {
        testTxs.forEach(test => {
            const signdResult = sign(toBuffer(testPrivate), toBuffer(test.hash))
            const result = recover(test.hash, signdResult.recover, signdResult.r, signdResult.s)
            assert.strictEqual(result, null)
        })
    })
})

describe('crypto_pubKeyToAddress', () => {
    it('pubKeyToAddress', () => {
        const result = pubKeyToAddress(pubKey)
        assert.strictEqual(result, pubAddress)
    })
})

describe('crypto_decodeAddress', () => {
    it('decodeAddress1', () => {
        const result = decodeAddress(pubAddress)
        assert.strictEqual(result, '0x01654aadb57b98f21088d474d159878c363f6cb3')
    })
    it('decodeAddress2', () => {
        const result = decodeAddress('Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG')
        assert.strictEqual(result, '0x015780f8456f9c1532645087a19dcf9a7e0c7f97')
    })
})
