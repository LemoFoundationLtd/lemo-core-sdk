import Tx from '../tx'
import GasSinger from '../gas_signer'
import {isLemoAddress, encodeAddress} from '../../crypto'

export default class GasTx extends Tx {
    /**
     * free gas transaction
     * @param {object} txConfig
     * @param {number?} txConfig.type The type of transaction
     * @param {string?} txConfig.to The transaction recipient address
     * @param {string?} txConfig.toName The transaction recipient name
     * @param {number?} txConfig.version The version of transaction protocol
     * @param {number} txConfig.chainID The LemoChain id
     * @param {string?} txConfig.data Extra data or smart contract calling parameters
     * @param {number|string?} txConfig.expirationTime Default value is half hour from now
     * @param {string?} txConfig.message Extra value data
     * @param {string?} txConfig.sig Signature data
     * @param {string} payer The address is Receiver's account address
     */
    constructor(txConfig, payer) {
        const newTxConfig = {
            ...txConfig,
        }
        super(newTxConfig)
        delete newTxConfig.gasLimit
        delete newTxConfig.gasPrice
        if (!payer) {
            this.payer = ''
        } else if (isLemoAddress(payer)) {
            this.payer = payer
        } else {
            this.payer = encodeAddress(payer)
        }
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
    toJson() {
        const result = super.toJson()
        if (this.payer) {
            result.payer = this.payer
        }
        return result
    }
}
