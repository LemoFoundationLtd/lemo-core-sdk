import Tx from '../tx'
import {verifyBoxTXInfo} from '../tx_helper'

export default class BoxTx extends Tx {
    /**
     * 箱子的交易
     * @param {object} txConfig
     * @param {number?} txConfig.type The type of transaction
     * @param {number?} txConfig.version The version of transaction protocol
     * @param {number} txConfig.chainID The LemoChain id
     * @param {number|string?} txConfig.gasPrice Gas price for smart contract. Unit is mo/gas
     * @param {number|string?} txConfig.gasLimit Max gas limit for smart contract. Unit is gas
     * @param {number|string?} txConfig.expirationTime Default value is half hour from now
     * @param {string?} txConfig.message Extra value data
     * @param {Array?} txConfig.sigs Signature data list
     * @param {string?} txConfig.from The transaction sender address
     * @param {object} boxTxInfo boxTx information
     * @param {Array} boxTxInfo.subTxList information
     */
    constructor(txConfig, boxTxInfo) {
        verifyBoxTXInfo(boxTxInfo)
        // Determine data type
        boxTxInfo.subTxList = boxTxInfo.subTxList.map(item => {
            if (typeof item === 'string') {
                item = JSON.parse(item)
            }
            return item
        })
        // get the expirationTime of the boxTx
        const time = []
        boxTxInfo.subTxList.forEach(item => time.push(item.expirationTime))

        const newBoxTx = {
            subTxList: boxTxInfo.subTxList,
        }

        const newTxConfig = {
            ...txConfig,
            expirationTime: Math.min(...time),
            data: newBoxTx,
        }

        delete newTxConfig.to
        super(newTxConfig)
    }
}
