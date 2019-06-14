import {assert} from 'chai'
import {chainID, from} from '../../datas'
import {TxType, TX_ASSET_ID_LENGTH} from '../../../lib/const'
import {decodeUtf8Hex} from '../../../lib/utils'
import errors from '../../../lib/errors'
import TransferAssetTx from '../../../lib/tx/special_tx/transfer_asset_tx'

describe('TransferAsset_new', () => {
    it('min config', () => {
        const transferAssetInfo = {
            assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
            transferAmount: '110000',
        }
        const tx = new TransferAssetTx({chainID, to: 'lemobw', toName: 'alice', from}, transferAssetInfo)
        assert.equal(tx.type, TxType.TRANSFER_ASSET)
        assert.equal(tx.amount, 0)
        assert.equal(tx.to, 'lemobw')
        assert.equal(tx.toName, 'alice')
        assert.equal(decodeUtf8Hex(tx.data), JSON.stringify({...transferAssetInfo}))
    })
    it('miss config.assetId', () => {
        const transferAssetInfo = {
            transferAmount: '110000',
        }
        assert.throws(() => {
            new TransferAssetTx({chainID, to: 'lemobw', toName: 'alice'}, transferAssetInfo)
        }, errors.TXParamMissingError('assetId'))
    })
    it('normal config', () => {
        const transferAssetInfo = {
            assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
            transferAmount: '110000',
        }
        const tx = new TransferAssetTx(
            {
                chainID,
                from,
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
        assert.equal(decodeUtf8Hex(tx.data), result)
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
                [test.field]: test.configData,
                transferAmount: '110000',
            }
            if (test.error) {
                assert.throws(() => {
                    new TransferAssetTx({chainID, from}, transferAssetInfo)
                }, test.error)
            } else {
                const tx = new TransferAssetTx({chainID, from}, transferAssetInfo)
                const targetField = JSON.parse(decodeUtf8Hex(tx.data))[test.field]
                assert.strictEqual(targetField, test.configData)
            }
        })
    })
})

describe('test fields is transferAssetInfo', () => {
    // test fields
    const tests = [
        {field: 'transferAmount', configData: '0x1001'},
        {field: 'transferAmount', configData: '10000'},
        {field: 'transferAmount', configData: 123, error: errors.TXInvalidType('transferAmount', 123, ['string'])},
        {field: 'transferAmount', configData: '0xabcdrfg', error: errors.TXMustBeNumber('transferAmount', '0xabcdrfg')},
    ]
    tests.forEach(test => {
        it(`set transferAssetInfo.${test.field} to ${JSON.stringify(test.configData)}`, () => {
            const transferAssetInfo = {
                assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
                [test.field]: test.configData,
            }
            if (test.error) {
                assert.throws(() => {
                    new TransferAssetTx({chainID, from}, transferAssetInfo)
                }, test.error)
            } else {
                const tx = new TransferAssetTx({chainID, from}, transferAssetInfo)
                const targetField = JSON.parse(decodeUtf8Hex(tx.data))[test.field]
                assert.strictEqual(targetField, test.configData)
            }
        })
    })
})
