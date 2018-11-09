import Tx from '../tx'

const MODULE_NAME = 'tx'

const apiList = {
    /**
     * Sign and send transaction
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @return {Promise<object>}
     */

    sendTx: {
        method: `${MODULE_NAME}_sendTx`,
        inputFormatter: buildAndSignTx,
    },
    /**
     * Send a signed transaction
     * @param {object} txConfig Transaction config
     * @return {Promise<object>}
     */
    send: {
        method: `${MODULE_NAME}_sendTx`,
        inputFormatter: buildSignedTx,
    },
    /**
     * Sign transaction and return the config which used to call lemo.tx.send
     * @param {Requester} requester
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @return {Promise<string>}
     */
    sign(requester, privateKey, txConfig) {
        const tx = new Tx(txConfig)
        tx.sign(privateKey)
        return Promise.resolve(JSON.stringify(tx.toJson()))
    },
}

/**
 * @param {string} privateKey The private key from sender account
 * @param {object} txConfig Transaction config
 * @return {Array} parameters for api
 */
function buildAndSignTx(privateKey, txConfig) {
    const tx = new Tx(txConfig)
    tx.sign(privateKey)
    return [tx.toJson()]
}

/**
 * @param {object} txConfig Signed transaction config returned by lemo.tx.sign
 * @return {Array} parameters for api
 */
function buildSignedTx(txConfig) {
    if (typeof txConfig === 'string') {
        txConfig = JSON.parse(txConfig)
    }
    const tx = new Tx(txConfig)
    if (!tx.r || !tx.s) {
        throw new Error("can't send an unsigned transaction")
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
