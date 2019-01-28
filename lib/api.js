import errors from './errors';

class Api {
    /**
     * Create api method and attach to lemo object
     * @param {object} config
     * @param {string} config.name The method name which attached to lemo object
     * @param {Function} config.call The custom api function call. It should return a Promise for keeping same interface
     * @param {Requester?} requester
     * @param {Signer?} signer
     */
    constructor(config, requester, signer) {
        if (!config || !config.name || !config.call) {
            throw new Error(errors.InvalidAPIDefinition(config))
        }
        this.name = config.name
        this.call = config.call
        this.requester = requester
        this.signer = signer
    }

    attachTo(obj, moduleName) {
        if (moduleName && !obj[moduleName]) {
            obj[moduleName] = {}
        }
        const target = moduleName ? obj[moduleName] : obj
        if (typeof target !== 'object') {
            throw new Error(errors.UnavailableAPIModule(moduleName))
        }
        if (typeof target[this.name] !== 'undefined') {
            throw new Error(errors.UnavailableAPIName(this.name))
        }

        target[this.name] = this.call.bind(this)
    }
}

export default Api
