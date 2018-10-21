import HttpProvider from './provider/http_provider'
import Requester from './requester'
import chain from './modules/chain'
import mine from './modules/mine'
import net from './modules/net'
import Method from './method'

class LemoClient {
    constructor(config) {
        this.currentProvider = newProvider(config)
        this.requester = new Requester(this.currentProvider)

        this.createAPI(chain.moduleName, chain.methods)
        this.createAPI(mine.moduleName, mine.methods)
        this.createAPI(net.moduleName, net.methods)
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
    if (config && typeof config.host === 'string' && config.host.toLowerCase().startsWith('http')) {
        return new HttpProvider(config.host)
    }
    throw new Error(`unknown provider config: ${config}`)
}

LemoClient.newMethod = config => new Method(config)

export default LemoClient
