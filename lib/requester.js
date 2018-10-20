import jsonrpc from './jsonrpc'
import errors from './errors'

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
        const result = await this.provider.send(payload)
        if (!jsonrpc.isValidResponse(result)) {
            throw new Error(errors.InvalidResponse(result))
        }
        return result.result
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
        const results = await this.provider.send(payload)
        if (!Array.isArray(results)) {
            throw new Error(errors.InvalidResponse(results))
        }
        results.forEach(result => {
            if (!jsonrpc.isValidResponse(result)) {
                throw new Error(errors.InvalidResponse(result))
            }
        })
        return results
    }
}

export default Requester
