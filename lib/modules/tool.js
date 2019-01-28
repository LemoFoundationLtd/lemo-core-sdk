import {decodeAddress} from '../crypto'

const MODULE_NAME = 'tool'

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
}

export default {
    moduleName: MODULE_NAME,
    apis,
}
