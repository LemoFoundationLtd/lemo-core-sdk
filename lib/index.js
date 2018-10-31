import BigNumber from 'bignumber.js'
import HttpConn from './network/conn/http_conn'
import Requester from './network/requester'
import account from './modules/account'
import chain from './modules/chain'
import mine from './modules/mine'
import net from './modules/net'
import tx from './modules/tx'
import Api from './api'
import errors from './errors'

class LemoClient {
    constructor(config) {
        // The Object.defineProperty is not work in otto. but we can name fields with first letter '_' to make it invisible
        this._requester = new Requester(newConn(config))
        Object.defineProperty(this, '_requester', {enumerable: false})
        Object.defineProperty(this, '_createAPI', {
            enumerable: false,
            value: createAPI.bind(null, this),
        })

        // modules
        this._createAPI(account.moduleName, account.apis)
        this._createAPI('', chain.apis)    // attach the apis from chain to 'this'
        this._createAPI(mine.moduleName, mine.apis)
        this._createAPI(net.moduleName, net.apis)
        this._createAPI(tx.moduleName, tx.apis)

        // utils
        this.BigNumber = BigNumber
    }

    /**
     * Stop a watching by watchId. If no watchId specified, stop all
     * @param {number|undefined} watchId
     */
    stopWatch(watchId) {
        return this._requester.stopWatch(watchId)
    }

    /**
     * Return true if watching new data
     * @return {boolean}
     */
    isWatching() {
        return this._requester.isWatching()
    }
}

/**
 * Create an API and attach to lemo object
 * @param {LemoClient} lemo
 * @param {string} moduleName Attach api methods to the sub module object of lemo. If moduleName is empty, then attach to lemo object
 * @param {Array} apis Api constructor config list
 */
function createAPI(lemo, moduleName, apis) {
    if (moduleName) {
        if (!lemo[moduleName]) {
            lemo[moduleName] = {}
        } else if (typeof lemo[moduleName] !== 'object') {
            throw new Error(errors.UnavailableAPIModule(moduleName))
        }
    }
    apis.forEach(api => {
        new Api(api, lemo._requester).attachTo(moduleName ? lemo[moduleName] : lemo)
    })
}

/**
 * Create conn object by config
 * @param {object?} config The conn constructor config
 * @return {object} Conn object
 */
function newConn(config) {
    if (!config) {
        return new HttpConn()
    }
    if (config) {
        // conn object. It will be implemented by go environment
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
