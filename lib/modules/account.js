import {ACCOUNT_NAME} from '../const'
import {createTempAddress} from '../utils'
import {generateAccount, decodeAddress} from '../crypto'

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
    /**
     * 获取指定资产类型的发行信息
     * @param {string} assetCode Account address
     * @return {Promise<object>}
     */
    async getAssetInfo(assetCode) {
        const result = await this.requester.send(`${ACCOUNT_NAME}_getAsset`, [assetCode])
        return this.parser.parseAssetInfo(result)
    },
    /**
     * 获取指定资产中保存的自定义数据
     * @param {string} assetId Asset Id
     * @return {Promise<object>}
     */
    async getAssetMetaData(assetId) {
        const result = await this.requester.send(`${ACCOUNT_NAME}_getMetaData`, [assetId])
        return this.parser.parseMetaData(result)
    },
    /**
     * Create temp address
     * @param {string} from Creator address
     * @param {string} userId User id
     * @return {string}
     */
    createTempAddress,
    /**
     * 判断当前账户是否为临时账户
     * @param {string} address
     * @return {boolean}
     */
    async isTempAddress(address) {
        const codeAddress = await decodeAddress(address)
        return codeAddress.slice(4, 6) === '03'
    },
    /**
     * 判断当前账户是否为合约账户
     * @param {string} address
     * @return {boolean}
     */
    async isContractAddress(address) {
        const codeAddress = await decodeAddress(address)
        return codeAddress.slice(4, 6) === '02'
    },
}

export default {
    moduleName: ACCOUNT_NAME,
    apis,
}
