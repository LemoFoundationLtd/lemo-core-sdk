import {assert} from 'chai'
import {Buffer} from 'safe-buffer'
import Tx from '../../lib/tx/tx'
import {TX_VERSION, TTTL, TX_DEFAULT_GAS_LIMIT, TX_DEFAULT_GAS_PRICE} from '../../lib/config'
import errors from '../../lib/errors'
import {toBuffer} from '../../lib/utils'
import {testPrivate, txInfos, chainID, testAddr} from '../datas'
import {TxType, MAX_TX_TO_NAME_LENGTH, TX_SIG_BYTE_LENGTH} from '../../lib/const'
import Signer from '../../lib/tx/signer'

describe('Tx_new', () => {
    it('empty config', () => {
        assert.throws(() => {
            new Tx({})
        }, errors.TXInvalidChainID())
    })

    it('minimal config', () => {
        const tx = new Tx({chainID})
        assert.equal(tx.type, TxType.ORDINARY)
        assert.equal(tx.version, TX_VERSION)
        assert.equal(tx.chainID, chainID)
        assert.equal(tx.to, '')
        assert.equal(tx.toName, '')
        assert.equal(tx.gasPrice, TX_DEFAULT_GAS_PRICE)
        assert.equal(tx.gasLimit, TX_DEFAULT_GAS_LIMIT)
        assert.equal(tx.amount, 0)
        assert.equal(tx.data, '')
        assert.equal(tx.expirationTime, Math.floor(Date.now() / 1000) + TTTL)
        assert.equal(tx.message, '')
        assert.equal(tx.sig, '')
        assert.equal(tx.gasPayerSig, '')
        assert.equal(tx.from, '')
    })

    it('full config', () => {
        const config = {
            chainID,
            type: 100,
            version: 101,
            to: '0x102',
            toName: '103',
            gasPrice: 104,
            gasLimit: 105,
            amount: 106,
            data: '107',
            expirationTime: 108,
            message: '109',
            sig: '0x0110',
            gasPayerSig: '0x01011',
        }
        const tx = new Tx(config)
        assert.equal(tx.chainID, config.chainID)
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
        assert.equal(tx.sig, config.sig)
        assert.equal(tx.gasPayerSig, config.gasPayerSig)
        assert.throws(() => {
            console.log(tx.from)
        }, 'invalid signature')
    })

    const tests = [
        {field: 'chainID', configData: 1},
        {field: 'chainID', configData: 100},
        {field: 'chainID', configData: '10000', result: 10000},
        {field: 'chainID', configData: 'abc', error: errors.TXMustBeNumber('chainID', 'abc')},
        {field: 'chainID', configData: '', error: errors.TXInvalidChainID()},
        {field: 'chainID', configData: 0, error: errors.TXInvalidChainID()},
        {field: 'chainID', configData: '0x10000', error: errors.TXInvalidRange('chainID', '0x10000', 1, 0xffff)},
        {field: 'type', configData: 0},
        {field: 'type', configData: 1},
        {field: 'type', configData: 0xff},
        {field: 'type', configData: '', result: 0},
        {field: 'type', configData: '1', result: 1},
        {field: 'type', configData: 'abc', error: errors.TXMustBeNumber('type', 'abc')},
        {field: 'type', configData: -1, error: errors.TXInvalidRange('type', -1, 0, 0xffff)},
        {field: 'type', configData: 0x10000, error: errors.TXInvalidRange('type', 0x10000, 0, 0xffff)},
        {field: 'version', configData: 0, result: TX_VERSION},
        {field: 'version', configData: 1},
        {field: 'version', configData: 0xff},
        {field: 'version', configData: '', result: TX_VERSION},
        {field: 'version', configData: '1', result: 1},
        {field: 'version', configData: 'abc', error: errors.TXMustBeNumber('version', 'abc')},
        {field: 'version', configData: -1, error: errors.TXInvalidRange('version', -1, 0, 0xff)},
        {field: 'version', configData: 0x100, error: errors.TXInvalidRange('version', 0x100, 0, 0xff)},
        {field: 'to', configData: 0x1, error: errors.TXInvalidType('to', 0x1, ['string'])},
        {field: 'to', configData: '0x1'},
        {field: 'to', configData: 'lemobw'},
        {field: 'to', configData: 'lemob', error: errors.InvalidAddressCheckSum('lemob')},
        {
            field: 'to',
            configData: 'Lemo9A9JGWQT74H37PSB24RTH6YYHG6W3GCH3CJ8S',
            error: errors.InvalidAddressLength('Lemo9A9JGWQT74H37PSB24RTH6YYHG6W3GCH3CJ8S'),
        },
        {field: 'toName', configData: 'lemo'},
        {
            field: 'toName',
            configData: '01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
            error: errors.TXInvalidMaxLength(
                'toName',
                '01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
                MAX_TX_TO_NAME_LENGTH,
            ),
        },
        {field: 'sig', configData: 0, result: ''},
        {field: 'sig', configData: ''},
        {field: 'sig', configData: '0'},
        {field: 'sig', configData: '1'},
        {field: 'sig', configData: '4294967295'},
        {field: 'sig', configData: '0x'},
        {field: 'sig', configData: '0x0'},
        {field: 'sig', configData: '0x1'},
        {field: 'sig', configData: '0xffffffff'},
        {field: 'sig', configData: toBuffer('1')},
        {field: 'sig', configData: toBuffer('0xffffffff')},
        {field: 'sig', configData: 1, error: errors.TXInvalidType('sig', 1, ['string', Buffer])},
        {field: 'sig', configData: 'abc', error: errors.TXMustBeNumber('sig', 'abc')},
        {field: 'sig', configData: '0xxyz', error: errors.TXMustBeNumber('sig', '0xxyz')},
        {field: 'sig', configData: '-1', error: errors.TXMustBeNumber('sig', '-1')},
        {
            field: 'sig',
            configData:
                '0x10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001',
            error: errors.TXInvalidMaxBytes(
                'sig',
                '0x10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001',
                TX_SIG_BYTE_LENGTH,
                66,
            ),
        },
        {
            field: 'sig',
            configData: Buffer.from(
                '100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001',
                'hex',
            ),
            error: errors.TXInvalidMaxBytes(
                'sig',
                Buffer.from(
                    '100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001',
                    'hex',
                ),
                TX_SIG_BYTE_LENGTH,
                66,
            ),
        },
        {field: 'gasPayerSig', configData: 0, result: ''},
        {field: 'gasPayerSig', configData: ''},
        {field: 'gasPayerSig', configData: '0'},
        {field: 'gasPayerSig', configData: '1'},
        {field: 'gasPayerSig', configData: '4294967295'},
        {field: 'gasPayerSig', configData: '0x'},
        {field: 'gasPayerSig', configData: '0x0'},
        {field: 'gasPayerSig', configData: '0x1'},
        {field: 'gasPayerSig', configData: '0xffffffff'},
        {field: 'gasPayerSig', configData: toBuffer('1')},
        {field: 'gasPayerSig', configData: toBuffer('0xffffffff')},
        {field: 'gasPayerSig', configData: 1, error: errors.TXInvalidType('gasPayerSig', 1, ['string', Buffer])},
        {field: 'gasPayerSig', configData: 'abc', error: errors.TXMustBeNumber('gasPayerSig', 'abc')},
        {field: 'gasPayerSig', configData: '0xxyz', error: errors.TXMustBeNumber('gasPayerSig', '0xxyz')},
        {field: 'gasPayerSig', configData: '-1', error: errors.TXMustBeNumber('gasPayerSig', '-1')},
        {
            field: 'gasPayerSig',
            configData:
                '0x10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001',
            error: errors.TXInvalidMaxBytes(
                'gasPayerSig',
                '0x10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001',
                TX_SIG_BYTE_LENGTH,
                66,
            ),
        },
        {
            field: 'gasPayerSig',
            configData: Buffer.from(
                '100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001',
                'hex',
            ),
            error: errors.TXInvalidMaxBytes(
                'gasPayerSig',
                Buffer.from(
                    '100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001',
                    'hex',
                ),
                TX_SIG_BYTE_LENGTH,
                66,
            ),
        },
    ]
    tests.forEach(test => {
        it(`set ${test.field} to ${JSON.stringify(test.configData)}`, () => {
            const config = {chainID, [test.field]: test.configData}
            if (test.error) {
                assert.throws(() => {
                    new Tx(config)
                }, test.error)
            } else {
                const tx = new Tx(config)
                if (typeof test.result !== 'undefined') {
                    assert.strictEqual(tx[test.field], test.result)
                } else {
                    assert.strictEqual(tx[test.field], test.configData)
                }
            }
        })
    })

    it('Tx_from', () => {
        const obj = {
            chainID: '1',
            expirationTime: '1541649536',
        }
        const tx = new Tx(obj)
        tx.sig = new Signer().sign(tx, testPrivate)
        assert.equal(tx.from, testAddr)
        assert.equal(typeof tx.from, 'string')
        assert.throws(() => {
            tx.from = 'sdafacaggg'
            console.log(tx.from)
        }, errors.TXCanNotChangeFrom())
    })
})

describe('Tx_serialize', () => {
    it('without signature', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const tx = new Tx(test.txConfig)
                assert.equal(`0x${tx.serialize().toString('hex')}`, test.rlp, `index=${i}`)
            }),
        )
    })
    it('with signature', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const tx = new Tx(test.txConfig)
                tx.signWith(testPrivate)
                assert.equal(`0x${tx.serialize().toString('hex')}`, test.rlpAfterSign, `index=${i}`)
            }),
        )
    })
})

describe('Tx_hash', () => {
    it('without signature', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const tx = new Tx(test.txConfig)
                assert.equal(tx.hash(), test.hash, `index=${i}`)
            }),
        )
    })
    it('with signature', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const tx = new Tx(test.txConfig)
                tx.signWith(testPrivate)
                assert.equal(tx.hash(), test.hashAfterSign, `index=${i}`)
            }),
        )
    })
})

describe('Tx_expirationTime', () => {
    it('default expiration', () => {
        const before = Math.floor(Date.now() / 1000)
        const tx = new Tx({chainID})
        const after = Math.floor(Date.now() / 1000)
        assert.isAtLeast(tx.expirationTime, before + TTTL)
        assert.isAtMost(tx.expirationTime, after + TTTL)
    })
})
