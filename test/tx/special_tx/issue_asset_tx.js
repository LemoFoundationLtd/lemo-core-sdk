import {assert} from 'chai'
import {chainID, from} from '../../datas'
import {TxType, TX_ASSET_CODE_LENGTH} from '../../../lib/const'
import {decodeUtf8Hex} from '../../../lib/utils'
import errors from '../../../lib/errors'
import IssueAssetTx from '../../../lib/tx/special_tx/issue_asset_tx'

describe('IssueAsset_new', () => {
    it('miss config.metaData', () => {
        const issueAssetInfo = {
            assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
            supplyAmount: '100000',
        }
        const tx = new IssueAssetTx(
            {
                chainID,
                type: TxType.ISSUE_ASSET,
                to: 'lemobw',
                toName: 'alice',
                message: 'abc',
                from,
            },
            issueAssetInfo,
        )
        assert.equal(tx.type, TxType.ISSUE_ASSET)
        assert.equal(tx.message, 'abc')
        assert.equal(tx.to, 'lemobw')
        assert.equal(tx.toName, 'alice')
        const result = JSON.stringify({...issueAssetInfo})
        assert.equal(decodeUtf8Hex(tx.data), result)
    })
    it('miss config.assetCode', () => {
        const issueAssetInfo = {
            supplyAmount: '100000',
        }
        assert.throws(() => {
            new IssueAssetTx({chainID, to: 'lemobw', toName: 'alice'}, issueAssetInfo)
        }, errors.TXParamMissingError('assetCode'))
    })
    it('miss config.supplyAmount', () => {
        const issueAssetInfo = {
            assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
        }
        assert.throws(() => {
            new IssueAssetTx({chainID, to: 'lemobw', toName: 'alice'}, issueAssetInfo)
        }, errors.TXParamMissingError('supplyAmount'))
    })
    it('normal config', () => {
        const issueAssetInfo = {
            assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
            metaData: 'issue asset metaData',
            supplyAmount: '100000',
        }
        const tx = new IssueAssetTx({chainID, to: 'lemobw', toName: 'alice', from}, issueAssetInfo)
        assert.equal(tx.to, 'lemobw')
        assert.equal(tx.toName, 'alice')
        assert.equal(tx.amount, 0)
        assert.equal(decodeUtf8Hex(tx.data), JSON.stringify({...issueAssetInfo}))
    })

    // test fields
    const tests = [
        {field: 'assetCode', configData: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884'},
        {field: 'assetCode', configData: 123, error: errors.TXInvalidType('assetCode', 123, ['string'])},
        {
            field: 'assetCode',
            configData: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884aaa',
            error: errors.TXInvalidLength('assetCode', '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884aaa', TX_ASSET_CODE_LENGTH),
        },
        {field: 'metaData', configData: 'issue asset metaData'},
        {field: 'metaData', configData: 123, error: errors.TXInvalidType('metaData', 123, ['string'])},
        {
            field: 'metaData',
            configData: `aaaaaa0755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0
                aaaaaa0755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0`,
            error: errors.TXInvalidMaxLength(
                'metaData',
                `aaaaaa0755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0
                aaaaaa0755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0`,
                256,
            ),
        },
        {field: 'supplyAmount', configData: '100000'},
        {field: 'supplyAmount', configData: 123, error: errors.TXInvalidType('supplyAmount', 123, ['string'])},
        {field: 'supplyAmount', configData: '0x123', error: errors.TXIsNotDecimalError('supplyAmount')},
        {field: 'supplyAmount', configData: '-1000', error: errors.TXNegativeError('supplyAmount')},
    ]
    tests.forEach(test => {
        it(`set issueAssetInfo.${test.field} to ${JSON.stringify(test.configData)}`, () => {
            const issueAssetInfo = {
                assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
                metaData: 'issue asset metaData',
                supplyAmount: '100000',
                [test.field]: test.configData,
            }
            if (test.error) {
                assert.throws(() => {
                    new IssueAssetTx({chainID, from}, issueAssetInfo)
                }, test.error)
            } else {
                const tx = new IssueAssetTx({chainID, from}, issueAssetInfo)
                const targetField = JSON.parse(decodeUtf8Hex(tx.data))[test.field]
                assert.strictEqual(targetField, test.configData)
            }
        })
    })
})
