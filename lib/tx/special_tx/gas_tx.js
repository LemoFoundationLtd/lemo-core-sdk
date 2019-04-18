import Tx from '../tx'
import {verifyTxConfig} from '../tx_helper'

export default class GasTx extends Tx {
    /**
     * 免费gas交易 free gas transaction
     * @param {object} txConfig
     * @param {number?} txConfig.type The type of transaction
     * @param {string?} txConfig.to The transaction recipient address
     * @param {string?} txConfig.toName The transaction recipient name
     * @param {number?} txConfig.version The version of transaction protocol
     * @param {number} txConfig.chainID The LemoChain id
     * @param {Buffer|string?} txConfig.data Extra data or smart contract calling parameters
     * @param {number|string?} txConfig.expirationTime Default value is half hour from now
     * @param {string?} txConfig.message Extra value data
     * @param {Buffer|string?} txConfig.sig Signature data
     */
    constructor(txConfig, payer) {
        verifyTxConfig(txConfig)
        const newTxConfig = {
            ...txConfig,
            payer,
        }
        delete newTxConfig.gasLimit
        delete newTxConfig.gasPrice
        super(newTxConfig)
        this.payer = newTxConfig.payer
    }
}
