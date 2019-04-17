import {assert} from 'chai'
import {chainID} from '../../datas'
import {TX_ASSET_ID_LENGTH, TxType} from '../../../lib/const'
import errors from '../../../lib/errors'
import ReplenishAssetTX from '../../../lib/tx/special_tx/replenish_asset_tx'

describe('replenish-Asset', () => {
    // normal situation
    it('replenish_normal', () => {
        const ReplenishAssetInfo = {
            assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
            replenishAmount: '100000',
        }
        const tx = new ReplenishAssetTX(
            {
                chainID: 200,
                type: 5,
                to: '0x000000000000000000000001',
                toName: 'hello',
                message: 'abc',
            },
            ReplenishAssetInfo,
        )
        assert.equal(tx.type, TxType.REPLENISH_ASSET)
    })
    // no assetId
    it('replenish_noassetId', () => {
        const replenishAssetInfo = {
            replenishAmount: '100000',
        }
        assert.throws(() => {
            new ReplenishAssetTX({chainID, to: 'lemobw', toName: 'alice'}, replenishAssetInfo)
        }, errors.TXInvalidType('assetId', undefined, ['string']))
    })
    // error assetId
    it('assetId_length_error', () => {
        const replenishAssetInfo = {
            assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a',
            replenishAmount: '100000',
        }
        assert.throws(() => {
            new ReplenishAssetTX({chainID, type: 5, to: '0x1110000000001'}, replenishAssetInfo)
        }, errors.TXInvalidLength('assetId', replenishAssetInfo.assetId, TX_ASSET_ID_LENGTH))
    })
    // no replenishAmount
    it('replenish_noreplenishAmount', () => {
        const replenishAssetInfo = {
            assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
        }
        assert.throws(() => {
            new ReplenishAssetTX({chainID, to: 'lemobw', toName: 'alice'}, replenishAssetInfo)
        }, errors.TXInvalidType('replenishAmount', undefined, ['number', 'string']))
    })
})

describe('replenishAmount', () => {
    const tests = [
        {field: 'replenishAmount', configData: '10001'},
        {field: 'replenishAmount', configData: '-0.11', error: errors.TXMustBeNumber('replenishAmount', '-0.11')},
        {field: 'replenishAmount', configData: '-abcd', error: errors.TXMustBeNumber('replenishAmount', '-abcd')},
        {field: 'replenishAmount', configData: '-0x100001', error: errors.TXMustBeNumber('replenishAmount', '-0x100001')},
        {field: 'replenishAmount', configData: -999, error: errors.TXNegativeError('replenishAmount')},
    ]
    tests.forEach(test => {
        it(`replenishAmount test is ${test.configData}`, () => {
            const replenishAssetInfo = {
                assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
                [test.field]: test.configData,
            }
            if (test.error) {
                assert.throws(() => {
                    new ReplenishAssetTX({chainID, to: 'lemobw', toName: 'alice'}, replenishAssetInfo)
                }, test.error)
            } else {
                const tx = new ReplenishAssetTX({chainID, to: 'lemobw', toName: 'alice'}, replenishAssetInfo)
                const targetField = test.profile ? JSON.parse(tx.data.toString()).profile[test.field] : JSON.parse(tx.data.toString())[test.field]
                assert.strictEqual(targetField, test.configData)
            }
        });
    })
})
