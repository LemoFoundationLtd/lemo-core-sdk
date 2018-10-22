const MODULE_NAME = 'net'

const apiList = {
    getPeerCount: {
        api: `${MODULE_NAME}_getPeerCount`,
    },
    getInfo: {
        api: `${MODULE_NAME}_info`,
    },
}

const methods = Object.entries(apiList).map(([key, value]) => {
    if (typeof value === 'function') {
        return {name: key, call: value}
    }
    return {name: key, ...value}
})

export default {
    moduleName: MODULE_NAME,
    methods,
}
