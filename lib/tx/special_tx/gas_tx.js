import Tx from '../tx'
import {toHexStr, verifyTxConfig} from '../tx_helper'
import GasSinger from '../gas_signer'
import {has0xPrefix} from '../../utils'
import {TX_TO_LENGTH} from '../../const'

export default class GasTx extends Tx {
    /**
     * free gas transaction
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
     * @param {string} payer The address is Receiver's account address
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

    /**
     * Sign no gas transaction with private key
     * @param {string|Buffer} privateKey
     */
    signNoGasWith(privateKey) {
        this.sig = new GasSinger().signNoGas(this, privateKey)
    }

    /**
     * format for rpc
     * @return {object}
     */
    toNoGasJson() {
        super.toJson()
        const payer = has0xPrefix(this.payer) ? toHexStr(this, 'payer', TX_TO_LENGTH) : this.payer
        if (payer) {
            this.payer = payer
        }
        return this
    }
}
