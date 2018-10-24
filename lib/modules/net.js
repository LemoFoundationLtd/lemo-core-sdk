const MODULE_NAME = 'net'

const apiList = {
    getPeerCount: {
        method: `${MODULE_NAME}_getPeerCount`,
    },
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
