import {TxType} from '../../const'
import Tx from '../tx'
import {verifyModifyAssetInfo} from '../tx_helper'

export default class modifyAssetTx extends Tx {
    /**
     * 修改资产的交易
     * @param {object} txConfig
     * @param {number?} txConfig.type The type of transaction
     * @param {string?} txConfig.to The transaction recipient address
     * @param {string?} txConfig.from The transaction sender address
     * @param {string?} txConfig.toName The transaction recipient name
     * @param {number?} txConfig.version The version of transaction protocol
     * @param {number} txConfig.chainID The LemoChain id
     * @param {number|string?} txConfig.gasPrice Gas price for smart contract. Unit is mo/gas
     * @param {number|string?} txConfig.gasLimit Max gas limit for smart contract. Unit is gas
     * @param {number|string?} txConfig.expirationTime Default value is half hour from now
     * @param {string?} txConfig.message Extra value data
     * @param {Array?} txConfig.sigs Signature data list
     * @param {object} modifyInfo modifyInfo information
     * @param {string} modifyInfo.assetCode assetCode that needs to be modified
     * @param {object} modifyInfo.updateProfile updateProfile information
     */
    constructor(txConfig, modifyInfo) {
        verifyModifyAssetInfo(modifyInfo)
        const newModifyAsset = {
            assetCode: modifyInfo.assetCode,
            updateProfile: {
                name: modifyInfo.updateProfile.name,
                symbol: modifyInfo.updateProfile.symbol === undefined ? undefined : modifyInfo.updateProfile.symbol.toUpperCase(),
                description: modifyInfo.updateProfile.description,
                suggestedGasLimit: modifyInfo.updateProfile.suggestedGasLimit,
                freeze: modifyInfo.updateProfile.freeze,
            },
        }

        const newTxConfig = {
            ...txConfig,
            type: TxType.MODIFY_ASSET,
            data: newModifyAsset,
        }
        delete newTxConfig.to
        delete newTxConfig.amount
        delete newTxConfig.toName
        super(newTxConfig)
    }
}
