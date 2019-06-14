import BigNumber from 'bignumber.js'
import {Buffer} from 'safe-buffer'
import {encode} from '../rlp'
import {CHAIN_ID_MAIN_NET, TX_VERSION, TTTL, TX_DEFAULT_GAS_LIMIT, TX_DEFAULT_GAS_PRICE} from '../config'
import {TxType, TX_ADDRESS_LENGTH} from '../const'
import {decodeAddress, encodeAddress, keccak256, isLemoAddress} from '../crypto'
import {toHexStr, verifyTxConfig, toRaw, arrayToRaw} from './tx_helper'
import Signer from './signer'


export default class Tx {
    /**
     * Create transaction object
     * @param {object} txConfig
     * @param {number|string?} txConfig.type The type of transaction
     * @param {number|string?} txConfig.version The version of transaction protocol
     * @param {number|string} txConfig.chainID The LemoChain id
     * @param {string?} txConfig.to The transaction recipient address
     * @param {string?} txConfig.from The transaction sender address
     * @param {string?} txConfig.toName The transaction recipient name
     * @param {number|string?} txConfig.gasPrice Gas price for smart contract. Unit is mo/gas
     * @param {number|string?} txConfig.gasLimit Max gas limit for smart contract. Unit is gas
     * @param {number|string?} txConfig.amount Unit is mo
     * @param {object|string?} txConfig.data Extra data or smart contract calling parameters
     * @param {number|string?} txConfig.expirationTime Default value is half hour from now
     * @param {string?} txConfig.message Extra value data
     * @param {Array?} txConfig.sigs Signature hex data list
     * @param {Array?} txConfig.gasPayerSigs Gas payer signature hex data list
     */
    constructor(txConfig) {
        verifyTxConfig(txConfig)
        this.normalize(txConfig)
    }

    normalize(txConfig) {
        // type number
        this.type = parseInt(txConfig.type || TxType.ORDINARY, 10)
        // version number
        this.version = parseInt(txConfig.version || TX_VERSION, 10)
        // chainID number
        this.chainID = parseInt(txConfig.chainID, 10) || CHAIN_ID_MAIN_NET
        // to string
        if (!txConfig.to) {
            this.to = ''
        } else if (isLemoAddress(txConfig.to)) {
            this.to = txConfig.to
        } else {
            this.to = encodeAddress(txConfig.to)
        }
        // toName string
        this.toName = (txConfig.toName || '').toString()
        // gasPrice BigNumber
        this.gasPrice = new BigNumber(txConfig.gasPrice || TX_DEFAULT_GAS_PRICE)
        // gasLimit number
        this.gasLimit = parseInt(txConfig.gasLimit || TX_DEFAULT_GAS_LIMIT, 10)
        // amount BigNumber
        this.amount = new BigNumber(txConfig.amount || 0)
        // expirationTime number. seconds
        this.expirationTime = parseInt(txConfig.expirationTime, 10) || (Math.floor(Date.now() / 1000) + TTTL)

        // data string
        if (txConfig.data && typeof txConfig.data === 'object') {
            this.data = toHexStr(Buffer.from(JSON.stringify(txConfig.data)))
        } else {
            this.data = toHexStr(txConfig.data)
        }
        // message string
        this.message = (txConfig.message || '').toString()
        // sigs Array
        if (txConfig.sigs && Array.isArray(txConfig.sigs)) {
            this.sigs = txConfig.sigs.map(item => toHexStr(item))
        } else {
            this.sigs = []
        }
        // gasPayerSig Array
        if (txConfig.gasPayerSigs && Array.isArray(txConfig.gasPayerSigs)) {
            this.gasPayerSigs = txConfig.gasPayerSigs.map(item => toHexStr(item))
        } else {
            this.gasPayerSigs = []
        }
        // from string
        if (isLemoAddress(txConfig.from)) {
            this.from = txConfig.from
        } else {
            this.from = encodeAddress(txConfig.from)
        }
        // gasPayer
        if (!txConfig.gasPayer) {
            this.gasPayer = ''
        } else if (isLemoAddress(txConfig.gasPayer)) {
            this.gasPayer = txConfig.gasPayer
        } else {
            this.gasPayer = encodeAddress(txConfig.gasPayer)
        }
    }

    /**
     * Sign a transaction with private key
     * @param {string|Buffer} privateKey
     */
    signWith(privateKey) {
        const sig = new Signer().sign(this, privateKey)
        if (!this.sigs.includes(sig)) {
            this.sigs.push(sig)
        }
    }

    /**
     * rlp encode for hash
     * @return {Buffer}
     */
    serialize() {
        const raw = [
            toRaw(this.type, 'type'),
            toRaw(this.version, 'version'),
            toRaw(this.chainID, 'chainID'),
            toRaw(decodeAddress(this.from), 'from', TX_ADDRESS_LENGTH),
            this.gasPayer ? toRaw(decodeAddress(this.gasPayer), 'gasPayer', TX_ADDRESS_LENGTH) : '',
            this.to ? toRaw(decodeAddress(this.to), 'to', TX_ADDRESS_LENGTH) : '',
            toRaw(this.toName, 'toName'),
            toRaw(this.gasPrice, 'gasPrice'),
            toRaw(this.gasLimit, 'gasLimit'),
            toRaw(this.amount, 'amount'),
            toRaw(this.data, 'data'),
            toRaw(this.expirationTime, 'expirationTime'),
            toRaw(this.message, 'message'),
            arrayToRaw(this.sigs, 'sigs'),
            arrayToRaw(this.gasPayerSigs, 'gasPayerSigs'),
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
            type: this.type.toString(10),
            version: this.version.toString(10),
            chainID: this.chainID.toString(10),
            from: this.from,
            gasPrice: this.gasPrice.toString(10),
            gasLimit: this.gasLimit.toString(10),
            amount: this.amount.toString(10),
            expirationTime: this.expirationTime.toString(10),
        }
        setIfExist(result, 'gasPayer', this.gasPayer)
        setIfExist(result, 'to', this.to)
        setIfExist(result, 'toName', this.toName)
        setIfExist(result, 'data', this.data)
        setIfExist(result, 'message', this.message)
        setIfExist(result, 'sigs', this.sigs)
        setIfExist(result, 'gasPayerSigs', this.gasPayerSigs)
        return result
    }
}

function setIfExist(obj, fieldName, value) {
    if (value) {
        obj[fieldName] = value
    }
}
