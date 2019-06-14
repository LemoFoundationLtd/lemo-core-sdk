import {assert} from 'chai'
import {chainID, from} from '../../datas'
import {TxType} from '../../../lib/const'
import {decodeUtf8Hex} from '../../../lib/utils'
import errors from '../../../lib/errors'
import CreateAssetTx from '../../../lib/tx/special_tx/create_asset_tx'

describe('CreateAssetTx_new', () => {
    const minCreateAssetInfo = {
        category: 1,
        decimal: 18,
        isReplenishable: true,
        isDivisible: true,
        profile: {
            name: 'Demo Asset',
            symbol: 'DT',
            description: 'demo asset',
            suggestedGasLimit: '60000',
        },
    }
    it('min config', () => {
        const tx = new CreateAssetTx({chainID, from}, minCreateAssetInfo)
        assert.equal(tx.type, TxType.CREATE_ASSET)
        assert.equal(tx.to, '')
        assert.equal(tx.toName, '')
        assert.equal(tx.amount, 0)
        assert.equal(decodeUtf8Hex(tx.data), JSON.stringify({...minCreateAssetInfo, profile: {...minCreateAssetInfo.profile, freeze: 'false'}}))
    })
    it('useless config', () => {
        const tx = new CreateAssetTx(
            {
                chainID,
                from,
                type: 100,
                to: 'lemobw',
                toName: 'alice',
                amount: 101,
                data: '102',
            },
            minCreateAssetInfo,
        )
        assert.equal(tx.type, TxType.CREATE_ASSET)
        assert.equal(tx.to, '')
        assert.equal(tx.toName, '')
        assert.equal(tx.amount, 0)
        assert.equal(decodeUtf8Hex(tx.data), JSON.stringify({...minCreateAssetInfo, profile: {...minCreateAssetInfo.profile, freeze: 'false'}}))
    })
    it('useful config', () => {
        const tx = new CreateAssetTx(
            {
                chainID,
                from,
                type: TxType.CREATE_ASSET,
                message: 'abc',
            },
            minCreateAssetInfo,
        )
        assert.equal(tx.type, TxType.CREATE_ASSET)
        assert.equal(tx.message, 'abc')
        assert.equal(decodeUtf8Hex(tx.data), JSON.stringify({...minCreateAssetInfo, profile: {...minCreateAssetInfo.profile, freeze: 'false'}}))
    })

    // test fields
    const tests = [
        {field: 'category', configData: 1},
        {field: 'category', configData: -1, error: errors.TXInvalidRange('category', -1, 1, 3)},
        {field: 'category', configData: 0, error: errors.TXInvalidRange('category', 0, 1, 3)},
        {field: 'category', configData: '1', error: errors.TXInvalidType('category', '1', ['number'])},
        {field: 'category', configData: '0xAB', error: errors.TXInvalidType('category', '0xAB', ['number'])},
        {field: 'decimal', configData: 18},
        {field: 'decimal', configData: 0},
        {field: 'decimal', configData: -1, error: errors.TXInvalidRange('decimal', -1, 0, 0xffff)},
        {field: 'decimal', configData: '0xAB', error: errors.TXInvalidType('decimal', '0xAB', ['number'])},
        {field: 'decimal', configData: '18', error: errors.TXInvalidType('decimal', '18', ['number'])},
        {field: 'decimal', configData: 0xfffff, error: errors.TXInvalidRange('decimal', 0xfffff, 0, 0xffff)},
        {field: 'isReplenishable', configData: false},
        {field: 'isReplenishable', configData: 'false', error: errors.TXInvalidType('isReplenishable', 'false', ['boolean'])},
        {field: 'isReplenishable', configData: 1, error: errors.TXInvalidType('isReplenishable', 1, ['boolean'])},
        {field: 'isDivisible', configData: false},
        {field: 'isDivisible', configData: 'false', error: errors.TXInvalidType('isDivisible', 'false', ['boolean'])},
        {field: 'isDivisible', configData: 1, error: errors.TXInvalidType('isDivisible', 1, ['boolean'])},
        {field: 'name', configData: 'Demo Token', inProfile: true},
        {field: 'name', configData: '', inProfile: true},
        {field: 'name', configData: 1, inProfile: true, error: errors.TXInvalidType('name', 1, ['string'])},
        {field: 'symbol', configData: 'DT', inProfile: true},
        {field: 'symbol', configData: '', inProfile: true},
        {field: 'symbol', configData: 1, inProfile: true, error: errors.TXInvalidType('symbol', 1, ['string'])},
        {field: 'description', configData: 'DT', inProfile: true},
        {field: 'description', configData: '', inProfile: true},
        {field: 'description', configData: 1, inProfile: true, error: errors.TXInvalidType('description', 1, ['string'])},
        {
            field: 'description',
            configData:
                'aaaaaa0755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
            inProfile: true,
        },
        {
            field: 'description',
            configData: `aaaaaa0755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0
                aaaaaa0755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0`,
            inProfile: true,
            error: errors.TXInvalidMaxLength(
                'description',
                `aaaaaa0755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0
                aaaaaa0755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0`,
                256,
            ),
        },
        {field: 'suggestedGasLimit', configData: '60000', inProfile: true},
        {field: 'suggestedGasLimit', configData: 60000, inProfile: true, error: errors.TXInvalidType('suggestedGasLimit', 60000, ['string'])},
    ]
    tests.forEach(test => {
        it(`set createAssetInfo.${test.inProfile ? 'profile.' : ''}${test.field} to ${JSON.stringify(test.configData)}`, () => {
            let createAssetInfo
            if (test.inProfile) {
                createAssetInfo = {
                    ...minCreateAssetInfo,
                    profile: {
                        ...minCreateAssetInfo.profile,
                        [test.field]: test.configData,
                    },
                }
            } else {
                createAssetInfo = {
                    ...minCreateAssetInfo,
                    [test.field]: test.configData,
                }
            }
            if (test.error) {
                assert.throws(() => {
                    new CreateAssetTx({chainID, from}, createAssetInfo)
                }, test.error)
            } else {
                const tx = new CreateAssetTx({chainID, from}, createAssetInfo)
                const parsedData = JSON.parse(decodeUtf8Hex(tx.data))
                const targetField = test.inProfile ? parsedData.profile[test.field] : parsedData[test.field]
                assert.strictEqual(targetField, test.configData)
            }
        })
    })
    it('symbol_lower_case ', () => {
        const test = {
            ...minCreateAssetInfo,
            profile: {
                name: 'lemochain',
                symbol: 'lemo',
                description: 'demo asset',
            },
        }
        const tx = new CreateAssetTx({chainID, from}, test)
        assert.equal(JSON.parse(decodeUtf8Hex(tx.data)).profile.symbol, 'LEMO')
    })
})
