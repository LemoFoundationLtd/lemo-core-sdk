import {assert} from 'chai'
import CandidateTx from '../../../lib/tx/special_tx/candidate_tx'
import {chainID} from '../../datas'
import {TxType, NODE_ID_LENGTH, MAX_DEPUTY_HOST_LENGTH} from '../../../lib/const'
import errors from '../../../lib/errors'

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
