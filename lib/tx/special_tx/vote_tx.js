import {TxType} from '../../const'
import Tx from '../tx'

export default class VoteTx extends Tx {
    /**
     * Create a unsigned special transaction to set vote target
     * @param {object} txConfig
     * @param {number?} txConfig.type The type of transaction. 0: normal
     * @param {number?} txConfig.version The version of transaction protocol
     * @param {number} txConfig.chainID The LemoChain id
     * @param {string?} txConfig.to The transaction recipient address
     * @param {string?} txConfig.toName The transaction recipient name
     * @param {number|string?} txConfig.gasPrice Gas price for smart contract. Unit is mo/gas
     * @param {number|string?} txConfig.gasLimit Max gas limit for smart contract. Unit is gas
     * @param {number|string?} txConfig.expirationTime Default value is half hour from now
     * @param {string?} txConfig.message Extra value data
     * @param {string?} txConfig.sig Signature data
     */
    constructor(txConfig) {
        const newTxConfig = {
            ...txConfig,
            type: TxType.VOTE,
        }
        delete newTxConfig.amount
        delete newTxConfig.data
        super(newTxConfig)
    }
}
