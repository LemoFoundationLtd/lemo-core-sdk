import {assert} from 'chai'
import {Buffer} from 'safe-buffer'
import Tx from '../../lib/tx/tx'
import {TX_VERSION, TTTL, TX_DEFAULT_GAS_LIMIT, TX_DEFAULT_GAS_PRICE} from '../../lib/config'
import Signer from '../../lib/tx/signer'
import errors from '../../lib/errors'
import {toBuffer} from '../../lib/utils'
import {testPrivate, txInfos, chainID} from '../datas'
import {TxType, MAX_TX_TO_NAME_LENGTH, NODE_ID_LENGTH, MAX_DEPUTY_HOST_LENGTH} from '../../lib/const'

describe('Tx_new', () => {
    it('empty config', () => {
        const tx = new Tx({})
        assert.equal(tx.type, TxType.ORDINARY)
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
            to: '0x102',
            toName: '103',
            gasPrice: 104,
            gasLimit: 105,
            amount: 106,
            data: '107',
            expirationTime: 108,
            message: '109',
            r: '110',
            s: '111'
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
            v: '112'
        }
        assert.throws(() => {
            new Tx(config)
        }, errors.TXVTypeConflict(config))
    })

    it('set v and version at same time', () => {
        const config = {
            version: 101,
            v: '112'
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
        {field: 'type', configData: '1', result: 1},
        {field: 'type', configData: -1, error: errors.TXInvalidRange('type', -1, 0, 0xff)},
        {field: 'type', configData: 0x100, error: errors.TXInvalidRange('type', 0x100, 0, 0xff)},
        {field: 'version', configData: 0, result: TX_VERSION},
        {field: 'version', configData: 1},
        {field: 'version', configData: 0x7f},
        {field: 'version', configData: '', result: TX_VERSION},
        {field: 'version', configData: '1', error: errors.TXInvalidType('version', '1', ['number'])},
        {field: 'version', configData: -1, error: errors.TXInvalidRange('version', -1, 0, 0x7f)},
        {field: 'version', configData: 0x80, error: errors.TXInvalidRange('version', 0x80, 0, 0x7f)},
        {field: 'to', configData: 0x1, error: errors.TXInvalidType('to', 0x1, ['string'])},
        {field: 'to', configData: '0x1'},
        {field: 'to', configData: 'lemobw'},
        {field: 'to', configData: 'lemob', error: errors.InvalidAddressCheckSum('lemob')},
        {field: 'toName', configData: 'lemo'},
        {
            field: 'toName',
            configData: '01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
            error: errors.TXInvalidMaxLength(
                'toName',
                '01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
                MAX_TX_TO_NAME_LENGTH
            )
        }
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
    const signer = new Signer(chainID)

    it('without signature', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const tx = new Tx(test.txConfig)
                assert.equal(`0x${tx.serialize().toString('hex')}`, test.rlp, `index=${i}`)
            })
        )
    })
    it('with signature', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const tx = new Tx(test.txConfig)
                signer.sign(tx, testPrivate)
                assert.equal(`0x${tx.serialize().toString('hex')}`, test.rlpAfterSign, `index=${i}`)
            })
        )
    })
})

describe('Tx_hash', () => {
    const signer = new Signer(chainID)

    it('without signature', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const tx = new Tx(test.txConfig)
                assert.equal(`0x${tx.hash().toString('hex')}`, test.hash, `index=${i}`)
            })
        )
    })
    it('with signature', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const tx = new Tx(test.txConfig)
                signer.sign(tx, testPrivate)
                assert.equal(`0x${tx.hash().toString('hex')}`, test.hashAfterSign, `index=${i}`)
            })
        )
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

describe('Tx_createVoteTx', () => {
    it('empty config', () => {
        const tx = Tx.createVoteTx({})
        assert.equal(tx.type, TxType.VOTE)
        assert.equal(tx.amount, 0)
        assert.equal(tx.data, '')
    })
    it('useless config', () => {
        const tx = Tx.createVoteTx({
            type: 100,
            amount: 101,
            data: '102'
        })
        assert.equal(tx.type, TxType.VOTE)
        assert.equal(tx.amount, 0)
        assert.equal(tx.data, '')
    })
    it('useful config', () => {
        const tx = Tx.createVoteTx({
            type: TxType.VOTE,
            to: 'lemobw'
        })
        assert.equal(tx.type, TxType.VOTE)
        assert.equal(tx.to, 'lemobw')
    })
})

