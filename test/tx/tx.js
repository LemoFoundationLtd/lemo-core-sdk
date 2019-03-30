import {assert} from 'chai'
import {Buffer} from 'safe-buffer'
import Tx from '../../lib/tx/tx'
import VoteTx from '../../lib/tx/vote_tx'
import CandidateTx from '../../lib/tx/candidate_tx'
import {TX_VERSION, TTTL, TX_DEFAULT_GAS_LIMIT, TX_DEFAULT_GAS_PRICE} from '../../lib/config'
import errors from '../../lib/errors'
import {toBuffer} from '../../lib/utils'
import {testPrivate, txInfos, chainID, currentBlock} from '../datas'
import {TxType, MAX_TX_TO_NAME_LENGTH, TX_SIG_BYTE_LENGTH, NODE_ID_LENGTH, MAX_DEPUTY_HOST_LENGTH} from '../../lib/const'

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
            configData: '0x10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001',
            error: errors.TXInvalidMaxBytes('sig', '0x10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001', TX_SIG_BYTE_LENGTH, 66),
        }, {
            field: 'sig',
            configData: Buffer.from('100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001', 'hex'),
            error: errors.TXInvalidMaxBytes('sig', Buffer.from('100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001', 'hex'), TX_SIG_BYTE_LENGTH, 66),
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
            sig: '0xd9a9f9f41ea020185a6480fe6938d776f0a675d89057c071fc890e09742a4dd96edb9d48c9978c2f12fbde0d0445f2ff5f08a448b91469511c663567d0b015f601',
            hash: '0x314f1b9c8585e53446983e68fdbf6642e00e5b58cfde9165fdec051cfb21d157',
        }
        const tx = new Tx(obj)
        assert.equal(tx.from, 'Lemo83KSJQYTFYD5Q4CKNZNTAK3ND9DG4NFK9HJ6')
        assert.equal(typeof tx.from, 'string')
        assert.throws(() => {
            tx.from = 'sdafacaggg'
            console.log(tx.from)
        }, errors.TXCanNotChangeFrom())
    });
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

describe('VoteTx_new', () => {
    it('empty config', () => {
        const tx = new VoteTx({chainID})
        assert.equal(tx.type, TxType.VOTE)
        assert.equal(tx.amount, 0)
        assert.equal(tx.data, '')
    })
    it('useless config', () => {
        const tx = new VoteTx({
            chainID,
            type: 100,
            amount: 101,
            data: '102',
        })
        assert.equal(tx.type, TxType.VOTE)
        assert.equal(tx.amount, 0)
        assert.equal(tx.data, '')
    })
    it('useful config', () => {
        const tx = new VoteTx({
            chainID,
            type: TxType.VOTE,
            to: 'lemobw',
        })
        assert.equal(tx.type, TxType.VOTE)
        assert.equal(tx.to, 'lemobw')
    })
})

describe('CandidateTx_new', () => {
    const minCandidateInfo = {
        minerAddress: 'lemobw',
        nodeID: '5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
        host: 'a.com',
        port: 7001,
    }
    it('min config', () => {
        const tx = new CandidateTx({chainID}, minCandidateInfo)
        assert.equal(tx.type, TxType.CANDIDATE)
        assert.equal(tx.to, '')
        assert.equal(tx.toName, '')
        assert.equal(tx.amount, 0)
        assert.equal(tx.data.toString(), JSON.stringify({isCandidate: 'true', ...minCandidateInfo}))
    })
    it('useless config', () => {
        const tx = new CandidateTx(
            {
                chainID,
                type: 100,
                to: 'lemobw',
                toName: 'alice',
                amount: 101,
                data: '102',
            },
            minCandidateInfo,
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
            ...minCandidateInfo,
        }
        const tx = new CandidateTx(
            {
                chainID,
                type: TxType.CANDIDATE,
                message: 'abc',
            },
            candidateInfo,
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
                '5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
        },
        {field: 'host', configData: 'aaa'},
        {
            field: 'host',
            configData:
                'aaaaaa0755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
            error: errors.TXInvalidMaxLength(
                'host',
                'aaaaaa0755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
                MAX_DEPUTY_HOST_LENGTH,
            ),
        },
        {field: 'port', configData: '1'},
        {field: 'port', configData: 0, error: errors.TXInvalidRange('port', 0, 1, 0xffff)},
        {field: 'port', configData: '0xfffff', error: errors.TXInvalidRange('port', '0xfffff', 1, 0xffff)},
        {field: 'port', configData: ['0xff'], error: errors.TXInvalidType('port', ['0xff'], ['string', 'number'])},
    ]
    tests.forEach(test => {
        it(`set candidateInfo.${test.field} to ${JSON.stringify(test.configData)}`, () => {
            const candidateInfo = {
                ...minCandidateInfo,
                [test.field]: test.configData,
            }
            if (test.error) {
                assert.throws(() => {
                    new CandidateTx({chainID}, candidateInfo)
                }, test.error)
            } else {
                const tx = new CandidateTx({chainID}, candidateInfo)
                const targetField = JSON.parse(tx.data.toString())[test.field]
                if (typeof test.result !== 'undefined') {
                    assert.strictEqual(targetField, test.result)
                } else {
                    assert.strictEqual(targetField, test.configData)
                }
            }
        })
    })
})
