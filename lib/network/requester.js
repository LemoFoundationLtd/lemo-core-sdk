import {deepEqual} from '../utils'
import jsonrpc from './jsonrpc'
import errors from '../errors'
import {DEFAULT_POLL_DURATION, MAX_POLL_RETRY} from '../const'

/**
 * It's responsible for passing messages to conn
 */
class Requester {
    constructor(conn, config = {}) {
        if (!conn) {
            throw new Error(errors.InvalidConn())
        }
        this.conn = conn
        this.pollDuration = config.pollDuration !== undefined ? config.pollDuration : DEFAULT_POLL_DURATION
        this.maxPollRetry = config.maxPollRetry !== undefined ? config.maxPollRetry : MAX_POLL_RETRY
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
     * @callback WatchCallback
     * @param {object} result
     * @param {Error} error
     */
    /**
     * Poll till the response changed
     *
     * @param {string} method
     * @param {Array?} params An array of method params
     * @param {WatchCallback} callback The function to receive result
     * @return {number} The watchId which is used to stop watching
     */
    watch(method, params, callback) {
        if (typeof params === 'function' && typeof callback === 'undefined') {
            // no params
            callback = params
            params = undefined
        }

        let lastRes
        let errCount = 0
        const newWatchId = this.idGenerator++

        const poll = async () => {
            // console.log('poll', method)
            let result
            let error
            try {
                result = await this.send(method, params)
                errCount = 0
                if (deepEqual(result, lastRes)) {
                    return
                }
                lastRes = result
            } catch (e) {
                console.warn(`watch fail ${errCount + 1} times: ${e.message}`)
                if (++errCount <= this.maxPollRetry) {
                    return
                }
                error = e
            }
            if (this.watchers[newWatchId]) {
                if (error) {
                    this.stopWatch(newWatchId)
                }
                // put callback out of try block to expose user's error. the poll loop will stop
                callback(result, error)
            }
        }
        this.watchers[newWatchId] = setInterval(poll, this.pollDuration)
        // call first time immediately
        poll().catch(e => console.error(e))
        return newWatchId
    }

    /**
     * Stop a watching by watchId. If no watchId specified, stop all
     * @param {number?} watchId
     */
    stopWatch(watchId) {
        if (typeof watchId === 'undefined') {
            this.reset()
            return
        }
        if (this.watchers[watchId]) {
            clearInterval(this.watchers[watchId])
            delete this.watchers[watchId]
        }
    }

    /**
     * Stop all watching
     */
    reset() {
        Object.values(this.watchers).forEach(clearInterval)
        this.watchers = {}
    }

    /**
     * Return true if watching new data
     * @return {boolean}
     */
    isWatching() {
        return !!Object.keys(this.watchers).length
    }
}

export default Requester
