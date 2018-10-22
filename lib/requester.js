import jsonrpc from './jsonrpc'
import errors from './errors'
import {POLL_DURATION} from './config'

/**
 * It's responsible for passing messages to providers
 */
class Requester {
    constructor(provider) {
        this.provider = provider
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
     * @param {Array?} params an array of method params
     * @param {Function} callback an array of method params
     * @return {Function} the function to stop watching
     */
    watch(method, params, callback) {
        if (typeof params === 'function' && typeof callback === 'undefined') {
            callback = params
            params = undefined
        }

        let lastResult
        let errCount = 0
        const timer = setInterval(() => {
            this.send(method, params)
                .then(result => {
                    if (JSON.stringify(result) !== JSON.stringify(lastResult)) {
                        callback(result)
                    }
                    lastResult = result
                })
                .catch(e => {
                    console.error('watch fail:', e)
                    if (++errCount > 5) {
                        clearInterval(timer)
                    }
                })
        }, POLL_DURATION)
        return () => clearInterval(timer)
    }
}

export default Requester
