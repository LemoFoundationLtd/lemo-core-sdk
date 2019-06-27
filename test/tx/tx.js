import {assert} from 'chai'
import Tx from '../../lib/tx/tx'
import {TX_VERSION, TTTL, TX_DEFAULT_GAS_LIMIT, TX_DEFAULT_GAS_PRICE} from '../../lib/config'
import errors from '../../lib/errors'
import {testPrivate, txInfos, chainID, testAddr, emptyTxInfo} from '../datas'
import {TxType, MAX_TX_TO_NAME_LENGTH, TX_SIG_BYTE_LENGTH} from '../../lib/const'
import Signer from '../../lib/tx/signer'
import {encodeAddress} from '../../lib/crypto'

describe('Tx_new', () => {
    it('empty config', () => {
        assert.throws(() => {
            new Tx({})
        }, errors.TXInvalidChainID())
    })

    it('minimal config', () => {
        const tx = new Tx({chainID, from: testAddr})
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
        assert.deepEqual(tx.sigs, [])
        assert.deepEqual(tx.gasPayerSigs, [])
        assert.equal(tx.from, testAddr)
    })

    it('full config', () => {
        const config = {
            chainID,
            from: testAddr,
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
            sigs: ['0x0110'],
            gasPayerSigs: ['0x01011'],
        }
        const tx = new Tx(config)
        assert.equal(tx.chainID, config.chainID)
        assert.equal(tx.type, config.type)
        assert.equal(tx.version, config.version)
        assert.equal(tx.to, encodeAddress(config.to))
        assert.equal(tx.toName, config.toName)
        assert.equal(tx.gasPrice, config.gasPrice)
        assert.equal(tx.gasLimit, config.gasLimit)
        assert.equal(tx.amount, config.amount)
        assert.equal(tx.data, `0x${config.data}`)
        assert.equal(tx.expirationTime, config.expirationTime)
        assert.equal(tx.message, config.message)
        assert.deepEqual(tx.sigs, config.sigs)
        assert.deepEqual(tx.gasPayerSigs, config.gasPayerSigs)
        assert.equal(tx.from, config.from)
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
        {field: 'to', configData: '0x1', result: 'Lemo8888888888888888888888888888888888BW'},
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
        {field: 'sigs', configData: [], result: []},
        {field: 'sigs', configData: ['0'], result: ['0x0']},
        {field: 'sigs', configData: ['1'], result: ['0x1']},
        {field: 'sigs', configData: ['4294967295'], result: ['0x4294967295']},
        {field: 'sigs', configData: ['0x']},
        {field: 'sigs', configData: ['0x0']},
        {field: 'sigs', configData: ['0x1']},
        {field: 'sigs', configData: ['0xffffffff', '0x12111111']},
        {field: 'sigs', configData: 1, error: errors.TXInvalidType('sigs', 1, ['array'])},
        {field: 'sigs', configData: 'abc', error: errors.TXInvalidType('sigs', 'abc', ['array'])},
        {field: 'sigs', configData: '0xxyz', error: errors.TXInvalidType('sigs', '0xxyz', ['array'])},
        {field: 'sigs', configData: '-1', error: errors.TXInvalidType('sigs', '-1', ['array'])},
        {
            field: 'sigs',
            configData:
                ['0x10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001'],
            error: errors.TXInvalidMaxBytes(
                'sigs[0]',
                '0x10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001',
                TX_SIG_BYTE_LENGTH,
                66,
            ),
        },
        {field: 'gasPayerSigs', configData: [], result: []},
        {field: 'gasPayerSigs', configData: ['0'], result: ['0x0']},
        {field: 'gasPayerSigs', configData: ['1'], result: ['0x1']},
        {field: 'gasPayerSigs', configData: ['4294967295'], result: ['0x4294967295']},
        {field: 'gasPayerSigs', configData: ['0x']},
        {field: 'gasPayerSigs', configData: ['0x0']},
        {field: 'gasPayerSigs', configData: ['0x1']},
        {field: 'gasPayerSigs', configData: ['0xffffffff']},
        {field: 'gasPayerSigs', configData: 'abc', error: errors.TXInvalidType('gasPayerSigs', 'abc', ['array'])},
        {field: 'gasPayerSigs', configData: '0xxyz', error: errors.TXInvalidType('gasPayerSigs', '0xxyz', ['array'])},
        {field: 'gasPayerSigs', configData: '-1', error: errors.TXInvalidType('gasPayerSigs', '-1', ['array'])},
        {
            field: 'gasPayerSigs',
            configData:
                ['0x10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001'],
            error: errors.TXInvalidMaxBytes(
                'gasPayerSigs[0]',
                '0x10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001',
                TX_SIG_BYTE_LENGTH,
                66,
            ),
        },
    ]
    tests.forEach(test => {
        it(`set ${test.field} to ${JSON.stringify(test.configData)}`, () => {
            const config = {chainID, from: testAddr,  [test.field]: test.configData}
            if (test.error) {
                assert.throws(() => {
                    new Tx(config)
                }, test.error)
            } else {
                const tx = new Tx(config)
                if (typeof test.result !== 'undefined') {
                    assert.deepStrictEqual(tx[test.field], test.result)
                } else {
                    assert.deepStrictEqual(tx[test.field], test.configData)
                }
            }
        })
    })

    it('Tx_from', () => {
        const obj = {
            chainID: '1',
            expirationTime: '1541649536',
            from: testAddr,
        }
        const tx = new Tx(obj)
        tx.sig = new Signer().sign(tx, testPrivate)
        assert.equal(tx.from, obj.from)
        assert.equal(typeof tx.from, 'string')
    })
    it('Tx_no_from', () => {
        const obj = {
            chainID: '1',
            expirationTime: '1541649536',
        }
        assert.throws(() => {
            new Tx(obj)
        }, errors.TXFieldCanNotEmpty('from'))
    })
})

describe('Tx_serialize', () => {
    it('without signature', () => {
        txInfos.forEach((test, i) => {
            const tx = new Tx(test.txConfig)
            assert.equal(`0x${tx.serialize().toString('hex')}`, test.rlp, `inedx=${i}`)
        })
    })
    it('with signature', () => {
        txInfos.forEach((test, i) => {
            const tx = new Tx(test.txConfig)
            tx.signWith(testPrivate)
            assert.equal(`0x${tx.serialize().toString('hex')}`, test.rlpAfterSign, `index=${i}`)
        })
    })
})

describe('Tx_hash', () => {
    it('without signature', () => {
        txInfos.forEach((test, i) => {
            const tx = new Tx(test.txConfig)
            assert.equal(tx.hash(), test.hash, `index=${i}`)
        })
    })
    it('with signature', () => {
        txInfos.forEach((test, i) => {
            const tx = new Tx(test.txConfig)
            tx.signWith(testPrivate)
            assert.equal(tx.hash(), test.hashAfterSign, `index=${i}`)
        })
    })
})

describe('Tx_expirationTime', () => {
    it('default expiration', () => {
        const before = Math.floor(Date.now() / 1000)
        const tx = new Tx({chainID, from: testAddr})
        const after = Math.floor(Date.now() / 1000)
        assert.isAtLeast(tx.expirationTime, before + TTTL)
        assert.isAtMost(tx.expirationTime, after + TTTL)
    })
})

describe('Tx_signWith', () => {
    it('sigWith_sigs_length', () => {
        const tx = new Tx(emptyTxInfo.txConfig)
        assert.equal(emptyTxInfo.txConfig.sigs, undefined)
        tx.signWith(testPrivate)
        assert.equal(tx.sigs.length, 1)
        tx.signWith(testPrivate)
        assert.equal(tx.sigs.length, 1)
    })
})
