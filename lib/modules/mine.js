const MODULE_NAME = 'mine'

const apiList = {
    /**
     * Return true if the lemochain node is mining
     * @return {Promise<boolean>}
     */
    getMining: {
        method: `${MODULE_NAME}_isMining`,
    },
    /**
     * Get miner address of the lemochain node
     * @return {Promise<string>}
     */
    getLemoBase: {
        method: `${MODULE_NAME}_lemoBase`,
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
