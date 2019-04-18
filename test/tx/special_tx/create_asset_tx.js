import {assert} from 'chai'
import {chainID} from '../../datas'
import {TxType} from '../../../lib/const'
import errors from '../../../lib/errors'
import CreateAssetTx from '../../../lib/tx/special_tx/create_asset_tx'

describe('CreateAssetTx_new', () => {
    const minCreateAssetInfo = {
        category: 1,
        decimals: 18,
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
        const tx = new CreateAssetTx({chainID}, minCreateAssetInfo)
        assert.equal(tx.type, TxType.CREATE_ASSET)
        assert.equal(tx.to, '')
        assert.equal(tx.toName, '')
        assert.equal(tx.amount, 0)
        assert.equal(tx.data.toString(), JSON.stringify({...minCreateAssetInfo, profile: {...minCreateAssetInfo.profile, stop: 'false'}}))
    })
    it('useless config', () => {
        const tx = new CreateAssetTx(
            {
                chainID,
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
        assert.equal(tx.data.toString(), JSON.stringify({...minCreateAssetInfo, profile: {...minCreateAssetInfo.profile, stop: 'false'}}))
    })
    it('useful config', () => {
        const tx = new CreateAssetTx(
            {
                chainID,
                type: TxType.CREATE_ASSET,
                message: 'abc',
            },
            minCreateAssetInfo,
        )
        assert.equal(tx.type, TxType.CREATE_ASSET)
        assert.equal(tx.message, 'abc')
        assert.equal(tx.data.toString(), JSON.stringify({...minCreateAssetInfo, profile: {...minCreateAssetInfo.profile, stop: 'false'}}))
    })

    // test fields
    const tests = [
        {field: 'category', configData: 1},
        {field: 'category', configData: -1, error: errors.TXInvalidRange('category', -1, 1, 3)},
        {field: 'category', configData: 0, error: errors.TXInvalidRange('category', 0, 1, 3)},
        {field: 'category', configData: '1', error: errors.TXInvalidType('category', '1', ['number'])},
        {field: 'category', configData: '0xAB', error: errors.TXInvalidType('category', '0xAB', ['number'])},
        {field: 'decimals', configData: 18},
        {field: 'decimals', configData: 0},
        {field: 'decimals', configData: -1, error: errors.TXInvalidRange('decimals', -1, 0, 0xffff)},
        {field: 'decimals', configData: '0xAB', error: errors.TXInvalidType('decimals', '0xAB', ['number'])},
        {field: 'decimals', configData: '18', error: errors.TXInvalidType('decimals', '18', ['number'])},
        {field: 'decimals', configData: 0xfffff, error: errors.TXInvalidRange('decimals', 0xfffff, 0, 0xffff)},
        {field: 'isReplenishable', configData: false},
        {field: 'isReplenishable', configData: 'false', error: errors.TXInvalidType('isReplenishable', 'false', ['boolean'])},
        {field: 'isReplenishable', configData: 1, error: errors.TXInvalidType('isReplenishable', 1, ['boolean'])},
        {field: 'isDivisible', configData: false},
        {field: 'isDivisible', configData: 'false', error: errors.TXInvalidType('isDivisible', 'false', ['boolean'])},
        {field: 'isDivisible', configData: 1, error: errors.TXInvalidType('isDivisible', 1, ['boolean'])},
        {field: 'name', configData: 'Demo Token', profile: 'profile'},
        {field: 'name', configData: '', profile: 'profile'},
        {field: 'name', configData: 1, profile: 'profile', error: errors.TXInvalidType('name', 1, ['string'])},
        {field: 'symbol', configData: 'DT', profile: 'profile'},
        {field: 'symbol', configData: '', profile: 'profile'},
        {field: 'symbol', configData: 1, profile: 'profile', error: errors.TXInvalidType('symbol', 1, ['string'])},
        {field: 'description', configData: 'DT', profile: 'profile'},
        {field: 'description', configData: '', profile: 'profile'},
        {field: 'description', configData: 1, profile: 'profile', error: errors.TXInvalidType('description', 1, ['string'])},
        {
            field: 'description',
            configData:
                'aaaaaa0755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
            profile: 'profile',
        },
        {
            field: 'description',
            configData: `aaaaaa0755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0
                aaaaaa0755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0`,
            profile: 'profile',
            error: errors.TXInvalidMaxLength(
                'description',
                `aaaaaa0755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0
                aaaaaa0755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0`,
                256,
            ),
        },
        {field: 'suggestedGasLimit', configData: '60000', profile: 'profile'},
        {field: 'suggestedGasLimit', configData: 60000, profile: 'profile', error: errors.TXInvalidType('suggestedGasLimit', 60000, ['string'])},
    ]
    tests.forEach(test => {
        it(`set createAssetInfo.${test.profile ? `${test.profile}.` : ''}${test.field} to ${JSON.stringify(test.configData)}`, () => {
            let createAssetInfo
            if (test.profile) {
                createAssetInfo = {
                    ...minCreateAssetInfo,
                    [test.profile]: {
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
                    new CreateAssetTx({chainID}, createAssetInfo)
                }, test.error)
            } else {
                const tx = new CreateAssetTx({chainID}, createAssetInfo)
                const targetField = test.profile ? JSON.parse(tx.data.toString()).profile[test.field] : JSON.parse(tx.data.toString())[test.field]
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
        const tx = new CreateAssetTx({chainID}, test)
        assert.equal(JSON.parse(tx.data.toString()).profile.symbol, 'LEMO')
    })
})
