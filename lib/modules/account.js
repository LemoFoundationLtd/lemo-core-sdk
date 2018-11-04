import {parseMoney, parseAccount} from '../utils'

const MODULE_NAME = 'account'

const apiList = {
    /**
     * Get account information
     * @param {string} address
     * @return {Promise<object>}
     */
    getAccount: {
        method: `${MODULE_NAME}_getAccount`,
        outputFormatter: parseAccount,
    },
    /**
     * Get balance from account
     * @param {string} address
     * @return {Promise<BigNumber>}
     */
    getBalance: {
        method: `${MODULE_NAME}_getBalance`,
        outputFormatter: parseMoney,
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
