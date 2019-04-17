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
        }, errors.TXParamMissingError('assetId'))
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
    // replenishAmount is decimals
    it('replenish_replenishAmount_number', () => {
        const replenishAssetInfo = {
            assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
            replenishAmount: 0.11,
        }
        const result = new ReplenishAssetTX({chainID, to: 'lemobw', toName: 'alice'}, replenishAssetInfo)
        assert.equal(JSON.parse(result.data.toString()).replenishAmount, 0.11)
    })
    it('replenish_replenishAmount_false', () => {
        const replenishAssetInfo = {
            assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
            replenishAmount: '-0.11',
        }
        assert.throws(() => {
            new ReplenishAssetTX({chainID, to: 'lemobw', toName: 'alice'}, replenishAssetInfo)
        }, errors.TXMustBeNumber('replenishAmount', '-0.11'))
    })
    it('replenish_replenishAmount_hex', () => {
        const replenishAssetInfo = {
            assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
            replenishAmount: '-0x100001',
        }
        assert.throws(() => {
            new ReplenishAssetTX({chainID, to: 'lemobw', toName: 'alice'}, replenishAssetInfo)
        }, errors.TXMustBeNumber('replenishAmount', '-0x100001'))
    })
    it('replenish_replenishAmount_otherstring', () => {
        const replenishAssetInfo = {
            assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
            replenishAmount: -999,
        }
        assert.throws(() => {
            new ReplenishAssetTX({chainID, to: 'lemobw', toName: 'alice'}, replenishAssetInfo)
        }, errors.TXNegativeError('replenishAmount'))
    })
})
