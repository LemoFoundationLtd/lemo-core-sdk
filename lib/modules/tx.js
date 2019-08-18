import LemoTx from 'lemo-tx'
import {TX_NAME} from '../const'
import errors from '../errors'

const apis = {
    /**
     * Send a signed transaction
     * @param {object|string|LemoTx} txConfig Transaction config returned by lemo.tx.sign
     * @param {string?} privateKey The private key from sender account
     * @return {Promise<object>}
     */
    send(txConfig, privateKey) {
        // create LemoTx instance
        let tx
        if (txConfig instanceof LemoTx) {
            tx = txConfig
        } else {
            if (typeof txConfig === 'string') {
                txConfig = JSON.parse(txConfig)
            }
            txConfig = checkChainID(txConfig, this.chainID)
            tx = new LemoTx(txConfig)
        }

        if (privateKey) {
            tx.signWith(privateKey)
        }
        if (!tx.sigs || !tx.sigs.length) {
            throw new Error(errors.InvalidTxSigs())
        }

        return this.requester.send(`${TX_NAME}_sendTx`, [tx.toJson()])
    },
    /**
     * wait for the transaction to be confirmed
     * @param {boolean} txHash 交易hash
     * @return {Promise<object>} transaction information
     */
    waitConfirm(txHash) {
        return this.txWatcher.waitTx(txHash)
    },
    /**
     * watch and filter transaction of block
     * @param {object} filterTxConfig  transaction
     * @param {Function} callback
     * @return {number} subscribeId
     */
    watchTx(filterTxConfig, callback) {
        return this.txWatcher.watchTx(filterTxConfig, callback)
    },
    /**
     * stop watching and filtering transaction of block
     * @param {number} subscribeId
     */
    stopWatchTx(subscribeId) {
        this.txWatcher.stopWatchTx(subscribeId)
    },
}

function checkChainID(config, chainID) {
    if (!config.chainID) {
        return {chainID, ...config}
    }
    if (parseInt(config.chainID, 10) !== chainID) {
        throw new Error(errors.TXInvalidChainID(chainID, config.chainID))
    }
    return config
}

export default {
    moduleName: TX_NAME,
    apis,
}
