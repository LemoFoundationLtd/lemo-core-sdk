import Tx from '../tx/tx'
import VoteTx from '../tx/vote_tx'
import CandidateTx from '../tx/candidate_tx'
import {parseTxRes, parseTxListRes} from '../network/data_parser'
import {checkChainID} from '../tx/tx_helper'
import {TX_NAME} from '../const'


const apis = {
    /**
     * Get transaction's information by hash
     * @param {string|number} txHash Hash of transaction
     * @return {Promise<object>}
     */
    async getTx(txHash) {
        const result = await this.requester.send(`${TX_NAME}_getTxByHash`, [txHash])
        if (!result) {
            return null
        }
        return parseTxRes(this.chainID, result)
    },
    /**
     * Get transactions' information in account
     * @param {string} address Account address
     * @param {number} index Index of transactions
     * @param {number} limit The count of transactions required
     * @return {Promise<object>}
     */
    async getTxListByAddress(address, index, limit) {
        const result = await this.requester.send(`${TX_NAME}_getTxListByAddress`, [address, index, limit])
        if (!result) {
            return null
        }
        return parseTxListRes(this.chainID, result)
    },
    /**
     * Sign and send transaction
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @param {boolean} waitConfirm 等待交易共识
     * @return {Promise<object>}
     */
    sendTx(privateKey, txConfig, waitConfirm) {
        txConfig = checkChainID(txConfig, this.chainID)
        const tx = new Tx(txConfig)
        tx.signWith(privateKey)
        const txHash = tx.hash()
        return this.requester.send(`${TX_NAME}_sendTx`, [tx.toJson()]).then(async() => {
            if (!waitConfirm) {
                return txHash
            }
            await this.txWatcher.waitTx(txHash)
            return txHash
        })
    },
    /**
     * Send a signed transaction
     * @param {object|string} txConfig Transaction config returned by lemo.tx.sign
     * @param {boolean} waitConfirm 等待交易共识
     * @return {Promise<object>}
     */
    send(txConfig, waitConfirm) {
        if (typeof txConfig === 'string') {
            txConfig = JSON.parse(txConfig)
        }
        txConfig = checkChainID(txConfig, this.chainID)
        const tx = new Tx(txConfig)
        const txHash = tx.hash()
        if (!tx.sig) {
            throw new Error("can't send an unsigned transaction")
        }
        return this.requester.send(`${TX_NAME}_sendTx`, [tx.toJson()]).then(async() => {
            if (!waitConfirm) {
                return txHash
            }
            await this.txWatcher.waitTx(txHash)
            return txHash
        })
    },
    /**
     * Sign transaction and return the config which used to call lemo.tx.send
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @return {string}
     */
    sign(privateKey, txConfig) {
        txConfig = checkChainID(txConfig, this.chainID)
        const tx = new Tx(txConfig)
        tx.signWith(privateKey)
        return JSON.stringify(tx.toJson())
    },
    /**
     * Sign a special transaction to set vote target
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @return {string}
     */
    signVote(privateKey, txConfig) {
        txConfig = checkChainID(txConfig, this.chainID)
        const tx = new VoteTx(txConfig)
        tx.signWith(privateKey)
        return JSON.stringify(tx.toJson())
    },
    /**
     * Sign a special transaction to register or edit candidate information
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @param {object} candidateInfo Candidate information
     * @return {string}
     */
    signCandidate(privateKey, txConfig, candidateInfo) {
        txConfig = checkChainID(txConfig, this.chainID)
        const tx = new CandidateTx(txConfig, candidateInfo)
        tx.signWith(privateKey)
        return JSON.stringify(tx.toJson())
    },
    /**
    * watch and filter transaction of block
    * @param {object} filterTxConfig  transaction
    * @param {Function} callback
    * @return {number}
    */
    watchTx(filterTxConfig, callback) {
        return this.txWatcher.watchTx(filterTxConfig, callback)
    },
    /**
    * stop watching and filtering transaction of block
    * @param {number}
    */
    stopWatchTx(watchTxId) {
        this.txWatcher.stopWatchTx(watchTxId)
    },
}

export default {
    moduleName: TX_NAME,
    apis,
}
