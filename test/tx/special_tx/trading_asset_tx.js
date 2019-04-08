import {assert} from 'chai'
import {chainID} from '../../datas'
import {TxType} from '../../../lib/const'
import errors from '../../../lib/errors'
import TradingAsset from '../../../lib/tx/special_tx/trading_asset_tx'

describe('TradingAsset_new', () => {
    const minTradingAssetInfo = {
        assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
    }
    it('min config', () => {
        const tx = new TradingAsset({chainID}, minTradingAssetInfo)
        assert.equal(tx.type, TxType.TRADING_ASSET)
        assert.equal(tx.amount, 0)
        assert.equal(tx.to, '')
        assert.equal(tx.toName, '')
        assert.equal(tx.data.toString(), JSON.stringify({...minTradingAssetInfo}))
    })
    it('useless config', () => {
        const tx = new TradingAsset(
            {
                chainID,
                type: 100,
                to: 'lemobw',
                toName: 'alice',
                amount: 101,
                data: '102',
            },
            minTradingAssetInfo,
        )
        assert.equal(tx.type, TxType.TRADING_ASSET)
        assert.equal(tx.to, 'lemobw')
        assert.equal(tx.toName, 'alice')
        assert.equal(tx.amount, 101)
        assert.equal(tx.data.toString(), JSON.stringify({...minTradingAssetInfo}))
    })
    it('useful config', () => {
        const tradingAssetInfo = {
            ...minTradingAssetInfo,
        }
        const tx = new TradingAsset(
            {
                chainID,
                type: TxType.TRADING_ASSET,
                message: 'abc',
            },
            tradingAssetInfo,
        )
        assert.equal(tx.type, TxType.TRADING_ASSET)
        assert.equal(tx.message, 'abc')
        const result = JSON.stringify({...tradingAssetInfo})
        assert.equal(tx.data.toString(), result)
    })

    // test fields
    const tests = [
        {field: 'assetId', configData: 'Lemo83JZRYPYF97CFSZBBQBH4GW42PD8CFHT5ARN'},
        {field: 'assetId', configData: 123, error: errors.TXInvalidType('assetId', 123, ['string'])},
        {
            field: 'assetId',
            configData: 'Lemo83JZRYPYF97CFSZBBQBH4GW42PD8CFHT5ARN1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            error: errors.TXInvalidMaxLength('assetId', 'Lemo83JZRYPYF97CFSZBBQBH4GW42PD8CFHT5ARN1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 66),
        },
    ]
    tests.forEach(test => {
        it(`set tradingAssetInfo.${test.field} to ${JSON.stringify(test.configData)}`, () => {
            const tradingAssetInfo = {
                ...minTradingAssetInfo,
                [test.field]: test.configData,
            }
            if (test.error) {
                assert.throws(() => {
                    new TradingAsset({chainID}, tradingAssetInfo)
                }, test.error)
            } else {
                const tx = new TradingAsset({chainID}, tradingAssetInfo)
                const targetField = JSON.parse(tx.data.toString())[test.field]
                assert.strictEqual(targetField, test.configData)
            }
        })
    })
})
