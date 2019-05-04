import {decodeAddress} from '../crypto'
import {TOOL_NAME} from '../const'
import {moToLemo, lemoToMo, toBuffer} from '../utils'

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
    /**
     * 将数据转换为Buffer类型
     * @param {number|string|BigNumber|Buffer|null} ether
     * @return {Buffer}
     */
    toBuffer,
}

export default {
    moduleName: TOOL_NAME,
    apis,
}
