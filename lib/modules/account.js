import {strToBigNumber} from '../utils'

const MODULE_NAME = 'account'

const apiList = {
    getAccount: {
        method: `${MODULE_NAME}_getAccount`,
    },
    getBalance: {
        method: `${MODULE_NAME}_getBalance`,
        outputFormatter: strToBigNumber,
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
