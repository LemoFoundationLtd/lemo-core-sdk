class Method {
    constructor(config, requester) {
        this.name = config.name
        this.inputFormatter = config.inputFormatter
        this.outputFormatter = config.outputFormatter
        this.call = config.call
        this.api = config.api
        this.requester = requester
    }

    attachTo(obj) {
        obj[this.name] = buildCall(this)
    }
}

function buildCall(method) {
    if (typeof method.call === 'function') {
        return method.call.bind(null, method.requester)
    }

    return async (...args) => {
        if (method.inputFormatter) {
            args = method.inputFormatter(args)
        }
        const result = await method.requester.send(method.api, args)
        if (method.outputFormatter) {
            return method.outputFormatter(result)
        }
        return result
    }
}

export default Method
