import Tx from '../tx'
import GasSinger from '../gas_signer'

export default class GasTx extends Tx {
    /**
     * free gas transaction
     * @param {object} txConfig
     * @param {number?} txConfig.type The type of transaction
     * @param {string?} txConfig.to The transaction recipient address
     * @param {string?} txConfig.from The transaction sender address
     * @param {string?} txConfig.toName The transaction recipient name
     * @param {number?} txConfig.version The version of transaction protocol
     * @param {number} txConfig.chainID The LemoChain id
     * @param {string?} txConfig.data Extra data or smart contract calling parameters
     * @param {number|string?} txConfig.expirationTime Default value is half hour from now
     * @param {string?} txConfig.message Extra value data
     * @param {Array?} txConfig.sigs Signature data list
     * @param {string} payer The address is Receiver's account address
     */
    constructor(txConfig, payer) {
        const newTxConfig = {
            ...txConfig,
            gasPayer: payer,
        }
        super(newTxConfig)
        delete newTxConfig.gasLimit
        delete newTxConfig.gasPrice
    }

    /**
     * Sign no gas transaction with private key
     * @param {string|Buffer} privateKey
     */
    signNoGasWith(privateKey) {
        const sig = new GasSinger().signNoGas(this, privateKey)
        if (!this.sigs.includes(sig)) {
            this.sigs.push(sig)
        }
    }
}
