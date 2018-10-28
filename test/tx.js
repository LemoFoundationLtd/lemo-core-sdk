import {assert} from 'chai'
import Tx from '../lib/tx'
import {TTTL} from '../lib/config'

const testPrivate = '0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb'
const testAddr = 'Lemo36BQKCBZ2Z7B7N4G4N4SNGBT84ZZSJQD84D'
const bigNum = '0x111111111111111111111111111111111111111111111111111111111111'
const bigBytes = '222222222222222222222222222222222222222222222222222222222222'
const testDatas = [
    {
        // empty tx
        txConfig: {
            expirationTime: 1544584596,
        },
        rlp: 'ed9400000000000000000000000000000000000000008084b2d05e00831e84808080845c107d9480830200018080',
        hash: '6648a4e6c41458a3e6dc62eb380892ae966ec4b62b27fa8399780f1a99dedb4e',
        rlpAfterSign: 'f86d9400000000000000000000000000000000000000008084b2d05e00831e84808080845c107d948083020001a00425a02d5f230dbc9ea2325870de84f17bb802c2a9b7e4ec1c27874d6970fa7ea044cb0c2538e32de45980a7bc8f97805bb1bb7237b28558ae1945acce64c29fd4',
        hashAfterSign: '66eb281e9f93ffb3de4d6b10eef4ecd841eb924f4cc51d0d59042a71fb3a0544',
    },
    {
        // normal tx
        txConfig: {
            to: '0x000000000000000000000001',
            amount: 1,
            gasLimit: 100,
            gasPrice: 2,
            data: 12,
            chainId: 200,
            expirationTime: 1544584596,
            toName: 'aa',
            message: 34,
        },
        rlp: 'e89400000000000000000000000000000000000000018261610264010c845c107d9422830200c88080',
        hash: '0e1ed8d9733a08f1fcd859827f418ad78e1b402eb28813a55d31aba7d71aeea3',
        rlpAfterSign: 'f8689400000000000000000000000000000000000000018261610264010c845c107d9422830300c8a0158b80d695e7d543ddb3ae09ed89b0fdd0c9f72b95a96e5f2b5e67a4d6d71a88a02b893b663e36f997df1e3f489b98d001cf615ee1e32b3c28ce6364f5cc681d5c',
        hashAfterSign: 'd77585b7e14ed8b1133ccb80f12ff3f89e74c1dc646f0a3fce75ac528f3d1f88',
    },
    {
        // big tx
        txConfig: {
            to: '0x1000000000000000000000000000000000000000',
            amount: bigNum,
            gasLimit: 100,
            gasPrice: bigNum,
            data: bigBytes,
            chainId: 200,
            expirationTime: 1544584596,
            toName: bigBytes,
            message: bigBytes,
        },
        rlp: 'f90119941000000000000000000000000000000000000000b83c3232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232329e111111111111111111111111111111111111111111111111111111111111649e111111111111111111111111111111111111111111111111111111111111b83c323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232845c107d94b83c323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232830200c88080',
        hash: '243dadae9b1d263b8ea2d2dd50545696c49c2dd3e6bc6d6b6aa45c5e45741d11',
        rlpAfterSign: 'f90159941000000000000000000000000000000000000000b83c3232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232329e111111111111111111111111111111111111111111111111111111111111649e111111111111111111111111111111111111111111111111111111111111b83c323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232845c107d94b83c323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232830300c8a05742441ea798525c70282af6b42bd403d8195ae81c607dfa9ae1fd065b0d7353a0430ece3407d98f5b76328b3f6c537c6f588fef58fc5d11ba8433cdc59a5f080e',
        hashAfterSign: 'a618765047fe78fe0452c30d17a0c53e1533f96f3205725d93588e0af0963616',
    },
]

describe('Tx_serialize', () => {
    it('without signature', async () => {
        testDatas.forEach((test, i) => {
            const tx = new Tx(test.txConfig)
            assert.equal(tx.serialize().toString('hex'), test.rlp, `index=${i}`)
        })
    })
})

describe('Tx_hash', () => {
    it('without signature', async () => {
        testDatas.forEach((test, i) => {
            const tx = new Tx(test.txConfig)
            assert.equal(tx.hash().toString('hex'), test.hash, `index=${i}`)
        })
    })
})

describe('Tx_sign', () => {
    it('with signature', async () => {
        testDatas.forEach((test, i) => {
            const tx = new Tx(test.txConfig)
            tx.sign(testPrivate)
            assert.equal(tx.serialize().toString('hex'), test.rlpAfterSign, `index=${i}`)
            assert.equal(tx.hash().toString('hex'), test.hashAfterSign, `index=${i}`)
        })
    })
})

describe('Tx_recover', () => {
    it('with signature', async () => {
        testDatas.forEach((test, i) => {
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
