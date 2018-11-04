import { isHash, parseMoney, parseBlock } from '../utils'

const MODULE_NAME = 'chain'

const apiList = {
    /**
     * Get current block information
     * @param {Requester} requester
     * @param {boolean} stable Get stable block or the newest block without consensus
     * @param {boolean} withTxList Get the transactions detail if true
     * @return {Promise<object>}
     */
    getCurrentBlock: (requester, stable, withTxList) => {
        const apiName = stable ? 'latestStableBlock' : 'currentBlock'
        return requester.send(`${MODULE_NAME}_${apiName}`, [withTxList]).then(parseBlock)
    },
    /**
     * Get the specific block information
     * @param {Requester} requester
     * @param {string|number} hashOrHeight Hash or height which used to find the block
     * @param {boolean} withTxList Get the transactions detail if true
     * @return {Promise<object>}
     */
    getBlock: (requester, hashOrHeight, withTxList) => {
        const apiName = isHash(hashOrHeight) ? 'getBlockByHash' : 'getBlockByHeight'
        return requester.send(`${MODULE_NAME}_${apiName}`, [hashOrHeight, withTxList]).then(parseBlock)
    },
    /**
     * Get the current height of chain head block
     * @param {Requester} requester
     * @param {boolean} stable Get stable block or the newest block without consensus
     * @return {Promise<number>}
     */
    getCurrentHeight: (requester, stable) => {
        const apiName = stable ? 'latestStableHeight' : 'currentHeight'
        return requester.send(`${MODULE_NAME}_${apiName}`)
    },
    /**
     * Get the information of genesis block, whose height is 0
     * @return {Promise<object>}
     */
    getGenesis: {
        method: `${MODULE_NAME}_genesis`,
    },
    /**
     * Get the chainID of current connected blockchain
     * @return {Promise<number>}
     */
    getChainID: {
        method: `${MODULE_NAME}_chainID`,
    },
    /**
     * Get the gas price advice. It is used to make sure the transaction will be packaged in a few seconds
     * @return {Promise<BigNumber>}
     */
    getGasPriceAdvice: {
        method: `${MODULE_NAME}_gasPriceAdvice`,
        outputFormatter: parseMoney,
    },
    /**
     * Get the version of lemochain node
     * @return {Promise<number>}
     */
    getNodeVersion: {
        method: `${MODULE_NAME}_nodeVersion`,
    },
    /**
     * Get the version of sdk
     * @return {Promise<number>}
     */
    getSdkVersion: () => {
        // SDK_VERSION will be replaced by rollup
        if (!process.env.SDK_VERSION) {
            // These codes for test case. And the these codes will be removed by rollup tree shaking
            // eslint-disable-next-line global-require
            const packageJson = require('../../package.json')
            return Promise.resolve(packageJson.version)
        }
        return Promise.resolve(process.env.SDK_VERSION)
    },
    /**
     * Get new blocks from now on
     * @param {Requester} requester
     * @param {boolean} withTxList Get the transactions detail if true
     * @param {Function} callback It is used to deliver the block object
     * @return {number} watch id which used to stop watch
     */
    watchBlock: (requester, withTxList, callback) => {
        return requester.watch(`${MODULE_NAME}_latestStableBlock`, [withTxList], callback)
    },
}

const apis = Object.entries(apiList).map(([key, value]) => {
    if (typeof value === 'function') {
        return { name: key, call: value }
    }
    return { name: key, ...value }
})

export default {
    moduleName: MODULE_NAME,
    apis,
}
