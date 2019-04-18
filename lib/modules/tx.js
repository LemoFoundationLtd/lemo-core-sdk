import Tx from '../tx/tx'
import VoteTx from '../tx/special_tx/vote_tx'
import CandidateTx from '../tx/special_tx/candidate_tx'
import CreateAssetTx from '../tx/special_tx/create_asset_tx'
import IssueAssetTx from '../tx/special_tx/issue_asset_tx'
import TransferAssetTx from '../tx/special_tx/transfer_asset_tx'
import ReplenishAssetTx from '../tx/special_tx/replenish_asset_tx'
import ModifyAssetTx from  '../tx/special_tx/modify_asset_tx'
import GasTx from '../tx/special_tx/gas_tx'
import ReimbursementTx from '../tx/special_tx/gas_reimbursement_tx'
import {checkChainID} from '../tx/tx_helper'
import {privateToAddress} from '../crypto'
import {TX_NAME} from '../const'
import errors from '../errors'

const apis = {
    /**
     * Get transaction's information by hash
     * @param {string|number} txHash Hash of transaction
     * @return {Promise<object>}
     */
    async getTx(txHash) {
        const result = await this.requester.send(`${TX_NAME}_getTxByHash`, [txHash])
        if (!result) {
            return null
        }
        return this.parser.parseTxRes(this.chainID, result)
    },
    /**
     * Get transactions' information in account
     * @param {string} address Account address
     * @param {number} index Index of transactions
     * @param {number} limit The count of transactions required
     * @return {Promise<object>}
     */
    async getTxListByAddress(address, index, limit) {
        const result = await this.requester.send(`${TX_NAME}_getTxListByAddress`, [address, index, limit])
        if (!result) {
            return null
        }
        return this.parser.parseTxListRes(this.chainID, result)
    },
    /**
     * Sign and send transaction
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @param {boolean?} waitConfirm 等待交易共识
     * @return {Promise<object>}
     */
    sendTx(privateKey, txConfig, waitConfirm) {
        txConfig = checkChainID(txConfig, this.chainID)
        const tx = new Tx(txConfig)
        tx.signWith(privateKey)
        const txHash = tx.hash()
        return this.requester.send(`${TX_NAME}_sendTx`, [tx.toJson()]).then(async () => {
            if (!waitConfirm) {
                return txHash
            }
            await this.txWatcher.waitTx(txHash)
            return txHash
        })
    },
    /**
     * Send a signed transaction
     * @param {object|string} txConfig Transaction config returned by lemo.tx.sign
     * @param {boolean} waitConfirm 等待交易共识
     * @return {Promise<object>}
     */
    send(txConfig, waitConfirm) {
        if (typeof txConfig === 'string') {
            txConfig = JSON.parse(txConfig)
        }
        txConfig = checkChainID(txConfig, this.chainID)
        const tx = new Tx(txConfig)
        const txHash = tx.hash()
        if (!tx.sig) {
            throw new Error("can't send an unsigned transaction")
        }
        return this.requester.send(`${TX_NAME}_sendTx`, [tx.toJson()]).then(async () => {
            if (!waitConfirm) {
                return txHash
            }
            await this.txWatcher.waitTx(txHash)
            return txHash
        })
    },
    /**
     * Sign transaction and return the config which used to call lemo.tx.send
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @return {string}
     */
    sign(privateKey, txConfig) {
        txConfig = checkChainID(txConfig, this.chainID)
        const tx = new Tx(txConfig)
        tx.signWith(privateKey)
        return JSON.stringify(tx.toJson())
    },
    /**
     * Sign a special transaction to set vote target
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @return {string}
     */
    signVote(privateKey, txConfig) {
        txConfig = checkChainID(txConfig, this.chainID)
        const tx = new VoteTx(txConfig)
        tx.signWith(privateKey)
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
        txConfig = checkChainID(txConfig, this.chainID)
        const tx = new CandidateTx(txConfig, candidateInfo)
        tx.signWith(privateKey)
        return JSON.stringify(tx.toJson())
    },
    /**
     * 签名创建资产的交易
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @param {object} createAssetInfo CreateAsset information
     * @return {string}
     */
    signCreateAsset(privateKey, txConfig, createAssetInfo) {
        txConfig = checkChainID(txConfig, this.chainID)
        const tx = new CreateAssetTx(txConfig, createAssetInfo)
        tx.signWith(privateKey)
        return JSON.stringify(tx.toJson())
    },
    /**
     * 签名发行资产的交易
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @param {object} issueAssetInfo IssueAsset information
     * @return {string}
     */
    signIssueAsset(privateKey, txConfig, issueAssetInfo) {
        txConfig = checkChainID(txConfig, this.chainID)
        const tx = new IssueAssetTx(txConfig, issueAssetInfo)
        tx.signWith(privateKey)
        return JSON.stringify(tx.toJson())
    },
    /**
     * 签名交易资产交易
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @param {object} transferAssetInfo TransferAsset information
     * @return {string}
     */
    signTransferAsset(privateKey, txConfig, transferAssetInfo) {
        txConfig = checkChainID(txConfig, this.chainID)
        const tx = new TransferAssetTx(txConfig, transferAssetInfo)
        tx.signWith(privateKey)
        return JSON.stringify(tx.toJson())
    },
    /**
     * 签名增发资产的交易
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @param {object} replenishInfo TransferAsset information
     * @return {string}
     */
    signReplenishAsset(privateKey, txConfig, replenishInfo) {
        txConfig = checkChainID(txConfig, this.chainID)
        const tx = new ReplenishAssetTx(txConfig, replenishInfo)
        tx.signWith(privateKey)
        return JSON.stringify(tx.toJson())
    },
    /**
     * 签名修改资产
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @param {object} modifyInfo TransferAsset information
     * @return {string}
     */
    signModifyAsset(privateKey, txConfig, modifyInfo) {
        txConfig = checkChainID(txConfig, this.chainID)
        const tx = new ModifyAssetTx(txConfig, modifyInfo)
        tx.signWith(privateKey)
        return JSON.stringify(tx.toJson())
    },
    /**
     * 签名免费交易签名 free gas transaction sign
     * @param {string} privateKey The private key from sender account
     * @param {object} txConfig Transaction config
     * @return {string}
     */
    signNoGas(privateKey, txConfig, payer) {
        txConfig = checkChainID(txConfig, this.chainID)
        const tx = new GasTx(txConfig, payer)
        tx.signNoGasWith(privateKey)
        return JSON.stringify(tx.toJson())
    },
    /**
     * 签名代付gas交易 Reimbursement gas transaction
     * @param {string} privateKey The private key from sender account
     * @param {object} noGasTx returned by the signNoGas method
     * @param {number|string} gasPrice Gas price for smart contract. Unit is mo/gas
     * @param {number|string} gasLimit Max gas limit for smart contract. Unit is gas
     * @return {string}
     */
    signReimbursement(privateKey, noGasTx, gasPrice, gasLimit) {
        if (privateToAddress(privateKey) !== JSON.parse(noGasTx).payer) {
            throw new Error(errors.InvalidAddressConflict(JSON.parse(noGasTx).payer))
        }
        const tx = new ReimbursementTx(noGasTx, gasPrice, gasLimit)
        tx.signGasWith(privateKey)
        return JSON.stringify(tx.toJson())
    },
    /**
     * watch and filter transaction of block
     * @param {object} filterTxConfig  transaction
     * @param {Function} callback
     * @return {number} subscribeId
     */
    watchTx(filterTxConfig, callback) {
        return this.txWatcher.watchTx(filterTxConfig, callback)
    },
    /**
     * stop watching and filtering transaction of block
     * @param {number} subscribeId
     */
    stopWatchTx(subscribeId) {
        this.txWatcher.stopWatchTx(subscribeId)
    },
}

export default {
    moduleName: TX_NAME,
    apis,
}
