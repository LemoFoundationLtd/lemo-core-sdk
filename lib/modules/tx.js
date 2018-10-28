import Tx from '../tx'

const MODULE_NAME = 'tx'

const apiList = {
    sendTx: {
        method: `${MODULE_NAME}_sendTx`,
        imputFormatter: buildTx,
    },
    sign: {
        call(requester, txConfig, privateKey) {
            const tx = new Tx(txConfig)
            tx.sign(privateKey)
            return `0x${tx.serialize().toString('hex')}`
        }
    }
}

function buildTx(txConfig) {
    const tx = new Tx(txConfig)
    tx.sign('0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb')
    return tx
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
