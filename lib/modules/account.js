import {isLemoAddress} from 'lemo-utils'
import {ACCOUNT_NAME} from '../const'
import error from '../errors'

const apis = {
    /**
     * Get account information
     * @param {string} address
     * @return {Promise<object>}
     */
    async getAccount(address) {
        if (!isLemoAddress(address)) {
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
        if (!isLemoAddress(address)) {
            throw new Error(error.InvalidAddress(address))
        }
        const result = await this.requester.send(`${ACCOUNT_NAME}_getAccount`, [address])
        return this.parser.parseAccount(result).candidate
    },
    /**
     * Get balance from account
     * @param {string} address
     * @return {Promise<string>}
     */
    getBalance(address) {
        if (!isLemoAddress(address)) {
            throw new Error(error.InvalidAddress(address))
        }
        return this.requester.send(`${ACCOUNT_NAME}_getBalance`, [address])
    },
}

export default {
    moduleName: ACCOUNT_NAME,
    apis,
}
