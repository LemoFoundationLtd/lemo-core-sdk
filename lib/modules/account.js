import {parseMoney, parseAccount} from '../network/data_parser'
import {ACCOUNT_NAME} from '../const'


const apis = {
    /**
     * Get account information
     * @param {string} address
     * @return {Promise<object>}
     */
    async getAccount(address) {
        const result = await this.requester.send(`${ACCOUNT_NAME}_getAccount`, [address])
        return parseAccount(result)
    },
    /**
     * Get candidate information
     * @param {string} address
     * @return {Promise<object>}
     */
    async getCandidateInfo(address) {
        const result = await this.requester.send(`${ACCOUNT_NAME}_getAccount`, [address])
        return parseAccount(result).candidate
    },
    /**
     * Get balance from account
     * @param {string} address
     * @return {Promise<BigNumber>}
     */
    async getBalance(address) {
        const result = await this.requester.send(`${ACCOUNT_NAME}_getBalance`, [address])
        return parseMoney(result)
    },
}

export default {
    moduleName: ACCOUNT_NAME,
    apis,
}
