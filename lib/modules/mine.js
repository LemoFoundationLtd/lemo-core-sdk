import {MINE_NAME} from '../const'

const apis = {
    /**
     * Return true if the lemochain node is mining
     * @return {Promise<boolean>}
     */
    getMining() {
        return this.requester.send(`${MINE_NAME}_isMining`, [])
    },
    /**
     * Get miner address of the lemochain node
     * @return {Promise<string>}
     */
    getMiner() {
        return this.requester.send(`${MINE_NAME}_miner`, [])
    },
}

export default {
    moduleName: MINE_NAME,
    apis,
}
