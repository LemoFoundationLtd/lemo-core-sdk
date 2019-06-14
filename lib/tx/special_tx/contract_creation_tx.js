import Tx from '../tx'
import {verifyContractCreationInfo} from '../tx_helper'

export default class ContractCreationTx extends Tx {
    /**
     * @param {object} txConfig
     * @param {number?} txConfig.type The type of transaction
     * @param {string?} txConfig.to The transaction recipient address
     * @param {string?} txConfig.from The transaction sender address
     * @param {string?} txConfig.toName The transaction recipient name
     * @param {number?} txConfig.version The version of transaction protocol
     * @param {number} txConfig.chainID The LemoChain id
     * @param {number|string?} txConfig.gasPrice Gas price for smart contract. Unit is mo/gas
     * @param {number|string?} txConfig.gasLimit Max gas limit for smart contract. Unit is gas
     * @param {number|string?} txConfig.expirationTime Default value is half hour from now
     * @param {string?} txConfig.message Extra value data
     * @param {Array?} txConfig.sigs Signature data list
     * @param {string} code
     * @param {string} constructorArgs
     */
    constructor(txConfig, code, constructorArgs) {
        verifyContractCreationInfo(code, constructorArgs)

        const newTxConfig = {
            ...txConfig,
            data: code + constructorArgs.slice(2),
        }
        super(newTxConfig)
    }
}
