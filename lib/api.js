import errors from './errors';

class Api {
    /**
     * Create api method and attach to lemo object
     * @param {object} config
     * @param {string} config.name The method name which attached to lemo object
     * @param {Function?} config.call The custom api function call
     * @param {*?} config.value The custom api value
     * @param {Requester?} requester
     * @param {number?} chainID
     */
    constructor(config, properties) {
        if (!config || !config.name) {
            throw new Error(errors.InvalidAPIDefinition(config))
        }
        if (!!config.call === !!config.value) {
            throw new Error(errors.InvalidAPIMethod(config))
        }
        this.name = config.name
        this.call = config.call
        this.value = config.value
        Object.keys(properties).forEach(item => {
            this[item] = properties[item]
        })
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

        if (this.value) {
            target[this.name] = this.value
        } else {
            target[this.name] = this.call.bind(this)
        }
    }
}

export default Api
