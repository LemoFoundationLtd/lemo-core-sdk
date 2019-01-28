import {parseMoney, parseAccount} from '../network/data_parser'

const MODULE_NAME = 'account'

const apis = {
    /**
     * Get account information
     * @param {string} address
     * @return {Promise<object>}
     */
    async getAccount(address) {
        const result = await this.requester.send(`${MODULE_NAME}_getAccount`, [address])
        return parseAccount(result)
    },
    /**
     * Get balance from account
     * @param {string} address
     * @return {Promise<BigNumber>}
     */
    async getBalance(address) {
        const result = await this.requester.send(`${MODULE_NAME}_getBalance`, [address])
        return parseMoney(result)
    },
    /**
     * Get candidates' information
     * @return {Promise<object>}
     */
    async getCandidates() {
        const result = await this.requester.send(`${MODULE_NAME}_getCandidates`, [])
        return parseAccount(result)
    },
}

export default {
    moduleName: MODULE_NAME,
    apis,
}
