import {assert} from 'chai'
import {chainID, from} from '../../datas'
import {TX_ASSET_CODE_LENGTH, TxType} from '../../../lib/const'
import {decodeUtf8Hex} from '../../../lib/utils'
import errors from '../../../lib/errors'
import ModifyAssetTx from '../../../lib/tx/special_tx/modify_asset_tx'

function parseHexObject(hex) {
    return JSON.parse(decodeUtf8Hex(hex))
}

describe('Modify-Asset', () => {
    const modifyAssetInfo = {
        assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
        updateProfile: {
            name: 'Demo Asset',
            symbol: 'DT',
            description: 'demo asset',
            suggestedGasLimit: '60000',
        },
    }
    // normal situation
    it('modify_normal', () => {
        const tx = new ModifyAssetTx({chainID, from}, modifyAssetInfo)
        assert.equal(tx.type, TxType.MODIFY_ASSET)
        assert.equal(parseHexObject(tx.data).updateProfile.name, modifyAssetInfo.updateProfile.name)
    })
    // no assetCode
    it('modify_noassetCode', () => {
        const modifyInfo = {
            replenishAmount: '100000',
        }
        assert.throws(() => {
            new ModifyAssetTx({chainID, to: 'lemobw', toName: 'alice'}, modifyInfo)
        }, errors.TXInvalidType('assetCode', undefined, ['string']))
    })
    // assetCode length error
    it('modify_assetCode_length', () => {
        const modifyInfo = {
            assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978a',
            replenishAmount: '100000',
        }
        assert.throws(() => {
            new ModifyAssetTx({chainID, to: 'lemobw', toName: 'alice'}, modifyInfo)
        }, errors.TXInvalidLength('assetCode', modifyInfo.assetCode, TX_ASSET_CODE_LENGTH))
    })
    // no updateProfile
    it('modify_noupdateProfile', () => {
        const modifyInfo = {
            assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
        }
        assert.throws(() => {
            new ModifyAssetTx({chainID, to: 'hello'}, modifyInfo)
        }, errors.TXInfoError())
    })
    // no symbol updateProfile
    it('modify_only_one_updateProfile', () => {
        const modifyInfo = {
            assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
            updateProfile: {
                name: 'alice',
            },
        }
        const tx = new ModifyAssetTx({chainID, from}, modifyInfo)
        assert.equal(parseHexObject(tx.data).updateProfile.name, modifyInfo.updateProfile.name)
    })
    // symbol is lower case
    it('modify_lower_case_symbol', () => {
        const modifyInfo = {
            assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
            updateProfile: {
                name: 'alice',
                symbol: 'lemochain',
            },
        }
        const tx = new ModifyAssetTx({chainID, from}, modifyInfo)
        assert.equal(parseHexObject(tx.data).updateProfile.symbol, 'LEMOCHAIN')
    })
})

describe('updateProfile_test', () => {
    // test about stop
    const tests = [
        {field: 'freeze', configData: 'true'},
        {field: 'freeze', configData: 'false'},
        {field: 'freeze', configData: false},
        {field: 'freeze', configData: true},
        {field: 'freeze', configData: '2311222', error: errors.TxInvalidSymbol('freeze')},
        {field: 'freeze', configData: 'sandlfa', error: errors.TxInvalidSymbol('freeze')},
        {field: 'freeze', configData: 12314, error: errors.TXInvalidType('freeze', 1234, ['boolean', 'string'])},
    ]
    tests.forEach(test => {
        it(`updateProfile_${test.freeze},${test.configData}`, () => {
            const modifyInfo = {
                assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
                updateProfile: {
                    name: 'test',
                    symbol: 'DT',
                    suggestedGasLimit: '60000',
                    freeze: test.configData,
                },
            }
            if (test.error) {
                assert.throws(() => {
                    new ModifyAssetTx({chainID, from, to: '0x1000000000000000000000000000000000000000'}, modifyInfo)
                }, test.error)
            } else {
                const tx = new ModifyAssetTx({chainID, from}, modifyInfo)
                const result = parseHexObject(tx.data).updateProfile
                assert.strictEqual(result.freeze, test.configData)
            }
        })
    })
})


