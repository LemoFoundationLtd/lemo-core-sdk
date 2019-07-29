import {decodeAddress} from '../crypto'
import {moToLemo, lemoToMo, toBuffer} from '../utils'
import {TxType} from '../const'

export default {
    /**
     * The version of sdk
     * @return {string}
     */
    SDK_VERSION: getSdkVersion(),
    /**
     * The type enum of transaction
     * @return {object}
     */
    TxType,
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

function getSdkVersion() {
    // SDK_VERSION will be replaced by rollup
    if (!process.env.SDK_VERSION) {
        // These codes for test case. And the these codes will be removed by rollup tree shaking
        // eslint-disable-next-line global-require
        const packageJson = require('../../package.json')
        return packageJson.version
    }
    return process.env.SDK_VERSION
}
