import {keccak256, pubKeyToAddress, recover, sign} from '../crypto';
import {encode} from '../rlp';
import {combineV, parseV, toRaw} from './tx_helper'
import {toBuffer} from '../utils';


export default class Signer {
    /**
     * @param {number} chainID The LemoChain id
     */
    constructor(chainID) {
        if (!chainID) {
            throw new Error('ChainID should not be empty')
        }
        this.chainID = chainID
    }

    /**
     * Sign a transaction with private key
     * @param {Tx} tx
     * @param {string|Buffer} privateKey
     * @return {Buffer} The signed transaction's hash
     */
    sign(tx, privateKey) {
        privateKey = toBuffer(privateKey)
        const sig = sign(privateKey, this.hashForSign(tx))
        tx.v = combineV(tx.type, tx.version, sig.recovery, this.chainID)
        tx.r = sig.r
        tx.s = sig.s
        return tx.hash()
    }

    /**
     * Recover from address from a signed transaction
     * @param {Tx} tx
     * @return {string}
     */
    recover(tx) {
        const parsed = parseV(tx.v)
        if (parsed.chainID !== this.chainID) {
            console.warn(`The chainID ${parsed.chainID} from transaction is different with ${this.chainID} from SDK`)
        }
        const recovery = parsed.recovery
        const pubKey = recover(this.hashForSign(tx), recovery, tx.r, tx.s)
        if (!pubKey) {
            throw new Error('invalid signature')
        }
        tx.from = pubKeyToAddress(pubKey)
        return tx.from
    }

    hashForSign(tx) {
        const raw = [
            toRaw(tx, 'type', true),
            toRaw(tx, 'version', true),
            toBuffer(this.chainID),
            tx.to ? toRaw(tx, 'to', false, 20) : '',
            toRaw(tx, 'toName', false),
            toRaw(tx, 'gasPrice', true),
            toRaw(tx, 'gasLimit', true),
            toRaw(tx, 'amount', true),
            toRaw(tx, 'data', true),
            toRaw(tx, 'expirationTime', true),
            toRaw(tx, 'message', false),
        ]

        return keccak256(encode(raw))
    }
}
