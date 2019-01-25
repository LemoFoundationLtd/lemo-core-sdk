import {parseMoney, parseAccount} from '../network/data_parser'

const MODULE_NAME = 'account'

const apis = {
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

export default {
    moduleName: MODULE_NAME,
    apis,
}
