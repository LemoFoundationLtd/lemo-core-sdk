import jsonrpc from './jsonrpc'
import errors from './errors'
import {POLL_DURATION, MAX_POLL_RETRY} from './config'

/**
 * It's responsible for passing messages to providers
 */
class Requester {
    constructor(provider) {
        this.provider = provider
        this.idGenerator = 0 // used for generate watchId
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
        if (!this.provider) {
            throw new Error(errors.InvalidProvider())
        }

        const payload = jsonrpc.toPayload(method, params)
        let response = this.provider.send(payload)
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
        if (!this.provider) {
            throw new Error(errors.InvalidProvider())
        }

        const payload = jsonrpc.toBatchPayload(data)
        let response = this.provider.send(payload)
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
     * poll till the response changed
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
            let result, error
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

    stopWatch(watchId) {
        if (this.watchers[watchId] > 0) {
            clearInterval(this.watchers[watchId])
            delete this.watchers[watchId]
        }
    }

    /**
     * stop all watching
     */
    reset() {
        const timers = this.watchers
        this.watchers = {}
        Object.values(timers).forEach(clearInterval)
    }
}

// get the signature of data
function getSig(data) {
    return JSON.stringify(data)
}

export default Requester
