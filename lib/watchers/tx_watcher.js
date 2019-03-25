import {TX_POLL_MAX_TIME_OUT} from '../config'
import {TX_NAME} from '../const'
import errors from '../errors'

export default class {
    constructor(requester, blockWatcher, serverMode) {
        this.requester = requester // requester
        this.blockWatcher = blockWatcher // blockWatcher
        this.serverMode = serverMode // 服务端轮询模式
    }

    /**
    * Poll transaction's hash
    * @param {string|number} txHash Hash of transaction
    * @return {Promise<string>}
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
            }, TX_POLL_MAX_TIME_OUT)
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
            }, TX_POLL_MAX_TIME_OUT)
        })
    }
}


