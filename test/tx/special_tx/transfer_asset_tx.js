import {assert} from 'chai'
import {chainID} from '../../datas'
import {TxType, TX_ASSET_ID_LENGTH} from '../../../lib/const'
import errors from '../../../lib/errors'
import TransferAsset from '../../../lib/tx/special_tx/transfer_asset_tx'

describe('TransferAsset_new', () => {
    const minTransferAssetInfo = {
        assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
    }
    it('min config', () => {
        const tx = new TransferAsset({chainID, to: 'lemobw', toName: 'alice'}, minTransferAssetInfo)
        assert.equal(tx.type, TxType.TRANSFER_ASSET)
        assert.equal(tx.amount, 0)
        assert.equal(tx.to, 'lemobw')
        assert.equal(tx.toName, 'alice')
        assert.equal(tx.data.toString(), JSON.stringify({...minTransferAssetInfo}))
    })
    it('normal config', () => {
        const transferAssetInfo = {
            ...minTransferAssetInfo,
        }
        const tx = new TransferAsset(
            {
                chainID,
                type: TxType.TRANSFER_ASSET,
                to: 'lemobw',
                toName: 'alice',
                message: 'abc',
            },
            transferAssetInfo,
        )
        assert.equal(tx.type, TxType.TRANSFER_ASSET)
        assert.equal(tx.message, 'abc')
        assert.equal(tx.to, 'lemobw')
        assert.equal(tx.toName, 'alice')
        const result = JSON.stringify({...transferAssetInfo})
        assert.equal(tx.data.toString(), result)
    })

    // test fields
    const tests = [
        {field: 'assetId', configData: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884'},
        {field: 'assetId', configData: 123, error: errors.TXInvalidType('assetId', 123, ['string'])},
        {
            field: 'assetId',
            configData: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884aaa',
            error: errors.TXInvalidLength('assetId', '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884aaa', TX_ASSET_ID_LENGTH),
        },
    ]
    tests.forEach(test => {
        it(`set transferAssetInfo.${test.field} to ${JSON.stringify(test.configData)}`, () => {
            const transferAssetInfo = {
                ...minTransferAssetInfo,
                [test.field]: test.configData,
            }
            if (test.error) {
                assert.throws(() => {
                    new TransferAsset({chainID}, transferAssetInfo)
                }, test.error)
            } else {
                const tx = new TransferAsset({chainID}, transferAssetInfo)
                const targetField = JSON.parse(tx.data.toString())[test.field]
                assert.strictEqual(targetField, test.configData)
            }
        })
    })
})
