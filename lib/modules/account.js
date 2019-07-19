import {ACCOUNT_NAME, TEMP_ACCOUNT_TYPE, CONTRACT_ACCOUNT_TYPE} from '../const'
import {createTempAddress} from '../utils'
import {generateAccount, decodeAddress, isLemoAddress} from '../crypto'
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
     * @return {Promise<BigNumber>}
     */
    async getBalance(address) {
        if (!isLemoAddress(address)) {
            throw new Error(error.InvalidAddress(address))
        }
        const result = await this.requester.send(`${ACCOUNT_NAME}_getBalance`, [address])
        return this.parser.parseMoney(result)
    },
    newKeyPair: generateAccount,
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
    isTempAddress(address) {
        const codeAddress = decodeAddress(address)
        // 截取0x开头的地址第三位和第四位， 用来判断账户类型
        return codeAddress.slice(2, 4) === TEMP_ACCOUNT_TYPE
    },
    /**
     * 判断当前账户是否为合约账户
     * @param {string} address
     * @return {boolean}
     */
    isContractAddress(address) {
        const codeAddress = decodeAddress(address)
        // 截取0x开头的地址第三位和第四位， 用来判断账户类型
        return codeAddress.slice(2, 4) === CONTRACT_ACCOUNT_TYPE
    },
}

export default {
    moduleName: ACCOUNT_NAME,
    apis,
}
