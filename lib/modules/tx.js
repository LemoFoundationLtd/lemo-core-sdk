import Tx from '../tx/tx'

const MODULE_NAME = 'tx'

const apis = {
    /**
     * Sign and send transaction
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @return {Promise<object>}
     */
    sendTx: {
        method: `${MODULE_NAME}_sendTx`,
        inputFormatter(privateKey, txConfig) {
            const tx = new Tx(txConfig)
            this.signer.sign(tx, privateKey)
            return [tx.toJson()]
        },
    },
    /**
     * Send a signed transaction
     * @param {object|string} txConfig Transaction config returned by lemo.tx.sign
     * @return {Promise<object>}
     */
    send: {
        method: `${MODULE_NAME}_sendTx`,
        inputFormatter(txConfig) {
            if (typeof txConfig === 'string') {
                txConfig = JSON.parse(txConfig)
            }
            const tx = new Tx(txConfig)
            if (!tx.r || !tx.s) {
                throw new Error("can't send an unsigned transaction")
            }
            return [tx.toJson()]
        },
    },
    /**
     * Sign transaction and return the config which used to call lemo.tx.send
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @return {string}
     */
    sign: {
        call(privateKey, txConfig) {
            const tx = new Tx(txConfig)
            this.signer.sign(tx, privateKey)
            return JSON.stringify(tx.toJson())
        },
    },
    /**
     * Sign a special transaction to set vote target
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @return {string}
     */
    signVote: {
        call(privateKey, txConfig) {
            const tx = Tx.createVoteTx(txConfig)
            this.signer.sign(tx, privateKey)
            return JSON.stringify(tx.toJson())
        },
    },
    /**
     * Sign a special transaction to register or edit candidate information
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @param {object} candidateInfo Candidate information
     * @return {string}
     */
    signCandidate: {
        call(privateKey, txConfig, candidateInfo) {
            const tx = Tx.createCandidateTx(txConfig, candidateInfo)
            this.signer.sign(tx, privateKey)
            return JSON.stringify(tx.toJson())
        },
    },
}

export default {
    moduleName: MODULE_NAME,
    apis,
}
