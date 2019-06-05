import {TxType} from '../../const'
import Tx from '../tx'
import {verifymodifySignersInfo} from '../tx_helper'

export default class modifySignersTx extends Tx {
    /**
     * @param {object} txConfig
     * @param {number?} txConfig.type The type of transaction
     * @param {string?} txConfig.to The transaction recipient address
     * @param {string?} txConfig.from The transaction send address
     * @param {string?} txConfig.toName The transaction recipient name
     * @param {number?} txConfig.version The version of transaction protocol
     * @param {number} txConfig.chainID The LemoChain id
     * @param {number|string?} txConfig.gasPrice Gas price for smart contract. Unit is mo/gas
     * @param {number|string?} txConfig.gasLimit Max gas limit for smart contract. Unit is gas
     * @param {number|string?} txConfig.expirationTime Default value is half hour from now
     * @param {string?} txConfig.message Extra value data
     * @param {Array?} txConfig.sigs Signature data
     * @param {object} modifySignersInfo modify signers information
     * @param {object} modifySignersInfo.signers modify signers
     */
    constructor(txConfig, modifySignersInfo) {
        verifymodifySignersInfo(modifySignersInfo)
        const newModifySigners = {
            signers: modifySignersInfo.signers,
        }

        const newTxConfig = {
            ...txConfig,
            data: newModifySigners,
        }
        super(newTxConfig)
    }
}
