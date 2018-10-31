const MODULE_NAME = 'net'

const apiList = {
    /**
     * Get connected peer count from the lemochain node
     * @return {Promise<number>}
     */
    getPeerCount: {
        method: `${MODULE_NAME}_getPeerCount`,
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
    if (typeof value === 'function') {
        return {name: key, call: value}
    }
    return {name: key, ...value}
})

export default {
    moduleName: MODULE_NAME,
    apis,
}
