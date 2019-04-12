import {decodeAddress} from '../crypto'
import {TOOL_NAME} from '../const'
import {moToLemo, lemoToMo} from '../utils'

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
    moToLemo,

    /**
     * 将单位从LEMO的个数转换为mo
     * @param {number|string} ether
     * @return {BigNumber}
     */
    lemoToMo,
}

export default {
    moduleName: TOOL_NAME,
    apis,
}
