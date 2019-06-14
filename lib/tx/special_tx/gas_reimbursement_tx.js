import Tx from '../tx'
import {verifyGasInfo} from '../tx_helper'
import GasSinger from '../gas_signer'

export default class ReimbursementTx extends Tx {
    /**
     * Reimbursement gas transaction
     * @param {object} noGasTx returned by the signNoGas method
     * @param {number|string?} noGasTx.type The type of transaction
     * @param {number|string?} noGasTx.version The version of transaction protocol
     * @param {number|string} noGasTx.chainID The LemoChain id
     * @param {string?} noGasTx.to The transaction recipient address
     * @param {string?} noGasTx.from The transaction sender address
     * @param {string?} noGasTx.toName The transaction recipient name
     * @param {number|string?} noGasTx.amount Unit is mo
     * @param {string?} noGasTx.data Extra data or smart contract calling parameters
     * @param {number|string?} noGasTx.expirationTime Default value is half hour from now
     * @param {string?} noGasTx.message Extra value data
     * @param {Array?} noGasTx.sigs Signature data list
     * @param {number|string} gasPrice Gas price for smart contract. Unit is mo/gas
     * @param {number|string} gasLimit Max gas limit for smart contract. Unit is gas
     */
    constructor(noGasTx, gasPrice, gasLimit) {
        verifyGasInfo(noGasTx, gasPrice, gasLimit)
        const newTxConfig = {
            ...noGasTx,
            gasPrice,
            gasLimit,
        }
        super(newTxConfig)
    }

    /**
     * Sign a gas transaction with private key
     * @param {string|Buffer} privateKey
     */
    signGasWith(privateKey) {
        const gasPayerSig = new GasSinger().signGas(this, privateKey)
        if (!this.gasPayerSigs.includes(gasPayerSig)) {
            this.gasPayerSigs.push(gasPayerSig)
        }
    }
}
