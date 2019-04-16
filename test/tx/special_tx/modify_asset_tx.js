import {assert} from 'chai'
import {chainID} from '../../datas'
import {TxType} from '../../../lib/const'
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
        console.log(tx.data.toString(), modifyAssetInfo.info)
    })
    // no assetCode
    it('modify_noassetCode', () => {
        const modifyInfo = {
            replenishAmount: '100000',
        }
        assert.throws(() => {
            new ModifyAssetTx({chainID, to: 'lemobw', toName: 'alice'}, modifyInfo)
        }, errors.TXParamMissingError('assetCode'))
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
})

