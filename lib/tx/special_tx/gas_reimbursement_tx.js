import Tx from '../tx'
import {verifyGasInfo} from '../tx_helper'

export default class ReimbursementTx extends Tx {
    /**
     * Reimbursement gas transaction
     * @param {string} noGasTx returned by the signNoGas method
     * @param {number|string} gasPrice Gas price for smart contract. Unit is mo/gas
     * @param {number|string} gasLimit Max gas limit for smart contract. Unit is gas
     */
    constructor(noGasTx, gasPrice, gasLimit) {
        verifyGasInfo(JSON.parse(noGasTx), gasPrice, gasLimit)
        const newTxConfig = {
            ...JSON.parse(noGasTx),
            gasPrice,
            gasLimit,
        }
        delete newTxConfig.payer
        super(newTxConfig)
    }
}
