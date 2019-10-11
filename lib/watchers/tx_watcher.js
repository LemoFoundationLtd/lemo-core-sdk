import {TX_POLL_MAX_TIME_OUT, TX_NAME} from '../const'
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
     * @param {?string|number} expirationTime Transaction expiration time，This only works if serverMode exists
     * @return {Promise<Object>}
     */
    waitTx(txHash, expirationTime) {
        if (this.serverMode) {
            return this.waitTxByWatchBlock(txHash, expirationTime)
        } else {
            return this.waitTxByGetTxByHash(txHash)
        }
    }

    waitTxByWatchBlock(txHash, expirationTime) {
        let pollValue = 0
        return new Promise((resolve, reject) => {
            const subscribeId = this.blockWatcher.subscribe(true, async (block) => {
                if (expirationTime && expirationTime < block.header.timestamp) {
                    reject(new Error(errors.InvalidTxTimeOut()))
                }
                // 1.If the first query finds this block, return the final result
                if (block.transactions.length) {
                    const transaction = block.transactions.find(item => item.hash === txHash)
                    if (transaction) {
                        this.blockWatcher.unsubscribe(subscribeId)
                        clearTimeout(timeoutId)
                        resolve(transaction)
                    } else pollValue++
                }
                // The transaction hash is used to check whether there is a transaction
                // 2.If don't find this block in the first time, query by transaction hash, only query one time
                if (pollValue === 1) {
                    const result = await this.requester.send(`${TX_NAME}_getTxByHash`, [txHash])
                    if (result) {
                        this.blockWatcher.unsubscribe(subscribeId)
                        clearTimeout(timeoutId)
                        resolve(result)
                    } else pollValue++
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


