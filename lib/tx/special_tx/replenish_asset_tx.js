import {Buffer} from 'safe-buffer'
import {TxType} from '../../const'
import Tx from '../tx'
import {verifyReplenishAssetInfo} from '../tx_helper'

export default class ReplenishAssetTx extends Tx {
    /**
     * 增发资产的交易
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
     * @param {object} replenishInfo replenishAsset information
     * @param {string} replenishInfo.assetId Replenish asset id
     * @param {string} replenishInfo.ReplenishAmount number of Replenish
     */
    constructor(txConfig, replenishInfo) {
        verifyReplenishAssetInfo(replenishInfo)
        const newReplenishAsset = {
            assetId: replenishInfo.assetId,
            replenishAmount: replenishInfo.replenishAmount.toString(),
        }

        const newTxConfig = {
            ...txConfig,
            type: TxType.REPLENISH_ASSET,
            data: Buffer.from(JSON.stringify(newReplenishAsset)),
        }
        delete newTxConfig.amount
        super(newTxConfig)
    }
}
