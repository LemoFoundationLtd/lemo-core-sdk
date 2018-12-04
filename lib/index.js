import BigNumber from 'bignumber.js'
import HttpConn from './network/conn/http_conn'
import Requester from './network/requester'
import Signer from './tx/signer'
import account from './modules/account'
import chain from './modules/chain'
import mine from './modules/mine'
import net from './modules/net'
import tx from './modules/tx'
import Api from './api'
import errors from './errors'

class LemoClient {
    constructor(config = {}) {
        this.config = {
            chainID: config.chainID || 1, // 1: LemoChain main net, 100 LemoChain test net
            conn: {
                send: config.send, // Custom requester. If this property is set, other conn config below will be ignored
                host: config.host || 'http://127.0.0.1:8001', // LemoChain node HTTP RPC address
                timeout: config.timeout, // LemoChain node HTTP RPC timeout
                username: config.username, // LemoChain node HTTP RPC authorise
                password: config.password, // LemoChain node HTTP RPC authorise
                headers: config.headers, // LemoChain node HTTP RPC Headers
            },
            pollDuration: config.pollDuration || 3000, // The interval time of watching pull. It is in milliseconds
            maxPollRetry: config.maxPollRetry || 5,
        }

        // The Object.defineProperty is not work in otto. but we can name fields with first letter '_' to make it invisible
        this._requester = new Requester(newConn(this.config.conn))
        Object.defineProperty(this, '_requester', {enumerable: false})
        Object.defineProperty(this, '_createAPI', {
            enumerable: false,
            value: createAPI.bind(null, this),
        })
        this._signer = new Signer(this.config.chainID)
        Object.defineProperty(this, '_signer', {enumerable: false})

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
        new Api(api, lemo._requester, lemo._signer).attachTo(moduleName ? lemo[moduleName] : lemo)
    })
}

/**
 * Create conn object by config
 * @param {object} config The conn constructor config
 * @return {object} Conn object
 */
function newConn(config) {
    // conn object. It will be implemented by go environment
    if (typeof config.send === 'function') {
        return config
    }
    // http conn config
    if (typeof config.host === 'string' && config.host.toLowerCase().startsWith('http')) {
        return new HttpConn(config.host, config.timeout, config.username, config.password, config.headers)
    }
    throw new Error(errors.invalidConnConfig(config))
}

export default LemoClient
