import {TX_POLL_MAX_TIME_OUT} from '../config'
import {TX_NAME} from '../const'

export default class {
    constructor(requester) {
        this.requester = requester // requester
    }

    /**
    * Poll transaction's hash
     * @param {string|number} txHash Hash of transaction
    * @return {Promise<string>}
    */
    pollTxHash (txHash)  {
        return new Promise((resolve, reject) => {
            const watchId =   this.requester.watch(`${TX_NAME}_getTxByHash`, [txHash], result => {
                if (!result) {
                    return
                }
                this.requester.stopWatch(watchId)
                clearTimeout(setTimeoutId)
                resolve(txHash)
            })
            const setTimeoutId = setTimeout(() => {
                this.requester.stopWatch(watchId)
                reject(new Error('transaction query timeout'))
            }, TX_POLL_MAX_TIME_OUT)
        })
    }
}


