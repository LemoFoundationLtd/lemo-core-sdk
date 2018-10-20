class Method {
    constructor(config) {
        this.module = config.module
        this.name = config.name
        this.call = config.call
        this.inputFormatter = config.inputFormatter
        this.outputFormatter = config.outputFormatter
    }

    attachTo(obj, requester) {
        if (!obj[this.module]) {
            obj[this.module] = {}
        }
        obj[this.module][this.name] = buildCall(this, requester)
    }
}

function buildCall(method, requester) {
    if (typeof method.call === 'function') {
        return method.call
    }
    return (...args) => {
        return requester.send(`${method.module}_${method.call}`, args)
    }
}

export default Method
