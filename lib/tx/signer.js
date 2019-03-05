import {keccak256, pubKeyToAddress, recover, sign} from '../crypto';
import {encode} from '../rlp';
import {combineV, parseV, toRaw} from './tx_helper'
import {toBuffer} from '../utils';


export default class Signer {
    /**
     * Sign a transaction with private key
     * @param {Tx} tx
     * @param {string|Buffer} privateKey
     * @return {{v:number, r:Buffer, s:Buffer}} The signature
     */
    sign(tx, privateKey) {
        privateKey = toBuffer(privateKey)
        const sig = sign(privateKey, this.hashForSign(tx))
        return {
            v: combineV(tx.type, tx.version, sig.recovery, tx.chainID),
            r: sig.r,
            s: sig.s,
        }
    }

    /**
     * Recover from address from a signed transaction
     * @param {Tx} tx
     * @return {string}
     */
    recover(tx) {
        const recovery = parseV(tx.v).recovery
        const pubKey = recover(this.hashForSign(tx), recovery, toBuffer(tx.r), toBuffer(tx.s))
        if (!pubKey) {
            throw new Error('invalid signature')
        }
        return pubKeyToAddress(pubKey)
    }

    hashForSign(tx) {
        const raw = [
            toRaw(tx, 'type', true),
            toRaw(tx, 'version', true),
            toRaw(tx, 'chainID', true),
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
