const MODULE_NAME = 'tx'

const apiList = {
    sendTx: {
        method: `${MODULE_NAME}_sendTx`,
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
