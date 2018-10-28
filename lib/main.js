import HttpConn from './network/conn/http_conn'
import Requester from './network/requester'
import account from './modules/account'
import chain from './modules/chain'
import mine from './modules/mine'
import net from './modules/net'
import tx from './modules/tx'
import Api from './api'
import errors from './errors';

// import Promise polyfill
// eslint-disable-next-line
const _ = Promise

class LemoClient {
    constructor(config) {
        // The Object.defineProperty is not work in otto. but we can name fields with first letter '_' to make it invisible
        Object.defineProperty(this, '_requester', {
            enumerable: false,
            value: new Requester(newConn(config)),
        });
        Object.defineProperty(this, '_createAPI', {
            enumerable: false,
            value: createAPI.bind(this),
        });

        this._createAPI(account.moduleName, account.apis)
        this._createAPI('', chain.apis)    // attach the apis from chain to 'this'
        this._createAPI(mine.moduleName, mine.apis)
        this._createAPI(net.moduleName, net.apis)
        this._createAPI(tx.moduleName, tx.apis)
    }

    stopWatch(watchId) {
        return this._requester.stopWatch(watchId)
    }
}

function createAPI(moduleName, apis) {
    if (moduleName) {
        if (!this[moduleName]) {
            this[moduleName] = {}
        } else if (typeof this[moduleName] !== 'object') {
            throw new Error(errors.UnavailableAPIModule(moduleName))
        }
    }
    apis.forEach(api => {
        new Api(api, this._requester).attachTo(moduleName ? this[moduleName] : this)
    })
}

function newConn(config) {
    if (!config) {
        return new HttpConn()
    }
    if (config) {
        // conn object
        if (typeof config.send === 'function') {
            return config
        }
        // http conn config
        if (typeof config.host === 'string' && config.host.toLowerCase().startsWith('http')) {
            return new HttpConn(config.host, config.timeout, config.username, config.password, config.headers)
        }
    }
    throw new Error(errors.invalidConnConfig(config))
}

export default LemoClient
