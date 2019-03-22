import {TX_POLL_MAX_TIME_OUT} from '../config'
import {TX_NAME} from '../const'

export default class {
    constructor(requester, blockWatcher, serverMode) {
        this.requester = requester // requester
        this.blockWatcher = blockWatcher // blockWatcher
        this.serverMode = serverMode // 服务端轮询模式
        this.setTimeoutId = 0
    }

    /**
    * Poll transaction's hash
     * @param {string|number} txHash Hash of transaction
    * @return {Promise<string>}
    */
    waitTx (txHash)  {
        return new Promise((resolve, reject) => {
            if (this.serverMode) {
                const subscribeId = this.blockWatcher.subscribe(true, (block) => {
                    if (block.transactions.length) {
                        const transaction = block.transactions.find(item => item.hash === txHash)
                        if (transaction) {
                            this.blockWatcher.unsubscribe(subscribeId)
                            clearTimeout(this.setTimeoutId)
                            resolve(txHash)
                        }
                    }
                })
                this.timeOut(subscribeId, reject)
            } else {
                const watchId = this.requester.watch(`${TX_NAME}_getTxByHash`, [txHash], result => {
                    if (!result) {
                        return
                    }
                    this.requester.stopWatch(watchId)
                    clearTimeout(this.setTimeoutId)
                    resolve(txHash)
                })
                this.timeOut(watchId, reject)
            }
        })
    }

    timeOut(id, reject) {
        this.setTimeoutId = setTimeout(() => {
            this.requester.stopWatch(id)
            reject(new Error('transaction query timeout'))
        }, TX_POLL_MAX_TIME_OUT)
    }
}


