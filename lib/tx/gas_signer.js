import {keccak256, sign} from '../crypto';
import {encode} from '../rlp';
import {toRaw} from './tx_helper'
import {toBuffer} from '../utils';
import {TX_TO_LENGTH} from '../const'


export default class GasSigner {
    /**
     * Recover from address from a signed gas transaction
     * @param {Tx} tx
     * @return {string}
     */
    signGas(tx, privateKey) {
        privateKey = toBuffer(privateKey)
        const sig = sign(privateKey, this.hashForGasSign(tx))
        return `0x${sig.toString('hex')}`
    }
    /**
     * Recover from address from a signed no gas transaction
     * @param {Tx} tx
     * @return {string}
     */
    signNoGas(tx, privateKey) {
        privateKey = toBuffer(privateKey)
        const sig = sign(privateKey, this.hashForNoGasSign(tx))
        return `0x${sig.toString('hex')}`
    }

    hashForGasSign(tx) {
        const raw = [
            toRaw(tx, 'noGasTx', false),
            toRaw(tx, 'gasPrice', true),
            toRaw(tx, 'gasLimit', true),
        ]

        return keccak256(encode(raw))
    }

    hashForNoGasSign(tx) {
        const raw = [
            toRaw(tx, 'type', true),
            toRaw(tx, 'version', true),
            toRaw(tx, 'chainID', true),
            toRaw(tx, 'to', false, TX_TO_LENGTH),
            toRaw(tx, 'toName', false),
            toRaw(tx, 'amount', true),
            toRaw(tx, 'data', true),
            toRaw(tx, 'expirationTime', true),
            toRaw(tx, 'message', false),
            toRaw(tx, 'payer', false),
        ]
        return keccak256(encode(raw))
    }
}
