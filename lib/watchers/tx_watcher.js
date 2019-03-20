import {TX_POLL_MAX_TIME_OUT} from '../config'
import {TX_NAME} from '../const'

export default class {
    /**
    * Poll transaction's hash
     * @param {string|number} txHash Hash of transaction
    * @param {Requester} requester
    * @return {Promise<string>}
    */
    pollTxHash (txHash, requester)  {
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
}


