import jsonrpc from './jsonrpc'
import errors from '../errors'
import {POLL_DURATION, MAX_POLL_RETRY} from '../config'

/**
 * It's responsible for passing messages to conn
 */
class Requester {
    constructor(conn) {
        this.conn = conn
        this.idGenerator = 1 // used for generate watchId
        this.watchers = {} // key is watchId, value is timer
    }

    /**
     * Send request to lemo node asynchronously over RPC
     *
     * @param {string} method
     * @param {Array?} params an array of method params
     * @return {Promise}
     */
    async send(method, params) {
        if (!this.conn) {
            throw new Error(errors.InvalidConn())
        }

        const payload = jsonrpc.toPayload(method, params)
        let response = this.conn.send(payload)
        if (response && typeof response.then === 'function') {
            response = await response
        }
        if (!jsonrpc.isValidResponse(response)) {
            throw new Error(errors.InvalidResponse(response))
        }
        return response.result
    }

    /**
     * Send batch request to lemo node asynchronously over RPC
     *
     * @param {object[]} data
     * @param {string} data.method
     * @param {Array?} data.params an array of method params
     * @return {Promise}
     */
    async sendBatch(data) {
        if (!this.conn) {
            throw new Error(errors.InvalidConn())
        }

        const payload = jsonrpc.toBatchPayload(data)
        let response = this.conn.send(payload)
        if (response && typeof response.then === 'function') {
            response = await response
        }
        if (!Array.isArray(response)) {
            throw new Error(errors.InvalidResponse(response))
        }
        response.forEach(result => {
            if (!jsonrpc.isValidResponse(result)) {
                throw new Error(errors.InvalidResponse(result))
            }
        })
        return response
    }

    /**
     * Poll till the response changed
     *
     * @param {string} method
     * @param {Array?} params An array of method params
     * @param {Function} callback The function to receive result. it must be like function(result, error)
     * @return {number} The watchId which is used to stop watching
     */
    watch(method, params, callback) {
        if (typeof params === 'function' && typeof callback === 'undefined') {
            // no params
            callback = params
            params = undefined
        }

        let lastSig
        let errCount = 0
        const newWatchId = this.idGenerator++
        this.watchers[newWatchId] = setInterval(async () => {
            let result
            let error
            try {
                result = await this.send(method, params)
                errCount = 0
                const sig = getSig(result)
                if (sig === lastSig) {
                    return
                }
                lastSig = sig
            } catch (e) {
                console.error('watch fail:', e)
                if (++errCount <= MAX_POLL_RETRY) {
                    return
                }
                error = e
                this.stopWatch(newWatchId)
            }
            // put callback out of try block to expose user's error
            callback(result, error)
        }, POLL_DURATION)

        return newWatchId
    }

    /**
     * Stop a watching by watchId. If no watchId specified, stop all
     * @param {number|undefined} watchId
     */
    stopWatch(watchId) {
        if (!watchId) {
            this.reset()
            return
        }
        if (this.watchers[watchId] > 0) {
            clearInterval(this.watchers[watchId])
            delete this.watchers[watchId]
        }
    }

    /**
     * Stop all watching
     */
    reset() {
        const watchers = this.watchers
        this.watchers = {}
        Object.values(watchers).forEach(clearInterval)
    }

    /**
     * Return true if watching new data
     * @return {boolean}
     */
    isWatching() {
        return !!Object.keys(this.watchers).length
    }
}

/**
 * Get the signature of data
 * @param {object} data
 * @return {string}
 */
function getSig(data) {
    return JSON.stringify(data)
}

export default Requester
