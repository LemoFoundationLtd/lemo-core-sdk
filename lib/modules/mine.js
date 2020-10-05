import {MINE_NAME} from '../const'

const apis = {
    /**
     * Return true if the lemochain node is mining
     * @return {Promise<boolean>}
     */
    async getMining() {
        return this.requester.send(`${MINE_NAME}_isMining`, [])
    },
    /**
     * Get miner address of the lemochain node
     * @return {Promise<string>}
     */
    async getMiner() {
        return this.requester.send(`${MINE_NAME}_miner`, [])
    },
}

export default {
    moduleName: MINE_NAME,
    apis,
}
