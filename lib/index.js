import BigNumber from 'bignumber.js'
import {DEFAULT_POLL_DURATION, MAX_POLL_RETRY, TX_POLL_MAX_TIME_OUT} from './config'
import HttpConn from './network/conn/http_conn'
import Requester from './network/requester'
import BlockWatcher from './watchers/block_watcher'
import TxWatcher from './watchers/tx_watcher'
import account from './modules/account'
import global from './modules/global'
import chain from './modules/chain'
import mine from './modules/mine'
import net from './modules/net'
import tx from './modules/tx'
import tool from './modules/tool'
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
            requester: {
                pollDuration: config.pollDuration || DEFAULT_POLL_DURATION, // The interval time of watching poll. It is in milliseconds
                maxPollRetry: config.maxPollRetry || MAX_POLL_RETRY,
            },
            serverMode: config.serverMode,
        }

        // The Object.defineProperty is not work in otto. but we can name fields with first letter '_' to make it invisible
        this._requester = new Requester(newConn(this.config.conn), this.config.requester)
        Object.defineProperty(this, '_requester', {enumerable: false})
        this._blockWatcher = new BlockWatcher(this._requester)
        Object.defineProperty(this, '_blockWatcher', {enumerable: false})
        this._txWatcher = new TxWatcher(
            this._requester,
            this._blockWatcher,
            {
                serverMode: this.config.serverMode,
                txPollTimeout: TX_POLL_MAX_TIME_OUT,
            },
        )
        Object.defineProperty(this, '_txWatcher', {enumerable: false})
        Object.defineProperty(this, '_createAPI', {
            enumerable: false,
            value: createAPI.bind(null, this),
        })

        attachModules(this)
        exposeUtils(this)
    }
}

function attachModules(lemo) {
    // modules
    createModule(lemo, '', global.apis)    // attach the apis from chain to 'this'
    createModule(lemo, account.moduleName, account.apis)
    createModule(lemo, '', chain.apis)    // attach the apis from chain to 'this'
    createModule(lemo, mine.moduleName, mine.apis)
    createModule(lemo, net.moduleName, net.apis)
    createModule(lemo, tx.moduleName, tx.apis)
    createModule(lemo, tool.moduleName, tool.apis)
    createModule(lemo, '', {watchTx: lemo._txWatcher.watchTx})
}

function exposeUtils(lemo) {
    lemo.BigNumber = BigNumber
}

/**
 * Create an module and attach to lemo object
 * @param {LemoClient} lemo
 * @param {string} moduleName Attach api methods to the sub module object of lemo. If moduleName is empty, then attach to lemo object
 * @param {Array|object} apis Api constructor config list
 */
function createModule(lemo, moduleName, apis) {
    Object.entries(apis).forEach(([key, value]) => {
        const apiConfig = {name: key}
        if (typeof value === 'function') {
            apiConfig.call = value
        } else {
            apiConfig.value = value
        }
        new Api(apiConfig, {
            requester: lemo._requester,
            chainID: lemo.config.chainID,
            blockWatcher: lemo._blockWatcher,
            txWatcher: lemo._txWatcher,
        }).attachTo(lemo, moduleName)
    })
}

/**
 * Create an remote call API and attach to lemo object
 * @param {LemoClient} lemo
 * @param {string} moduleName Attach api methods to the sub module object of lemo. If moduleName is empty, then attach to lemo object
 * @param {string} apiName Final api name you can call on lemo object
 * @param {string|Function} methodNameOrFunc The method name for remote API or customized function
 */
function createAPI(lemo, moduleName, apiName, methodNameOrFunc) {
    const config = {name: apiName}
    if (typeof methodNameOrFunc === 'function') {
        config.call = methodNameOrFunc
    } else if (typeof methodNameOrFunc === 'string') {
        config.call = (...args) => {
            return lemo._requester.send(`${moduleName}_${methodNameOrFunc}`, args)
        }
    } else {
        throw new Error(errors.InvalidAPIName(methodNameOrFunc))
    }
    new Api(config, {
        requester: lemo._requester,
        chainID: lemo.config.chainID,
        blockWatcher: lemo._blockWatcher,
        txWatcher: lemo._txWatcher,
    }).attachTo(lemo, moduleName)
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
