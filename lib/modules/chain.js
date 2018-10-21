import {isHash, strToBigNumber, parseBlock} from '../utils'
import packageJson from '../../package.json'

const MODULE_NAME = 'chain'

const apiList = {
    getCurrentBlock: (requester, stable) => {
        const apiName = stable ? 'getCurrentBlock' : 'getLatestStableBlock'
        return requester.send(`${MODULE_NAME}_${apiName}`).then(parseBlock)
    },
    getBlock: (requester, hashOrHeight) => {
        const apiName = isHash(hashOrHeight) ? 'getBlockByHash' : 'getBlockByHeight'
        return requester.send(`${MODULE_NAME}_${apiName}`, [hashOrHeight]).then(parseBlock)
    },
    getCurrentHeight: (requester, stable) => {
        const apiName = stable ? 'getCurrentHeight' : 'getLatestStableHeight'
        return requester.send(`${MODULE_NAME}_${apiName}`)
    },
    getGasPriceAdvice: {
        api: `${MODULE_NAME}_gasPriceAdvice`,
        outputFormatter: strToBigNumber,
    },
    getNodeVersion: {
        api: `${MODULE_NAME}_getNodeVersion`,
    },
    // not necessary to write requester parameter
    getSdkVersion: () => packageJson.version,
    watchBlock: (requester, callback) => {
        return requester.watch(`${MODULE_NAME}_getLatestStableBlock`, callback)
    },
}

const methods = Object.entries(apiList).map(([key, value]) => {
    if (typeof value === 'function') {
        return {name: key, call: value}
    }
    return {name: key, ...value}
})

export default {
    moduleName: MODULE_NAME,
    methods,
}
