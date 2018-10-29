import Tx from '../tx'

const MODULE_NAME = 'tx'

const apiList = {
    // sign and send tx
    sendTx: {
        method: `${MODULE_NAME}_sendTx`,
        inputFormatter: buildAndSignTx,
    },
    // send a signed tx
    send: {
        method: `${MODULE_NAME}_sendTx`,
        inputFormatter: buildSignedTx,
    },
    // sign tx then print json code
    sign(requester, privateKey, txConfig) {
        const tx = new Tx(txConfig)
        tx.sign(privateKey)
        return Promise.resolve(JSON.stringify(tx.toJson()))
    },
}

function buildAndSignTx(privateKey, txConfig) {
    const tx = new Tx(txConfig)
    tx.sign(privateKey)
    return [tx.toJson()]
}

function buildSignedTx(txConfig) {
    const tx = new Tx(txConfig)
    if (!tx.r || !tx.s) {
        throw new Error('can\'t send an unsigned transaction')
    }
    return [tx.toJson()]
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
