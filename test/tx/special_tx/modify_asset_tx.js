import {assert} from 'chai'
import {chainID} from '../../datas'
import {TX_ASSET_CODE_LENGTH, TxType} from '../../../lib/const'
import errors from '../../../lib/errors'
import ModifyAssetTx from '../../../lib/tx/special_tx/modify_asset_tx'

describe('Modify-Asset', () => {
    const modifyAssetInfo = {
        assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
        info: {
            name: 'Demo Asset',
            symbol: 'DT',
            description: 'demo asset',
            suggestedGasLimit: '60000',
        },
    }
    // normal situation
    it('modify_normal', () => {
        const tx = new ModifyAssetTx({chainID}, modifyAssetInfo)
        assert.equal(tx.type, TxType.MODIFY_ASSET)
        assert.equal(JSON.parse(tx.data).info.name, modifyAssetInfo.info.name)
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
    // no info
    it('modify_noinfo', () => {
        const modifyInfo = {
            assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
        }
        assert.throws(() => {
            new ModifyAssetTx({chainID, to: 'hello'}, modifyInfo)
        }, errors.TXInfoError())
    })
    // no symbol info
    it('modify_only_one_info', () => {
        const modifyInfo = {
            assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
            info: {
                name: 'alice',
            },
        }
        const result = new ModifyAssetTx({chainID}, modifyInfo)
        assert.equal(JSON.parse(result.data.toString()).info.name, modifyInfo.info.name)
    })
    // symbol is lower case
    it('modify_lower_case_symbol', () => {
        const modifyInfo = {
            assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
            info: {
                name: 'alice',
                symbol: 'lemochain',
            },
        }
        const result = new ModifyAssetTx({chainID}, modifyInfo)
        assert.equal(JSON.parse(result.data.toString()).info.symbol, 'LEMOCHAIN')
    })
})

describe('info_test', () => {
    // test about stop
    const tests = [
        {field: 'stop', configData: 'true'},
        {field: 'stop', configData: 'false'},
        {field: 'stop', configData: false},
        {field: 'stop', configData: true},
        {field: 'stop', configData: '2311222', error: errors.TxInvalidSymbol('stop')},
        {field: 'stop', configData: 'sandlfa', error: errors.TxInvalidSymbol('stop')},
        {field: 'stop', configData: 12314, error: errors.TXInvalidType('stop', 1234, ['boolean', 'string'])},
    ]
    tests.forEach(test => {
        it('info_stop', () => {
            const modifyInfo = {
                assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
                info: {
                    name: 'test',
                    symbol: 'DT',
                    suggestedGasLimit: '60000',
                    stop: test.configData,
                },
            }
            if (test.error) {
                assert.throws(() => {
                    new ModifyAssetTx({chainID, to: '0x1000000000000000000000000000000000000000'}, modifyInfo)
                }, test.error)
            } else {
                const tx = new ModifyAssetTx({chainID}, modifyInfo)
                const result = JSON.parse(tx.data.toString()).info
                assert.strictEqual(result.stop, test.configData)
            }
        })
    })
})


