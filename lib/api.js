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
     * @param {Signer} signer
     */
    constructor(config, requester, signer) {
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
        this.signer = signer
    }

    attachTo(obj) {
        if (typeof obj[this.name] !== 'undefined') {
            throw new Error(errors.UnavailableAPIName(this.name))
        }
        obj[this.name] = this.buildCall()
    }

    buildCall() {
        // bind 'this' of call, inputFormatter and outputFormatter to api instance
        if (typeof this.call === 'function') {
            return this.call.bind(this)
        }

        return async (...args) => {
            if (this.inputFormatter) {
                args = this.inputFormatter(...args)
                if (!Array.isArray(args)) {
                    throw new Error('inputFormatter must return array')
                }
            }
            const result = await this.requester.send(this.method, args)
            if (this.outputFormatter) {
                return this.outputFormatter(result)
            }
            return result
        }
    }
}

export default Api
