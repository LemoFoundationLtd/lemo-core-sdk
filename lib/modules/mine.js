const MODULE_NAME = 'mine'

const apiList = {
    getMining: {
        method: `${MODULE_NAME}_isMining`,
    },
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
