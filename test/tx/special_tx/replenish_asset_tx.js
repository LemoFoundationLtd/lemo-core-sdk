import {assert} from 'chai'
import {chainID} from '../../datas'
import {TxType} from '../../../lib/const'
import errors from '../../../lib/errors'
import ReplenishAsset from '../../../lib/tx/special_tx/replenish_asset_tx'

describe('replenish-Asset', () => {
    // normal situation
    it('replenish_normal', () => {
        const ReplenishAssetInfo = {
            assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
            replenishAmount: '100000',
        }
        const tx = new ReplenishAsset(
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
            new ReplenishAsset({chainID, to: 'lemobw', toName: 'alice'}, replenishAssetInfo)
        }, errors.TXInvalidType('assetId', undefined, ['string']))
    })
    // no replenishAmount
    it('replenish_noreplenishAmount', () => {
        const replenishAssetInfo = {
            assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
        }
        assert.throws(() => {
            new ReplenishAsset({chainID, to: 'lemobw', toName: 'alice'}, replenishAssetInfo)
        }, errors.TXInvalidType('replenishAmount', undefined, ['string']))
    })
    // error replenishAmount
    it('replenish_replenishAmount_false', () => {
        const replenishAssetInfo = {
            assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
            replenishAmount: '0.11',
        }
        assert.throws(() => {
            new ReplenishAsset({chainID, to: 'lemobw', toName: 'alice'}, replenishAssetInfo)
        }, errors.TXMustBeNumber('replenishAmount', '0.11'))
    })
})
