import {TX_POLL_MAX_TIME_OUT} from '../config'
import {TX_NAME} from '../const'

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
    waitTx (txHash)  {
        return new Promise((resolve, reject) => {
            let watchId
            if (this.serverMode) {
                watchId = this.blockWatcher(true, (block) => {
                    if (block.transactions.length) {
                        block.transactions.some(item => {
                            if (item.hash === txHash) {
                                this.requester.stopWatch(watchId)
                                clearTimeout(setTimeoutId)
                                resolve(txHash)
                                return true
                            }
                            return false
                        })
                    }
                })
            } else {
                watchId = this.requester.watch(`${TX_NAME}_getTxByHash`, [txHash], result => {
                    if (!result) {
                        return
                    }
                    this.requester.stopWatch(watchId)
                    clearTimeout(setTimeoutId)
                    resolve(txHash)
                })
            }
            const setTimeoutId = setTimeout(() => {
                this.requester.stopWatch(watchId)
                reject(new Error('transaction query timeout'))
            }, TX_POLL_MAX_TIME_OUT)
        })
    }
}


