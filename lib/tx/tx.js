import BigNumber from 'bignumber.js'
import {encode} from '../rlp'
import {CHAIN_ID_MAIN_NET, TX_VERSION, TTTL, TX_DEFAULT_GAS_LIMIT, TX_DEFAULT_GAS_PRICE} from '../config'
import {TxType, TX_TO_LENGTH, TX_SIG_BYTE_LENGTH} from '../const'
import {keccak256} from '../crypto'
import {has0xPrefix} from '../utils'
import {toRaw, toHexStr, verifyTxConfig} from './tx_helper'
import Signer from './signer'
import GasSinger from './gas_signer'
import errors from '../errors'


export default class Tx {
    /**
     * Create transaction object
     * @param {object} txConfig
     * @param {number|string?} txConfig.type The type of transaction
     * @param {number|string?} txConfig.version The version of transaction protocol
     * @param {number|string} txConfig.chainID The LemoChain id
     * @param {string?} txConfig.to The transaction recipient address
     * @param {string?} txConfig.toName The transaction recipient name
     * @param {number|string?} txConfig.gasPrice Gas price for smart contract. Unit is mo/gas
     * @param {number|string?} txConfig.gasLimit Max gas limit for smart contract. Unit is gas
     * @param {number|string?} txConfig.amount Unit is mo
     * @param {Buffer|string?} txConfig.data Extra data or smart contract calling parameters
     * @param {number|string?} txConfig.expirationTime Default value is half hour from now
     * @param {string?} txConfig.message Extra value data
     * @param {Buffer|string?} txConfig.sig Signature data
     */
    constructor(txConfig) {
        verifyTxConfig(txConfig)
        this.normalize(txConfig)
    }

    normalize(txConfig) {
        this.type = parseInt(txConfig.type || TxType.ORDINARY, 10)
        this.version = parseInt(txConfig.version || TX_VERSION, 10)
        this.chainID = parseInt(txConfig.chainID, 10) || CHAIN_ID_MAIN_NET
        this.to = txConfig.to || ''
        this.toName = txConfig.toName || ''
        this.gasPrice = txConfig.gasPrice || TX_DEFAULT_GAS_PRICE
        this.gasLimit = parseInt(txConfig.gasLimit || TX_DEFAULT_GAS_LIMIT, 10)
        this.amount = txConfig.amount || 0
        this.data = txConfig.data || ''
        // seconds
        this.expirationTime = parseInt(txConfig.expirationTime, 10) || (Math.floor(Date.now() / 1000) + TTTL)
        this.message = txConfig.message || ''
        this.sig = txConfig.sig || ''
        this.gasPayerSig = txConfig.gasPayerSig || ''

        let from = ''
        Object.defineProperty(this, 'from', {
            get() {
                if (!from && this.sig) {
                    from = new Signer().recover(this)
                }
                return from
            },
            set() {
                throw new Error(errors.TXCanNotChangeFrom())
            },
            enumerable: true,
        })
    }

    /**
     * Sign a transaction with private key
     * @param {string|Buffer} privateKey
     */
    signWith(privateKey) {
        this.sig = new Signer().sign(this, privateKey)
    }
    /**
     * Sign a gas transaction with private key
     * @param {string|Buffer} privateKey
     */
    signGasWith(privateKey) {
        this.sig = new GasSinger().signGas(this, privateKey)
    }
    /**
     * Sign a gas transaction with private key
     * @param {string|Buffer} privateKey
     */
    signNoGasWith(privateKey) {
        this.sig = new GasSinger().signNoGas(this, privateKey)
    }

    /**
     * rlp encode for hash
     * @return {Buffer}
     */
    serialize() {
        const raw = [
            this.to ? toRaw(this, 'to', false, TX_TO_LENGTH) : '',
            toRaw(this, 'toName', false),
            toRaw(this, 'gasPrice', true),
            toRaw(this, 'gasLimit', true),
            toRaw(this, 'amount', true),
            toRaw(this, 'data', true),
            toRaw(this, 'expirationTime', true),
            toRaw(this, 'message', false),
            toRaw(this, 'type', true),
            toRaw(this, 'version', true),
            toRaw(this, 'chainID', true),
            toRaw(this, 'sig', true),
            toRaw(this, 'gasPayerSig', true),
        ]

        return encode(raw)
    }

    /**
     * compute hash of all fields including of sig
     * @return {string}
     */
    hash() {
        const hashBuffer = keccak256(this.serialize())
        return `0x${hashBuffer.toString('hex')}`
    }

    /**
     * format for rpc
     * @return {object}
     */
    toJson() {
        const result = {
            type: new BigNumber(this.type).toString(10),
            version: new BigNumber(this.version).toString(10),
            chainID: new BigNumber(this.chainID).toString(10),
            gasPrice: new BigNumber(this.gasPrice).toString(10),
            gasLimit: new BigNumber(this.gasLimit).toString(10),
            amount: new BigNumber(this.amount).toString(10),
            expirationTime: new BigNumber(this.expirationTime).toString(10),
        }
        const to = has0xPrefix(this.to) ? toHexStr(this, 'to', TX_TO_LENGTH) : this.to
        if (to) {
            result.to = to
        }
        if (this.toName) {
            result.toName = this.toName
        }
        if (this.data && this.data.length) {
            result.data = toHexStr(this, 'data')
        }
        if (this.message) {
            result.message = this.message
        }
        const payer = has0xPrefix(this.payer) ? toHexStr(this, 'payer', TX_TO_LENGTH) : this.payer
        if (payer) {
            result.payer = payer
        }
        if (this.sig && this.sig.length) {
            result.sig = toHexStr(this, 'sig', TX_SIG_BYTE_LENGTH)
        }
        if (this.gasPayerSig && this.gasPayerSig.length) {
            result.gasPayerSig = toHexStr(this, 'gasPayerSig', TX_SIG_BYTE_LENGTH)
        }
        return result
    }
}
