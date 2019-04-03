import {TX_POLL_MAX_TIME_OUT} from '../config'
import {TX_NAME} from '../const'
import errors from '../errors'

export default class {
    constructor(requester, blockWatcher, {serverMode, txPollTimeout}) {
        this.requester = requester // requester
        this.blockWatcher = blockWatcher // blockWatcher
        this.serverMode = serverMode // 服务端轮询模式
        this.txPollTimeout = txPollTimeout || TX_POLL_MAX_TIME_OUT // 轮询超时时间
    }

    /**
    * watch and filter transaction of block
    * @param {object} filterTxConfig  transaction
    * @param {Function} callback
    * @return {number}
    */
    watchTx(filterTxConfig, callback) {
        if (!filterTxConfig) {
            throw new Error('transaction parameter can not be null')
        }
        filterTxConfig = {
            type: filterTxConfig.type === undefined ? undefined : parseInt(filterTxConfig.type, 10),
            version: filterTxConfig.version === undefined ? undefined : parseInt(filterTxConfig.version, 10),
            to: filterTxConfig.to,
            toName: filterTxConfig.toName,
            message: filterTxConfig.message,
        }
        Object.keys(filterTxConfig).forEach(item => {
            if (filterTxConfig[item] === undefined) {
                delete filterTxConfig[item]
            }
        })
        const subscribeId = this.blockWatcher.subscribe(true, (block) => {
            const resFilterTxArr = block.transactions.filter(txItem => {
                if (Object.keys(filterTxConfig).every(filterTxKeyItem => txItem[filterTxKeyItem] === filterTxConfig[filterTxKeyItem])) {
                    return true
                }
                return false
            })
            if (resFilterTxArr.length) {
                callback(resFilterTxArr)
            }
        })
        return subscribeId
    }

    /**
    * stop watching and filtering transaction of block
    * @param {number} watchTxId
    */
    stopWatchTx(watchTxId) {
        this.blockWatcher.unsubscribe(watchTxId)
    }


    /**
    * Poll transaction's hash
    * @param {string|number} txHash Hash of transaction
    * @return {Promise<Object>}
    */
    waitTx(txHash) {
        if (this.serverMode) {
            return this.waitTxByWatchBlock(txHash)
        } else {
            return this.waitTxByGetTxByHash(txHash)
        }
    }

    waitTxByWatchBlock(txHash) {
        return new Promise((resolve, reject) => {
            const subscribeId = this.blockWatcher.subscribe(true, (block) => {
                if (block.transactions.length) {
                    const transaction = block.transactions.find(item => item.hash === txHash)
                    if (transaction) {
                        this.blockWatcher.unsubscribe(subscribeId)
                        clearTimeout(timeoutId)
                        resolve(transaction)
                    }
                }
            })
            const timeoutId = setTimeout(() => {
                this.blockWatcher.unsubscribe(subscribeId)
                reject(new Error(errors.InvalidPollTxTimeOut()))
            }, this.txPollTimeout)
        })
    }

    waitTxByGetTxByHash(txHash) {
        return new Promise((resolve, reject) => {
            const watchId = this.requester.watch(`${TX_NAME}_getTxByHash`, [txHash], (result, error) => {
                if (error) {
                    reject(error)
                    return
                }
                if (!result) {
                    return
                }
                this.requester.stopWatch(watchId)
                clearTimeout(timeoutId)
                resolve(result)
            })
            const timeoutId = setTimeout(() => {
                this.requester.stopWatch(watchId)
                reject(new Error(errors.InvalidPollTxTimeOut()))
            }, this.txPollTimeout)
        })
    }
}


