import {assert} from 'chai'
import LemoClient from '../../../lib/index'
import {chainID, testAddr, testPrivate, txInfo} from '../../datas'
import BoxTx from '../../../lib/tx/special_tx/box_tx'
import {TxType} from '../../../lib/const'
import {toBuffer} from '../../../lib/utils'
import errors from '../../../lib/errors'

describe('box_tx', () => {
    // normal situation
    it('box_specialTx_normal', () => {
        const lemo = new LemoClient({chainID})
        // sign temp address
        const tempAddress = lemo.tx.signCreateTempAddress(testPrivate, txInfo.txConfig, '01234567')
        // sign vote: this method has no data
        const vote = lemo.tx.signVote(testPrivate, txInfo.txConfig)
        const subTxList = [tempAddress, vote]
        const tx = new BoxTx({chainID, from: testAddr}, subTxList)
        assert.equal(tx.type, TxType.BOX_TX)
        assert.deepEqual(JSON.parse(toBuffer(tx.data).toString()).subTxList[0].sigs, JSON.parse(subTxList[0]).sigs)
    })
    it('box_tx_params_from_error', () => {
        // one of tx error: the second tx from is error
        const subTxList = [
            {type: 0, version: '1', chainID: '200', from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', gasPrice: '3000000000', gasLimit: '2000000', amount: '0', expirationTime: '1544584596', sigs: ['0x9c9f62a8fe923c093b408141a4af6b2116969e13e09920dc789cad5b4601a9526ef9c0242520a22579385ede9a91c1480c936c35f55aed6bb0deca570a7e932101'], gasPayerSigs: []},
            {type: 0, version: '1', chainID: '200', from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJDDDDD', gasPrice: '3000000000', gasLimit: '2000000', amount: '0', expirationTime: '1544584596', sigs: ['0x9c9f62a8fe923c093b408141a4af6b2116969e13e09920dc789cad5b4601a9526ef9c0242520a22579385ede9a91c1480c936c35f55aed6bb0deca570a7e932101'], gasPayerSigs: []}]
        assert.throws(() => {
            // two sign box Tx
            new BoxTx({chainID, from: testAddr}, subTxList)
        }, errors.InvalidAddressCheckSum('Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJDDDDD'))
    })
})
