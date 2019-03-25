import {keccak256, pubKeyToAddress, recover, sign} from '../crypto';
import {encode} from '../rlp';
import {toRaw} from './tx_helper'
import {toBuffer} from '../utils';
import {TX_TO_LENGTH} from '../const';


export default class Signer {
    /**
     * Sign a transaction with private key
     * @param {Tx} tx
     * @param {string|Buffer} privateKey
     * @return {string} The signature
     */
    sign(tx, privateKey) {
        privateKey = toBuffer(privateKey)
        const sig = sign(privateKey, this.hashForSign(tx))
        return `0x${sig.toString('hex')}`
    }

    /**
     * Recover from address from a signed transaction
     * @param {Tx} tx
     * @return {string}
     */
    recover(tx) {
        const pubKey = recover(this.hashForSign(tx), toBuffer(tx.sig))
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
            tx.to ? toRaw(tx, 'to', false, TX_TO_LENGTH) : '',
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
