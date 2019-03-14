import {isHash} from '../utils'
import {parseMoney, parseBlock, parseCandidateListRes, parseCandidate} from '../network/data_parser'
import {processBlock} from './blocks_processor'

const MODULE_NAME = 'chain'


const apis = {
    /**
     * Get current block information
     * @param {boolean?} stable=true Get stable block or the newest block without consensus
     * @param {boolean?} withBody Get the body detail if true
     * @return {Promise<object>}
     */
    async getCurrentBlock(stable, withBody) {
        const apiName = (typeof stable === 'undefined' || stable) ? 'latestStableBlock' : 'currentBlock'
        const block = await this.requester.send(`${MODULE_NAME}_${apiName}`, [!!withBody])
        return parseBlock(this.chainID, block, withBody)
    },
    /**
     * Get the specific block information
     * @param {string|number} hashOrHeight Hash or height which used to find the block
     * @param {boolean?} withBody Get the body detail if true
     * @return {Promise<object>}
     */
    async getBlock(hashOrHeight, withBody) {
        const apiName = isHash(hashOrHeight) ? 'getBlockByHash' : 'getBlockByHeight'
        const block = await this.requester.send(`${MODULE_NAME}_${apiName}`, [hashOrHeight, !!withBody])
        return parseBlock(this.chainID, block, withBody)
    },
    /**
     * Get the current height of chain head block
     * @param {boolean?} stable=true Get stable block or the newest block without consensus
     * @return {Promise<number>}
     */
    getCurrentHeight(stable) {
        const apiName = (typeof stable === 'undefined' || stable) ? 'latestStableHeight' : 'currentHeight'
        return this.requester.send(`${MODULE_NAME}_${apiName}`)
    },
    /**
     * Get the information of genesis block, whose height is 0
     * @return {Promise<object>}
     */
    async getGenesis() {
        const result = await this.requester.send(`${MODULE_NAME}_genesis`, [])
        return parseBlock(this.chainID, result, true)
    },
    /**
     * Get the chainID of current connected blockchain
     * @return {Promise<number>}
     */
    getChainID() {
        return this.requester.send(`${MODULE_NAME}_chainID`, [])
    },
    /**
     * Get the gas price advice. It is used to make sure the transaction will be packaged in a few seconds
     * @return {Promise<BigNumber>}
     */
    async getGasPriceAdvice() {
        const result = await this.requester.send(`${MODULE_NAME}_gasPriceAdvice`, [])
        return parseMoney(result)
    },
    /**
     * Get the version of lemochain node
     * @return {Promise<number>}
     */
    getNodeVersion() {
        return this.requester.send(`${MODULE_NAME}_nodeVersion`, [])
    },
    /**
     * Get new blocks from now on
     * @param {boolean} withBody Get the body detail if true
     * @param {Function} callback It is used to deliver the block object
     * @return {number} watch id which used to stop watch
     */
    watchBlock(withBody, callback) {
        const fetchBlock = (height) => {
            return this.requester.send('chain_getBlockByHeight', [height, !!withBody]).then(result => {
                return  parseBlock(this.chainID, result, withBody)
            })
        }
        const watchHandler = block => {
            const newBlock = parseBlock(this.chainID, block, withBody)
            processBlock(fetchBlock, newBlock, callback)
        }
        return this.requester.watch(`${MODULE_NAME}_latestStableBlock`, [!!withBody], watchHandler)
    },
    /**
     * Get paged candidates information
     * @param {number} index Index of candidates
     * @param {number} limit Max count of required candidates
     * @return {Promise<object>}
     */
    async getCandidateList(index, limit) {
        const result = await this.requester.send(`${MODULE_NAME}_getCandidateList`, [index, limit])
        return parseCandidateListRes(result)
    },
    /**
     * Get top 30 candidates information
     * @return {Promise<object>}
     */
    async getCandidateTop30() {
        const result = await this.requester.send(`${MODULE_NAME}_getCandidateTop30`, [])
        return (result || []).map(parseCandidate)
    },
    /**
     * Get the address list of current deputy nodes
     * @return {Promise<object>}
     */
    getDeputyNodeList() {
        return this.requester.send(`${MODULE_NAME}_getDeputyNodeList`, [])
    },
}

export default {
    moduleName: MODULE_NAME,
    apis,
}
