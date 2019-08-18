import LemoUtils from 'lemo-utils'
import {ACCOUNT_NAME} from '../const'
import error from '../errors'

const apis = {
    /**
     * Get account information
     * @param {string} address
     * @return {Promise<object>}
     */
    async getAccount(address) {
        if (!LemoUtils.isLemoAddress(address)) {
            throw new Error(error.InvalidAddress(address))
        }
        const result = await this.requester.send(`${ACCOUNT_NAME}_getAccount`, [address])
        return this.parser.parseAccount(result)
    },
    /**
     * Get candidate information
     * @param {string} address
     * @return {Promise<object>}
     */
    async getCandidateInfo(address) {
        if (!LemoUtils.isLemoAddress(address)) {
            throw new Error(error.InvalidAddress(address))
        }
        const result = await this.requester.send(`${ACCOUNT_NAME}_getAccount`, [address])
        return this.parser.parseAccount(result).candidate
    },
    /**
     * Get balance from account
     * @param {string} address
     * @return {Promise<BigNumber>}
     */
    async getBalance(address) {
        if (!LemoUtils.isLemoAddress(address)) {
            throw new Error(error.InvalidAddress(address))
        }
        const result = await this.requester.send(`${ACCOUNT_NAME}_getBalance`, [address])
        return this.parser.parseMoney(result)
    },
}

export default {
    moduleName: ACCOUNT_NAME,
    apis,
}
