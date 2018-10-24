class Api {
    constructor(config, requester) {
        this.name = config.name
        this.inputFormatter = config.inputFormatter
        this.outputFormatter = config.outputFormatter
        this.call = config.call
        this.method = config.method
        this.requester = requester
    }

    attachTo(obj) {
        obj[this.name] = buildCall(this)
    }
}

function buildCall(api) {
    if (typeof api.call === 'function') {
        return api.call.bind(null, api.requester)
    }

    return async (...args) => {
        if (api.inputFormatter) {
            args = api.inputFormatter(args)
        }
        const result = await api.requester.send(api.method, args)
        if (api.outputFormatter) {
            return api.outputFormatter(result)
        }
        return result
    }
}

export default Api
