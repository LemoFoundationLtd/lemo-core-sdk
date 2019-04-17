import {assert} from 'chai'
import {chainID} from '../../datas'
import {TxType, TX_ASSET_ID_LENGTH} from '../../../lib/const'
import errors from '../../../lib/errors'
import TransferAssetTx from '../../../lib/tx/special_tx/transfer_asset_tx'

describe('TransferAsset_new', () => {
    it('min config', () => {
        const transferAssetInfo = {
            assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
        }
        const tx = new TransferAssetTx({chainID, to: 'lemobw', toName: 'alice'}, transferAssetInfo)
        assert.equal(tx.type, TxType.TRANSFER_ASSET)
        assert.equal(tx.amount, 0)
        assert.equal(tx.to, 'lemobw')
        assert.equal(tx.toName, 'alice')
        assert.equal(tx.data.toString(), JSON.stringify({...transferAssetInfo}))
    })
    it('miss config.assetId', () => {
        const transferAssetInfo = {}
        assert.throws(() => {
            new TransferAssetTx({chainID, to: 'lemobw', toName: 'alice'}, transferAssetInfo)
        }, errors.TXParamMissingError('assetId'))
    })
    it('normal config', () => {
        const transferAssetInfo = {
            assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
        }
        const tx = new TransferAssetTx(
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
})

describe('test fields', () => {
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
                [test.field]: test.configData,
            }
            if (test.error) {
                assert.throws(() => {
                    new TransferAssetTx({chainID}, transferAssetInfo)
                }, test.error)
            } else {
                const tx = new TransferAssetTx({chainID}, transferAssetInfo)
                const targetField = JSON.parse(tx.data.toString())[test.field]
                assert.strictEqual(targetField, test.configData)
            }
        })
    })
})