describe('Tx_createCandidateTx', () => {
    const minCandidateInfo = {
        minerAddress: 'lemobw',
        nodeID: '5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
        host: 'a.com',
        port: 7001
    }
    it('min config', () => {
        const tx = Tx.createCandidateTx({}, minCandidateInfo)
        assert.equal(tx.type, TxType.CANDIDATE)
        assert.equal(tx.to, '')
        assert.equal(tx.toName, '')
        assert.equal(tx.amount, 0)
        assert.equal(tx.data.toString(), JSON.stringify({isCandidate: 'true', ...minCandidateInfo}))
    })
    it('useless config', () => {
        const tx = Tx.createCandidateTx(
            {
                type: 100,
                to: 'lemobw',
                toName: 'alice',
                amount: 101,
                data: '102'
            },
            minCandidateInfo
        )
        assert.equal(tx.type, TxType.CANDIDATE)
        assert.equal(tx.to, '')
        assert.equal(tx.toName, '')
        assert.equal(tx.amount, 0)
        assert.equal(tx.data.toString(), JSON.stringify({isCandidate: 'true', ...minCandidateInfo}))
    })
    it('useful config', () => {
        const candidateInfo = {
            isCandidate: false,
            ...minCandidateInfo
        }
        const tx = Tx.createCandidateTx(
            {
                type: TxType.CANDIDATE,
                message: 'abc'
            },
            candidateInfo
        )
        assert.equal(tx.type, TxType.CANDIDATE)
        assert.equal(tx.message, 'abc')
        const result = JSON.stringify({...candidateInfo, isCandidate: String(candidateInfo.isCandidate)})
        assert.equal(tx.data.toString(), result)
    })

    // test fields
    const tests = [
        {field: 'isCandidate', configData: false, result: 'false'},
        {field: 'isCandidate', configData: true, result: 'true'},
        {field: 'isCandidate', configData: 'true', error: errors.TXInvalidType('isCandidate', 'true', ['undefined', 'boolean'])},
        {field: 'minerAddress', configData: 0x1, error: errors.TXInvalidType('minerAddress', 0x1, ['string'])},
        {field: 'minerAddress', configData: '', error: errors.InvalidAddress('')},
        {field: 'minerAddress', configData: '123', error: errors.InvalidAddress('')},
        {field: 'minerAddress', configData: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG'},
        {field: 'minerAddress', configData: '0x1'},
        {field: 'nodeID', configData: '123', error: errors.TXInvalidLength('nodeID', '123', NODE_ID_LENGTH)},
        {
            field: 'nodeID',
            configData:
                '5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0'
        },
        {field: 'host', configData: 'aaa'},
        {
            field: 'host',
            configData:
                'aaaaaa0755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
            error: errors.TXInvalidMaxLength(
                'host',
                'aaaaaa0755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
                MAX_DEPUTY_HOST_LENGTH
            )
        },
        {field: 'port', configData: '1'},
        {field: 'port', configData: 0, error: errors.TXInvalidRange('port', 0, 1, 0xffff)},
        {field: 'port', configData: '0xfffff', error: errors.TXInvalidRange('port', '0xfffff', 1, 0xffff)},
        {field: 'port', configData: ['0xff'], error: errors.TXInvalidType('port', ['0xff'], ['string', 'number'])}
    ]
    tests.forEach(test => {
        it(`set candidateInfo.${test.field} to ${JSON.stringify(test.configData)}`, () => {
            const candidateInfo = {
                ...minCandidateInfo,
                [test.field]: test.configData
            }
            if (test.error) {
                assert.throws(() => {
                    Tx.createCandidateTx({}, candidateInfo)
                }, test.error)
            } else {
                assert.doesNotThrow(() => {
                    const tx = Tx.createCandidateTx({}, candidateInfo)
                    const targetField = JSON.parse(tx.data.toString())[test.field]
                    if (typeof test.result !== 'undefined') {
                        assert.strictEqual(targetField, test.result)
                    } else {
                        assert.strictEqual(targetField, test.configData)
                    }
                })
            }
        })
    })
})
