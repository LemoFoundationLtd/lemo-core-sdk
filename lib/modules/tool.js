import {decodeAddress} from '../crypto'
import {TX_NAME} from '../const'

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
    moduleName: TX_NAME,
    apis,
}
