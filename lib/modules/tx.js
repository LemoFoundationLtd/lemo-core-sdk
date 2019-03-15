import Tx from '../tx/tx'
import VoteTx from '../tx/vote_tx'
import CandidateTx from '../tx/candidate_tx'
import {parseTxRes, parseTxListRes} from '../network/data_parser'
import {checkChainID} from '../tx/tx_helper'
import {TX_POLL_MAX_TIME_OUT} from '../config'
import {TX_NAME} from '../const'

/**
 * Poll transaction's hash
 * @param {string|number} txHash Hash of transaction
 * @param {Requester} requester
 * @return {Promise<string>}
 */
function pollTxHash(txHash, requester) {
    return new Promise((resolve, reject) => {
        const watchId = requester.watch(`${TX_NAME}_getTxByHash`, [txHash], result => {
            if (!result) {
                return
            }
            requester.stopWatch(watchId)
            clearTimeout(setTimeoutId)
            resolve(txHash)
        })
        const setTimeoutId = setTimeout(() => {
            requester.stopWatch(watchId)
            reject(new Error('transaction query timeout'))
        }, TX_POLL_MAX_TIME_OUT)
    })
}

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
        return this.requester.send(`${TX_NAME}_sendTx`, [tx.toJson()]).then(txHash => {
            if (!waitConfirm) {
                return txHash
            }
            return pollTxHash(txHash, this.requester)
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
        if (!tx.r || !tx.s) {
            throw new Error("can't send an unsigned transaction")
        }
        return this.requester.send(`${TX_NAME}_sendTx`, [tx.toJson()]).then(txHash => {
            if (!waitConfirm) {
                return txHash
            }
            return pollTxHash(txHash, this.requester)
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
}

export default {
    moduleName: TX_NAME,
    apis,
}
