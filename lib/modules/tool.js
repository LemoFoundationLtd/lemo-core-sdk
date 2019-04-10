import {decodeAddress} from '../crypto'
import {TOOL_NAME} from '../const'
import utils from '../utils'
import BigNumber from 'bignumber.js'

const apis = {
    /**
     * Verify a LemoChain address
     * @param {string} address
     * @return {string} verify error message
     */
    verifyAddress(address) {
        try {
            decodeAddress(address)
            return ''
        } catch (e) {
            return e.message
        }
    },
    /**
     * 将单位从mo转换为LEMO的个数
     * @param {number|string} mo
     * @return {BigNumber}
     */
    moToLemo(mo) {
        return utils.toBigNumber(mo).dividedBy(new BigNumber('1000000000000000000', 10));
    },

    /**
     * 将单位从LEMO的个数转换为mo
     * @param {number|string} ether
     * @return {BigNumber}
     */
    lemoToMo(ether) {
        return utils.toBigNumber(ether).times(new BigNumber('1000000000000000000', 10));
    },
}

export default {
    moduleName: TOOL_NAME,
    apis,
}
