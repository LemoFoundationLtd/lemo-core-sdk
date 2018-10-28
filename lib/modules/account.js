import {parseBigNumber, parseAccount} from '../utils'
import {sign} from '../crypto'

const MODULE_NAME = 'account'

const apiList = {
    getAccount: {
        method: `${MODULE_NAME}_getAccount`,
        outputFormatter: parseAccount,
    },
    getBalance: {
        method: `${MODULE_NAME}_getBalance`,
        outputFormatter: parseBigNumber,
    },
    signTx(privateHex, tx) {
        return tx.sign(Buffer.from(privateHex, 'hex'))
    },
    sign,
}

const apis = Object.entries(apiList).map(([key, value]) => {
    if (typeof value === 'function') {
        return {name: key, call: value}
    }
    return {name: key, ...value}
})

export default {
    moduleName: MODULE_NAME,
    apis,
}
