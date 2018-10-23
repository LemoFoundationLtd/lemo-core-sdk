import HttpProvider from './provider/http_provider'
import Requester from './requester'
import account from './modules/account'
import chain from './modules/chain'
import mine from './modules/mine'
import net from './modules/net'
import tx from './modules/tx'
import Method from './method'

// import Promise polyfill
// eslint-disable-next-line
const _ = Promise

let requester

class LemoClient {
    constructor(config) {
        // do not let requester be a property of this, so that it is not enumerable. P.S. the Object.defineProperties is not work in otto
        requester = new Requester(newProvider(config))

        this.createAPI(account.moduleName, account.methods)
        this.createAPI('', chain.methods)    // attach the methods from chain to this object
        this.createAPI(mine.moduleName, mine.methods)
        this.createAPI(net.moduleName, net.methods)
        this.createAPI(tx.moduleName, tx.methods)
    }

    createAPI(moduleName, methods) {
        if (moduleName && !this[moduleName]) {
            this[moduleName] = {}
        }
        methods.forEach(method => {
            new Method(method, requester).attachTo(moduleName ? this[moduleName] : this)
        })
    }

    stopWatch(watchId) {
        return requester.stopWatch(watchId)
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
