import {Buffer} from 'safe-buffer'
import BigNumber from 'bignumber.js'
import {TxType} from '../../const'
import Tx from '../tx'
import {verifyIssueAssetInfo} from '../tx_helper'

export default class IssueAsset extends Tx {
    /**
     * 发行资产的交易
     * @param {object} txConfig
     * @param {number?} txConfig.type The type of transaction
     * @param {string?} txConfig.to The transaction recipient address
     * @param {number?} txConfig.version The version of transaction protocol
     * @param {number} txConfig.chainID The LemoChain id
     * @param {number|string?} txConfig.gasPrice Gas price for smart contract. Unit is mo/gas
     * @param {number|string?} txConfig.gasLimit Max gas limit for smart contract. Unit is gas
     * @param {Buffer|string?} txConfig.data Extra data or smart contract calling parameters
     * @param {number|string?} txConfig.expirationTime Default value is half hour from now
     * @param {string?} txConfig.message Extra value data
     * @param {Buffer|string?} txConfig.sig Signature data
     * @param {object} issueAssetInfo IssueAsset information
     * @param {string} issueAssetInfo.metaData 资产中的自定义数据
     * @param {number} issueAssetInfo.amount 发行资产的数量,值为bigNumber
     */
    constructor(txConfig, issueAssetInfo) {
        verifyIssueAssetInfo(issueAssetInfo)
        const newIssueAsset = {
            metaData: issueAssetInfo.metaData,
            amount: new BigNumber(issueAssetInfo.amount),
        }

        const newTxConfig = {
            ...txConfig,
            type: TxType.ISSUE_ASSET,
            data: Buffer.from(JSON.stringify(newIssueAsset)),
        }
        delete newTxConfig.toName
        delete newTxConfig.amount
        super(newTxConfig)
    }
}
