import {TX_POLL_MAX_TIME_OUT} from '../config'
import {TX_NAME} from '../const'
import errors from '../errors'
import parser from '../network/data_parser'

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
    * @return {Promise<Array>}
    */
    watchTx(filterTxConfig) {
        return new Promise((resolve, reject) => {
            if (!filterTxConfig) {
                reject(new Error('parameter can not be null'))
            }
            const resFilterTxArr = []
            const subscribeId = this.blockWatcher.subscribe(true, (block) => {
                block.transactions.forEach(txItem => {
                    if (Object.keys(filterTxConfig).every(filterTxKeyItem => txItem[filterTxKeyItem] === filterTxConfig[filterTxKeyItem])) {
                        resFilterTxArr.push(txItem)
                    }
                    console.log()
                })
                if (resFilterTxArr.length) {
                    this.blockWatcher.unsubscribe(subscribeId)
                    resolve(resFilterTxArr)
                }
            })
        })
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
                reject(errors.InvalidPollTxTimeOut())
            }, this.txPollTimeout)
        })
    }

    waitTxByGetTxByHash(txHash) {
        return new Promise((resolve, reject) => {
            const watchId = this.requester.watch(`${TX_NAME}_getTxByHash`, [txHash], result => {
                if (!result) {
                    return
                }
                this.requester.stopWatch(watchId)
                clearTimeout(timeoutId)
                resolve(result)
            })
            const timeoutId = setTimeout(() => {
                this.requester.stopWatch(watchId)
                reject(errors.InvalidPollTxTimeOut())
            }, this.txPollTimeout)
        })
    }
}


