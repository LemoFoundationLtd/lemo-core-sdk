import HttpProvider from './provider/http_provider'
import Requester from './requester'
import chain from './modules/chain'
import Method from './method'

class LemoClient {
    constructor(provider) {
        this.requester = new Requester(provider)
        this.currentProvider = provider
        this.extend(chain.methods)
    }

    extend(methods) {
        methods.forEach(method => method.attachTo(this, this.requester))
    }
}

LemoClient.newProvider = config => {
    if (!config) {
        return new HttpProvider()
    }
    if (config && typeof config.url === 'string' && config.url.toLowerCase().startsWith('http')) {
        return new HttpProvider(config.url)
    }
    throw new Error(`unknown provider config: ${config}`)
}

LemoClient.newMethod = config => new Method(config)

export default LemoClient
