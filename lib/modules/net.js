const MODULE_NAME = 'net'

const apis = {
    /**
     * Get connected peers count from the lemochain node
     * @return {Promise<number>}
     */
    getPeersCount: {
        method: `${MODULE_NAME}_peersCount`,
    },
    /**
     * Get the lemochain node information
     * @return {Promise<object>}
     */
    getInfo: {
        method: `${MODULE_NAME}_info`,
    },
}

export default {
    moduleName: MODULE_NAME,
    apis,
}
