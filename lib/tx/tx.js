import BigNumber from 'bignumber.js'
import {encode} from '../rlp'
import {CHAIN_ID_MAIN_NET, TX_VERSION, TTTL, TX_DEFAULT_GAS_LIMIT, TX_DEFAULT_GAS_PRICE} from '../config'
import {keccak256} from '../crypto'
import {has0xPrefix} from '../utils'
import {parseV, toRaw, toHexStr, verifyTxConfig} from './tx_helper'
import Signer from './signer'


export default class Tx {
    /**
     * Create transaction object
     * @param {object} txConfig
     * @param {number?} txConfig.type The type of transaction. 0: normal
     * @param {number?} txConfig.version The version of transaction protocol
     * @param {number} txConfig.chainID The LemoChain id
     * @param {string?} txConfig.to The transaction recipient address
     * @param {string?} txConfig.toName The transaction recipient name
     * @param {number|string?} txConfig.gasPrice Gas price for smart contract. Unit is mo/gas
     * @param {number|string?} txConfig.gasLimit Max gas limit for smart contract. Unit is gas
     * @param {number|string?} txConfig.amount Unit is mo
     * @param {Buffer|string?} txConfig.data Extra data or smart contract calling parameters
     * @param {number|string?} txConfig.expirationTime Default value is half hour from now
     * @param {string?} txConfig.message Extra value data
     * @param {Buffer|string?} txConfig.r Signature data
     * @param {Buffer|string?} txConfig.s Signature data
     * @param {Buffer|string?} txConfig.v Signature data, it also contains type, version, and chainID for transaction
     */
    constructor(txConfig) {
        verifyTxConfig(txConfig)
        this.normalize(txConfig)
    }

    normalize(txConfig) {
        if (txConfig.v) {
            this.v = txConfig.v
            const parsedV = parseV(txConfig.v)
            this.type = parsedV.type
            this.version = parsedV.version
            this.chainID = parsedV.chainID
        } else {
            // no v before sign
            this.v = ''
            this.type = parseInt(txConfig.type || 0, 10)
            this.version = txConfig.version || TX_VERSION
            this.chainID = parseInt(txConfig.chainID, 10) || CHAIN_ID_MAIN_NET
        }
        this.to = txConfig.to || ''
        this.toName = txConfig.toName || ''
        this.gasPrice = txConfig.gasPrice || TX_DEFAULT_GAS_PRICE
        this.gasLimit = txConfig.gasLimit || TX_DEFAULT_GAS_LIMIT
        this.amount = txConfig.amount || 0
        this.data = txConfig.data || ''
        // seconds
        this.expirationTime = txConfig.expirationTime || (Math.floor(Date.now() / 1000) + TTTL)
        this.message = txConfig.message || ''
        this.r = txConfig.r || ''
        this.s = txConfig.s || ''

        let from = ''
        Object.defineProperty(this, 'from', {
            get() {
                if (!from && this.v && this.r && this.s) {
                    from = new Signer().recover(this)
                }
                return from
            },
            set(v) {
                from = v
            },
            enumerable: true,
        })
    }

    /**
     * Sign a transaction with private key
     * @param {string|Buffer} privateKey
     */
    signWith(privateKey) {
        const sig = new Signer().sign(this, privateKey)
        this.v = sig.v
        this.r = sig.r
        this.s = sig.s
    }

    /**
     * rlp encode for hash
     * @return {Buffer}
     */
    serialize() {
        const raw = [
            this.to ? toRaw(this, 'to', false, 20) : '',
            toRaw(this, 'toName', false),
            toRaw(this, 'gasPrice', true),
            toRaw(this, 'gasLimit', true),
            toRaw(this, 'amount', true),
            toRaw(this, 'data', true),
            toRaw(this, 'expirationTime', true),
            toRaw(this, 'message', false),
            toRaw(this, 'v', true),
            toRaw(this, 'r', true),
            toRaw(this, 's', true),
        ]

        return encode(raw)
    }

    hash() {
        return keccak256(this.serialize())
    }

    /**
     * format for rpc
     * @return {object}
     */
    toJson() {
        const to = has0xPrefix(this.to) ? toHexStr(this, 'to', 20) : this.to
        const result = {
            gasPrice: new BigNumber(this.gasPrice).toString(10),
            gasLimit: new BigNumber(this.gasLimit).toString(10),
            amount: new BigNumber(this.amount).toString(10),
            expirationTime: new BigNumber(this.expirationTime).toString(10),
            v: toHexStr(this, 'v'),
            r: toHexStr(this, 'r'),
            s: toHexStr(this, 's'),
        }
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
        return result
    }
}
