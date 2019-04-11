import {ACCOUNT_NAME} from '../const'
import {generateAccount} from '../crypto'

const apis = {
    /**
     * Get account information
     * @param {string} address
     * @return {Promise<object>}
     */
    async getAccount(address) {
        const result = await this.requester.send(`${ACCOUNT_NAME}_getAccount`, [address])
        return this.parser.parseAccount(result)
    },
    /**
     * Get candidate information
     * @param {string} address
     * @return {Promise<object>}
     */
    async getCandidateInfo(address) {
        const result = await this.requester.send(`${ACCOUNT_NAME}_getAccount`, [address])
        return this.parser.parseAccount(result).candidate
    },
    /**
     * Get balance from account
     * @param {string} address
     * @return {Promise<BigNumber>}
     */
    async getBalance(address) {
        const result = await this.requester.send(`${ACCOUNT_NAME}_getBalance`, [address])
        return this.parser.parseMoney(result)
    },
    newKeyPair: generateAccount,
    /**
     * 获取指定账户持有的所有资产权益
     * @param {string} address Account address
     * @param {number} index Index of equities
     * @param {number} limit The count of equities required
     * @return {Promise<object>}
     */
    async getAllAssets(address, index, limit) {
        const result = await this.requester.send(`${ACCOUNT_NAME}_getAssetEquity`, [address, index, limit])
        return this.parser.parseAsset(result)
    },
}

export default {
    moduleName: ACCOUNT_NAME,
    apis,
}
