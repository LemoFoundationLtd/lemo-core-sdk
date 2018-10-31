import errors from './errors';

class Api {
    /**
     * Create api method and attach to lemo object
     * @param {object} config
     * @param {string} config.name The method name which attached to lemo object
     * @param {Function?} config.call The custom api function call. It should return a Promise for keeping same interface
     * @param {string?} config.method The remote api name
     * @param {Function?} config.inputFormatter Convert input data before send request
     * @param {Function?} config.outputFormatter Convert received data from request before return
     * @param {Requester} requester
     */
    constructor(config, requester) {
        if (!config || !config.name) {
            throw new Error(errors.InvalidAPIDefinition(config))
        }
        if (!!config.call === !!config.method) {
            throw new Error(errors.InvalidAPIMethod(config))
        }
        this.name = config.name
        this.inputFormatter = config.inputFormatter
        this.outputFormatter = config.outputFormatter
        this.call = config.call
        this.method = config.method
        this.requester = requester
    }

    attachTo(obj) {
        if (typeof obj[this.name] !== 'undefined') {
            throw new Error(errors.UnavailableAPIName(this.name))
        }
        obj[this.name] = buildCall(this)
    }
}

function buildCall(api) {
    if (typeof api.call === 'function') {
        return api.call.bind(null, api.requester)
    }

    return async (...args) => {
        if (api.inputFormatter) {
            args = api.inputFormatter(...args)
            if (!Array.isArray(args)) {
                throw new Error('inputFormatter must return array')
            }
        }
        const result = await api.requester.send(api.method, args)
        if (api.outputFormatter) {
            return api.outputFormatter(result)
        }
        return result
    }
}

export default Api
