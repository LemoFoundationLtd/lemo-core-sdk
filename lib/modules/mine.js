const MODULE_NAME = 'mine'

const apis = {
    /**
     * Return true if the lemochain node is mining
     * @return {Promise<boolean>}
     */
    getMining() {
        return this.requester.send(`${MODULE_NAME}_isMining`, [])
    },
    /**
     * Get miner address of the lemochain node
     * @return {Promise<string>}
     */
    getMiner() {
        return this.requester.send(`${MODULE_NAME}_miner`, [])
    },
}

export default {
    moduleName: MODULE_NAME,
    apis,
}
