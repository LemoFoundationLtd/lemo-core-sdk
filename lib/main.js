import HttpProvider from './provider/http_provider'
import Requester from './requester'
import account from './modules/account'
import chain from './modules/chain'
import mine from './modules/mine'
import net from './modules/net'
import Method from './method'

// import Promise polyfill
// eslint-disable-next-line
const _ = Promise

class LemoClient {
    constructor(config) {
        this.currentProvider = newProvider(config)
        this.requester = new Requester(this.currentProvider)

        this.createAPI(account.moduleName, account.methods)
        this.createAPI(chain.moduleName, chain.methods)
        this.createAPI(mine.moduleName, mine.methods)
        this.createAPI(net.moduleName, net.methods)

        // attach the methods from chain to this object
        Object.entries(this.chain).forEach(([methodName, func]) => {
            this[methodName] = func
        })
    }

    createAPI(moduleName, methods) {
        if (!this[moduleName]) {
            this[moduleName] = {}
        }
        methods.forEach(method => {
            new Method(method, this.requester).attachTo(this[moduleName])
        })
    }
}

function newProvider(config) {
    if (!config) {
        return new HttpProvider()
    }
    if (config) {
        // provider object
        if (typeof config.send === 'function') {
            return config
        }
        // http provider config
        if (typeof config.host === 'string' && config.host.toLowerCase().startsWith('http')) {
            return new HttpProvider(config.host)
        }
    }
    throw new Error(`unknown provider config: ${config}`)
}

LemoClient.newMethod = config => new Method(config)

export default LemoClient
