import {TxType} from '../../const'
import Tx from '../tx'
import {verifyIssueAssetInfo} from '../tx_helper'

export default class IssueAssetTx extends Tx {
    /**
     * 发行资产的交易
     * @param {object} txConfig
     * @param {number?} txConfig.type The type of transaction
     * @param {string?} txConfig.to The transaction recipient address
     * @param {string?} txConfig.toName The transaction recipient name
     * @param {number?} txConfig.version The version of transaction protocol
     * @param {number} txConfig.chainID The LemoChain id
     * @param {number|string?} txConfig.gasPrice Gas price for smart contract. Unit is mo/gas
     * @param {number|string?} txConfig.gasLimit Max gas limit for smart contract. Unit is gas
     * @param {number|string?} txConfig.expirationTime Default value is half hour from now
     * @param {string?} txConfig.message Extra value data
     * @param {string?} txConfig.sig Signature data
     * @param {object} issueAssetInfo IssueAsset information
     * @param {string} issueAssetInfo.assetCode 发行资产的唯一标识
     * @param {string} issueAssetInfo.metaData 资产中的自定义数据
     * @param {string} issueAssetInfo.supplyAmount 发行资产的数量
     */
    constructor(txConfig, issueAssetInfo) {
        verifyIssueAssetInfo(issueAssetInfo)
        const newIssueAsset = {
            assetCode: issueAssetInfo.assetCode,
            metaData: issueAssetInfo.metaData,
            supplyAmount: issueAssetInfo.supplyAmount.toString(),
        }

        const newTxConfig = {
            ...txConfig,
            type: TxType.ISSUE_ASSET,
            data: newIssueAsset,
        }
        delete newTxConfig.amount
        super(newTxConfig)
    }
}
