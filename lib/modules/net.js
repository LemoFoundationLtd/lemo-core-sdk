const MODULE_NAME = 'net'

const apiList = {
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

const apis = Object.entries(apiList).map(([key, value]) => {
    return {name: key, ...value}
})

export default {
    moduleName: MODULE_NAME,
    apis,
}
