import Tx from '../tx/tx'
import {parseTxRes, parseTxListRes} from '../network/data_parser'
import {TX_POLL_MAX_TIME_OUT} from '../config'
// import {resolve} from 'path'
// import {rejects} from 'assert'

const MODULE_NAME = 'tx'

/**
 * Poll transaction's hash
 * @param {string|number} txHash Hash of transaction
 * @return {Promise<string>}
 */

const pollTxHash = (txHash, requester) => {
    return new Promise((resolve, reject) => {
        const watchId = requester.watch(`${MODULE_NAME}_getTxByHash`, [txHash], result => {
            if (!result) {
                return
            }
            if (result) {
                requester.stopWatch(watchId)
                clearTimeout(setTimeoutId)
                resolve(result)
            }
        })
        const setTimeoutId = setTimeout(() => {
            if (!watchId) {
                requester.stopWatch(watchId)
                return
            }
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
        const result = await this.requester.send(`${MODULE_NAME}_getTxByHash`, [txHash])
        if (!result) {
            return null
        }
        return parseTxRes(this.signer, result)
    },
    /**
     * Get transactions' information in account
     * @param {string} address Account address
     * @param {number} index Index of transactions
     * @param {number} limit The count of transactions required
     * @return {Promise<object>}
     */
    async getTxListByAddress(address, index, limit) {
        const result = await this.requester.send(`${MODULE_NAME}_getTxListByAddress`, [address, index, limit])
        if (!result) {
            return null
        }
        return parseTxListRes(this.signer, result)
    },
    /**
     * Sign and send transaction
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @param {boolean} waitConfirm 等待交易共识
     * @return {Promise<object>}
     */
    sendTx(privateKey, txConfig, waitConfirm) {
        const tx = new Tx(txConfig)
        const hash = `0x${tx.hash().toString('hex')}`
        this.signer.sign(tx, privateKey)
        return this.requester.send(`${MODULE_NAME}_sendTx`, [tx.toJson()]).then(txHash => {
            if (!waitConfirm) {
                return txHash
            }
            return pollTxHash(hash, this.requester)
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
        const tx = new Tx(txConfig)
        const hash = `0x${tx.hash().toString('hex')}`
        if (!tx.r || !tx.s) {
            throw new Error("can't send an unsigned transaction")
        }
        return this.requester.send(`${MODULE_NAME}_sendTx`, [tx.toJson()]).then(txHash => {
            if (!waitConfirm) {
                return txHash
            }
            return pollTxHash(hash, this.requester)
        })
    },
    /**
     * Sign transaction and return the config which used to call lemo.tx.send
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @return {string}
     */
    sign(privateKey, txConfig) {
        const tx = new Tx(txConfig)
        this.signer.sign(tx, privateKey)
        return JSON.stringify(tx.toJson())
    },
    /**
     * Sign a special transaction to set vote target
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @return {string}
     */
    signVote(privateKey, txConfig) {
        const tx = Tx.createVoteTx(txConfig)
        this.signer.sign(tx, privateKey)
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
        const tx = Tx.createCandidateTx(txConfig, candidateInfo)
        this.signer.sign(tx, privateKey)
        return JSON.stringify(tx.toJson())
    },
}

export default {
    moduleName: MODULE_NAME,
    apis,
}
