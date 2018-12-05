import {assert} from 'chai'
import {Buffer} from 'safe-buffer';
import Tx from '../../lib/tx/tx'
import {TX_VERSION, TTTL, TX_DEFAULT_GAS_LIMIT, TX_DEFAULT_GAS_PRICE} from '../../lib/config'
import Signer from '../../lib/tx/signer';
import errors from '../../lib/errors';
import {toBuffer} from '../../lib/utils'
import {testPrivate, testTxs, chainID} from '../datas'

describe('Tx_new', () => {
    it('empty config', () => {
        const tx = new Tx({})
        assert.equal(tx.type, 0)
        assert.equal(tx.version, TX_VERSION)
        assert.equal(tx.to, '')
        assert.equal(tx.toName, '')
        assert.equal(tx.gasPrice, TX_DEFAULT_GAS_PRICE)
        assert.equal(tx.gasLimit, TX_DEFAULT_GAS_LIMIT)
        assert.equal(tx.amount, 0)
        assert.equal(tx.data, '')
        assert.equal(tx.expirationTime, Math.floor(Date.now() / 1000) + TTTL)
        assert.equal(tx.message, '')
        assert.equal(tx.r, '')
        assert.equal(tx.s, '')
        assert.equal(tx.from, '')
    })

    it('full config', () => {
        const config = {
            type: 100,
            version: 101,
            to: '102',
            toName: '103',
            gasPrice: 104,
            gasLimit: 105,
            amount: 106,
            data: '107',
            expirationTime: 108,
            message: '109',
            r: '110',
            s: '111',
        }
        const tx = new Tx(config)
        assert.equal(tx.type, config.type)
        assert.equal(tx.version, config.version)
        assert.equal(tx.to, config.to)
        assert.equal(tx.toName, config.toName)
        assert.equal(tx.gasPrice, config.gasPrice)
        assert.equal(tx.gasLimit, config.gasLimit)
        assert.equal(tx.amount, config.amount)
        assert.equal(tx.data, config.data)
        assert.equal(tx.expirationTime, config.expirationTime)
        assert.equal(tx.message, config.message)
        assert.equal(tx.r, config.r)
        assert.equal(tx.s, config.s)
        assert.equal(tx.from, '')
    })

    it('set v and type at same time', () => {
        const config = {
            type: 100,
            v: '112',
        }
        assert.throws(() => {
            new Tx(config)
        }, errors.TXVTypeConflict(config))
    })

    it('set v and version at same time', () => {
        const config = {
            version: 101,
            v: '112',
        }
        assert.throws(() => {
            new Tx(config)
        }, errors.TXVVersionConflict(config))
    })

    const tests = [
        {field: 'v', configData: 0, result: ''},
        {field: 'v', configData: ''},
        {field: 'v', configData: '0'},
        {field: 'v', configData: '1'},
        {field: 'v', configData: '4294967295'},
        {field: 'v', configData: '0x'},
        {field: 'v', configData: '0x0'},
        {field: 'v', configData: '0x1'},
        {field: 'v', configData: '0xffffffff'},
        {field: 'v', configData: toBuffer('1')},
        {field: 'v', configData: toBuffer('0xffffffff')},
        {field: 'v', configData: 1, error: errors.TXInvalidType('v', 1, ['string', Buffer])},
        {field: 'v', configData: 'abc', error: errors.TXMustBeNumber('v', 'abc')},
        {field: 'v', configData: '0xxyz', error: errors.TXMustBeNumber('v', '0xxyz')},
        {field: 'v', configData: '-1', error: errors.TXMustBeNumber('v', '-1')},
        {field: 'v', configData: '0x100000000', error: errors.TXInvalidRange('v', '0x100000000', 0, 0xffffffff)},
        {field: 'type', configData: 0},
        {field: 'type', configData: 1},
        {field: 'type', configData: 0xff},
        {field: 'type', configData: '', result: 0},
        {field: 'type', configData: '1', error: errors.TXInvalidType('type', '1', ['number'])},
        {field: 'type', configData: -1, error: errors.TXInvalidRange('type', -1, 0, 0xff)},
        {field: 'type', configData: 0x100, error: errors.TXInvalidRange('type', 0x100, 0, 0xff)},
        {field: 'version', configData: 0, result: TX_VERSION},
        {field: 'version', configData: 1},
        {field: 'version', configData: 0x7f},
        {field: 'version', configData: '', result: TX_VERSION},
        {field: 'version', configData: '1', error: errors.TXInvalidType('version', '1', ['number'])},
        {field: 'version', configData: -1, error: errors.TXInvalidRange('version', -1, 0, 0x7f)},
        {field: 'version', configData: 0x80, error: errors.TXInvalidRange('version', 0x80, 0, 0x7f)},
    ]
    tests.forEach(test => {
        it(`set ${test.field} to ${JSON.stringify(test.configData)}`, () => {
            const config = {[test.field]: test.configData}
            if (test.error) {
                assert.throws(() => {
                    new Tx(config)
                }, test.error)
            } else {
                assert.doesNotThrow(() => {
                    const tx = new Tx(config)
                    if (typeof test.result !== 'undefined') {
                        assert.strictEqual(tx[test.field], test.result)
                    } else {
                        assert.strictEqual(tx[test.field], test.configData)
                    }
                })
            }
        })
    })
})

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
