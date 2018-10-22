import {isHash, strToBigNumber, parseBlock} from '../utils'

const MODULE_NAME = 'chain'

const apiList = {
    getCurrentBlock: (requester, stable) => {
        const apiName = stable ? 'currentBlock' : 'latestStableBlock'
        return requester.send(`${MODULE_NAME}_${apiName}`).then(parseBlock)
    },
    getBlock: (requester, hashOrHeight) => {
        const apiName = isHash(hashOrHeight) ? 'getBlockByHash' : 'getBlockByHeight'
        return requester.send(`${MODULE_NAME}_${apiName}`, [hashOrHeight]).then(parseBlock)
    },
    getCurrentHeight: (requester, stable) => {
        const apiName = stable ? 'currentHeight' : 'latestStableHeight'
        return requester.send(`${MODULE_NAME}_${apiName}`)
    },
    getGenesis: {
        api: `${MODULE_NAME}_genesis`,
    },
    getChainID: {
        api: `${MODULE_NAME}_chainID`,
    },
    getGasPriceAdvice: {
        api: `${MODULE_NAME}_gasPriceAdvice`,
        outputFormatter: strToBigNumber,
    },
    getNodeVersion: {
        api: `${MODULE_NAME}_nodeVersion`,
    },
    // not necessary to write requester parameter
    getSdkVersion: () => process.env.SDK_VERSION,
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
