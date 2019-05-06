import BigNumber from 'bignumber.js'
import {Buffer} from 'safe-buffer'
import {encode} from '../rlp'
import {CHAIN_ID_MAIN_NET, TX_VERSION, TTTL, TX_DEFAULT_GAS_LIMIT, TX_DEFAULT_GAS_PRICE} from '../config'
import {TxType, TX_TO_LENGTH} from '../const'
import {decodeAddress, encodeAddress, keccak256, isLemoAddress} from '../crypto'
import {toHexStr, verifyTxConfig, toRaw} from './tx_helper'
import Signer from './signer'
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
     * @param {object|string?} txConfig.data Extra data or smart contract calling parameters
     * @param {number|string?} txConfig.expirationTime Default value is half hour from now
     * @param {string?} txConfig.message Extra value data
     * @param {string?} txConfig.sig Signature hex data
     * @param {string?} txConfig.gasPayerSig Gas payer signature hex data
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
        // sig string
        this.sig = toHexStr(txConfig.sig || '')
        // gasPayerSig string
        this.gasPayerSig = toHexStr(txConfig.gasPayerSig || '')

        // from string
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
     * rlp encode for hash
     * @return {Buffer}
     */
    serialize() {
        const raw = [
            toRaw(this.type, 'type'),
            toRaw(this.version, 'version'),
            toRaw(this.chainID, 'chainID'),
            this.to ? toRaw(decodeAddress(this.to), 'to', TX_TO_LENGTH) : '',
            toRaw(this.toName, 'toName'),
            toRaw(this.gasPrice, 'gasPrice'),
            toRaw(this.gasLimit, 'gasLimit'),
            toRaw(this.amount, 'amount'),
            toRaw(this.data, 'data'),
            toRaw(this.expirationTime, 'expirationTime'),
            toRaw(this.message, 'message'),
            toRaw(this.sig, 'sig'),
            toRaw(this.gasPayerSig, 'gasPayerSig'),
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
            gasPrice: this.gasPrice.toString(10),
            gasLimit: this.gasLimit.toString(10),
            amount: this.amount.toString(10),
            expirationTime: this.expirationTime.toString(10),
        }
        setIfExist(result, 'to', this.to)
        setIfExist(result, 'toName', this.toName)
        setIfExist(result, 'data', this.data)
        setIfExist(result, 'message', this.message)
        setIfExist(result, 'sig', this.sig)
        setIfExist(result, 'gasPayerSig', this.gasPayerSig)
        return result
    }
}

function setIfExist(obj, fieldName, value) {
    if (value) {
        obj[fieldName] = value
    }
}
