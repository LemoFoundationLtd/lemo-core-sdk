import {Buffer} from 'safe-buffer'
import {TxType} from '../../const'
import Tx from '../tx'
import {verifyTransferAssetInfo} from '../tx_helper'

export default class TransferAssetTx extends Tx {
    /**
     * 交易资产的交易
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
     * @param {number|string?} txConfig.amount Unit is mo
     * @param {string?} txConfig.message Extra value data
     * @param {Buffer|string?} txConfig.sig Signature data
     * @param {object} transferAssetInfo TransferAsset information
     * @param {string} transferAssetInfo.assetId Asset id of the transaction
     * @param {string} transferAssetInfo.transferAmount Number of transactions
     */
    constructor(txConfig, transferAssetInfo) {
        verifyTransferAssetInfo(transferAssetInfo)
        const newTransferAsset = {
            assetId: transferAssetInfo.assetId,
        }

        const newTxConfig = {
            ...txConfig,
            type: TxType.TRANSFER_ASSET,
            data: Buffer.from(JSON.stringify(newTransferAsset)),
        }
        super(newTxConfig)
    }
}
