const MODULE_NAME = 'tx'

const apiList = {
    sendTx: {
        api: `${MODULE_NAME}_sendTx`,
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
