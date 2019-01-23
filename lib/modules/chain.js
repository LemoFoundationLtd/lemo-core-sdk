import {isHash, parseMoney, parseBlock} from '../utils'

const MODULE_NAME = 'chain'

const apis = {
    /**
     * Get current block information
     * @param {boolean?} stable=true Get stable block or the newest block without consensus
     * @param {boolean?} withBody Get the body detail if true
     * @return {Promise<object>}
     */
    getCurrentBlock: {
        async call(stable, withBody) {
            const apiName = (typeof stable === 'undefined' || stable) ? 'latestStableBlock' : 'currentBlock'
            const block = await this.requester.send(`${MODULE_NAME}_${apiName}`, [!!withBody])
            return parseBlock(this.signer, block)
        },
    },
    /**
     * Get the specific block information
     * @param {string|number} hashOrHeight Hash or height which used to find the block
     * @param {boolean?} withBody Get the body detail if true
     * @return {Promise<object>}
     */
    getBlock: {
        async call(hashOrHeight, withBody) {
            const apiName = isHash(hashOrHeight) ? 'getBlockByHash' : 'getBlockByHeight'
            const block = await this.requester.send(`${MODULE_NAME}_${apiName}`, [hashOrHeight, !!withBody])
            return parseBlock(this.signer, block)
        },
    },
    /**
     * Get the current height of chain head block
     * @param {boolean?} stable=true Get stable block or the newest block without consensus
     * @return {Promise<number>}
     */
    getCurrentHeight: {
        call(stable) {
            const apiName = (typeof stable === 'undefined' || stable) ? 'latestStableHeight' : 'currentHeight'
            return this.requester.send(`${MODULE_NAME}_${apiName}`)
        },
    },
    /**
     * Get the information of genesis block, whose height is 0
     * @return {Promise<object>}
     */
    getGenesis: {
        method: `${MODULE_NAME}_genesis`,
        outputFormatter(block) {
            return parseBlock(this.signer, block)
        },
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
     * @return {string}
     */
    getSdkVersion: {
        call() {
            // SDK_VERSION will be replaced by rollup
            if (!process.env.SDK_VERSION) {
                // These codes for test case. And the these codes will be removed by rollup tree shaking
                // eslint-disable-next-line global-require
                const packageJson = require('../../package.json')
                return packageJson.version
            }
            return process.env.SDK_VERSION
        },
    },
    /**
     * Get new blocks from now on
     * @param {boolean} withBody Get the body detail if true
     * @param {Function} callback It is used to deliver the block object
     * @return {number} watch id which used to stop watch
     */
    watchBlock: {
        call(withBody, callback) {
            const watchHandler = (block) => {
                callback(parseBlock(this.signer, block))
            }
            return this.requester.watch(`${MODULE_NAME}_latestStableBlock`, [!!withBody], watchHandler)
        },
    },
}

export default {
    moduleName: MODULE_NAME,
    apis,
}
