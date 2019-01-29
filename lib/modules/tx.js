import Tx from '../tx/tx'
import {parseTx} from '../network/data_parser'

const MODULE_NAME = 'tx'

const apis = {
    /**
     * Get transaction's information by hash
     * @param {string|number} txHash Hash of transaction
     * @return {Promise<object>}
     */
    async getTx(txHash) {
        const result = await this.requester.send(`${MODULE_NAME}_getTxByHash`, [txHash])
        if (!result) {
            return null
        }
        const tx = parseTx(this.signer, result.tx)
        tx.minedTime = result.time
        return tx
    },
    /**
     * Sign and send transaction
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @return {Promise<object>}
     */
    sendTx(privateKey, txConfig) {
        const tx = new Tx(txConfig)
        this.signer.sign(tx, privateKey)
        return this.requester.send(`${MODULE_NAME}_sendTx`, [tx.toJson()])
    },
    /**
     * Send a signed transaction
     * @param {object|string} txConfig Transaction config returned by lemo.tx.sign
     * @return {Promise<object>}
     */
    send(txConfig) {
        if (typeof txConfig === 'string') {
            txConfig = JSON.parse(txConfig)
        }
        const tx = new Tx(txConfig)
        if (!tx.r || !tx.s) {
            throw new Error("can't send an unsigned transaction")
        }
        return this.requester.send(`${MODULE_NAME}_sendTx`, [tx.toJson()])
    },
    /**
     * Sign transaction and return the config which used to call lemo.tx.send
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @return {string}
     */
    sign(privateKey, txConfig) {
        const tx = new Tx(txConfig)
        this.signer.sign(tx, privateKey)
        return JSON.stringify(tx.toJson())
    },
    /**
     * Sign a special transaction to set vote target
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @return {string}
     */
    signVote(privateKey, txConfig) {
        const tx = Tx.createVoteTx(txConfig)
        this.signer.sign(tx, privateKey)
        return JSON.stringify(tx.toJson())
    },
    /**
     * Sign a special transaction to register or edit candidate information
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @param {object} candidateInfo Candidate information
     * @return {string}
     */
    signCandidate(privateKey, txConfig, candidateInfo) {
        const tx = Tx.createCandidateTx(txConfig, candidateInfo)
        this.signer.sign(tx, privateKey)
        return JSON.stringify(tx.toJson())
    },
}

export default {
    moduleName: MODULE_NAME,
    apis,
}
