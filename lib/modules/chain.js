import {isHash} from '../utils'
import {CHAIN_NAME} from '../const'


const apis = {
    /**
     * Get current block information
     * @param {boolean?} withBody Get the body detail if true
     * @return {Promise<object>}
     */
    async getNewestBlock(withBody) {
        const block = await this.requester.send(`${CHAIN_NAME}_currentBlock`, [!!withBody])
        return this.parser.parseBlock(this.chainID, block, withBody)
    },
    /**
     * Get Unstable block information
     * @param {boolean?} withBody Get the body detail if true
     * @return {Promise<object>}
     */
    async getNewestUnstableBlock(withBody) {
        const block = await this.requester.send(`${CHAIN_NAME}_unstableBlock`, [!!withBody])
        return this.parser.parseBlock(this.chainID, block, withBody)
    },
    /**
     * Get the specific block information
     * @param {string|number} hashOrHeight Hash or height which used to find the block
     * @param {boolean?} withBody Get the body detail if true
     * @return {Promise<object>}
     */
    async getBlock(hashOrHeight, withBody) {
        const apiName = isHash(hashOrHeight) ? 'getBlockByHash' : 'getBlockByHeight'
        const block = await this.requester.send(`${CHAIN_NAME}_${apiName}`, [hashOrHeight, !!withBody])
        return this.parser.parseBlock(this.chainID, block, withBody)
    },
    /**
     * Get the current height of chain head block
     * @return {Promise<number>}
     */
    getNewestHeight() {
        return this.requester.send(`${CHAIN_NAME}_currentHeight`)
    },
    /**
     * Get the Unstable height of chain head block
     * @return {Promise<number>}
     */
    getNewestUnstableHeight() {
        return this.requester.send(`${CHAIN_NAME}_unstableHeight`)
    },
    /**
     * Get the information of genesis block, whose height is 0
     * @return {Promise<object>}
     */
    async getGenesis() {
        const result = await this.requester.send(`${CHAIN_NAME}_genesis`, [])
        return this.parser.parseBlock(this.chainID, result, true)
    },
    /**
     * Get the chainID of current connected blockchain
     * @return {Promise<number>}
     */
    getChainID() {
        return this.requester.send(`${CHAIN_NAME}_chainID`, [])
    },
    /**
     * Get the version of lemochain node
     * @return {Promise<number>}
     */
    getNodeVersion() {
        return this.requester.send(`${CHAIN_NAME}_nodeVersion`, [])
    },
    /**
     * Get new blocks from now on
     * @param {boolean} withBody Get the body detail if true
     * @param {Function} callback It is used to deliver the block object
     * @return {number} subscribe id which used to stop watch
     */
    watchBlock(withBody, callback) {
        return this.blockWatcher.subscribe(withBody, callback)
    },
    stopWatchBlock(subscribeId) {
        this.blockWatcher.unsubscribe(subscribeId)
    },
    /**
     * Get top 30 candidates information
     * @return {Promise<object>}
     */
    async getCandidateTop30() {
        const result = await this.requester.send(`${CHAIN_NAME}_getCandidateTop30`, [])
        return (result || []).map(this.parser.parseCandidate)
    },
    /**
     * Get the address list of current deputy nodes
     * @return {Promise<object>}
     */
    getDeputyNodeList() {
        return this.requester.send(`${CHAIN_NAME}_getDeputyNodeList`, [])
    },
}

export default {
    moduleName: CHAIN_NAME,
    apis,
}
