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
    /**
     * gets the address to vote for
     * @param address
     * @returns {Promise<string>}
     */
    getVoteFor(address) {
        if (!isLemoAddress(address)) {
            throw new Error(error.InvalidAddress(address))
        }
        return this.requester.send(`${ACCOUNT_NAME}_getVoteFor`, [address])
    },
    /**
     * Gain on current assets
     * @param address address is lemo address
     * @param assetId asset tx hash
     * @returns {*}
     */
    getAssetEquity(address, assetId) {
        if (!isLemoAddress(address)) {
            throw new Error(error.InvalidAddress(address))
        }
        if (!assetId) {
            throw new Error(error.InvalidEmptyFiled())
        }
        return this.requester.send(`${ACCOUNT_NAME}_getAssetEquity`, [address, assetId])
    },
}

export default {
    moduleName: ACCOUNT_NAME,
    apis,
}
