import {Buffer} from 'safe-buffer'
import {TxType} from '../../const'
import Tx from '../tx'
import {verifyModifyAssetInfo} from '../tx_helper'

export default class modifyAssetTx extends Tx {
    /**
     * 修改资产的交易
     * @param {object} txConfig
     * @param {number?} txConfig.type The type of transaction
     * @param {string?} txConfig.to The transaction recipient address
     * @param {string?} txConfig.toName The transaction recipient name
     * @param {number?} txConfig.version The version of transaction protocol
     * @param {number} txConfig.chainID The LemoChain id
     * @param {number|string?} txConfig.gasPrice Gas price for smart contract. Unit is mo/gas
     * @param {number|string?} txConfig.gasLimit Max gas limit for smart contract. Unit is gas
     * @param {Buffer|string?} txConfig.data Extra data or smart contract calling parameters
     * @param {number|string?} txConfig.expirationTime Default value is half hour from now
     * @param {string?} txConfig.message Extra value data
     * @param {Buffer|string?} txConfig.sig Signature data
     * @param {object} modifyInfo modifyInfo information
     * @param {string} modifyInfo.assetCode assetCode that needs to be modified
     * @param {object} modifyInfo.info info information
     */
    constructor(txConfig, modifyInfo) {
        verifyModifyAssetInfo(modifyInfo)
        const newModifyAsset = {
            assetCode: modifyInfo.assetCode,
            info: {
                name: modifyInfo.info.name,
                symbol: modifyInfo.info.symbol === undefined ? undefined : modifyInfo.info.symbol.toUpperCase(),
                description: modifyInfo.info.description,
                suggestedGasLimit: modifyInfo.info.suggestedGasLimit,
                stop: modifyInfo.info.stop,
            },
        }

        const newTxConfig = {
            ...txConfig,
            type: TxType.MODIFY_ASSET,
            data: Buffer.from(JSON.stringify(newModifyAsset)),
        }
        delete newTxConfig.to
        delete newTxConfig.amount
        delete newTxConfig.toName
        super(newTxConfig)
    }
}
