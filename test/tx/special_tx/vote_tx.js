import {assert} from 'chai'
import VoteTx from '../../../lib/tx/special_tx/vote_tx'
import {chainID} from '../../datas'
import {TxType} from '../../../lib/const'

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
