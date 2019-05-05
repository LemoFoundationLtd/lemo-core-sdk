import {decodeAddress, keccak256, sign} from '../crypto';
import {encode} from '../rlp';
import {toRaw} from './tx_helper'
import {toBuffer} from '../utils';
import {TX_TO_LENGTH} from '../const'


export default class GasSigner {
    /**
     * Recover from address from a signed gas transaction
     * @param {Tx} tx
     * @param {string|Buffer} privateKey
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
     * @param {string|Buffer} privateKey
     * @return {string}
     */
    signNoGas(tx, privateKey) {
        privateKey = toBuffer(privateKey)
        const sig = sign(privateKey, this.hashForNoGasSign(tx))
        return `0x${sig.toString('hex')}`
    }

    hashForGasSign(tx) {
        const raw = [
            toRaw(tx.noGasTx, 'noGasTx'),
            toRaw(tx.gasPrice, 'gasPrice'),
            toRaw(tx.gasLimit, 'gasLimit'),
        ]

        return keccak256(encode(raw))
    }

    hashForNoGasSign(tx) {
        const raw = [
            toRaw(tx.type, 'type'),
            toRaw(tx.version, 'version'),
            toRaw(tx.chainID, 'chainID'),
            tx.to ? toRaw(decodeAddress(tx.to), 'to', TX_TO_LENGTH) : '',
            toRaw(tx.toName, 'toName'),
            toRaw(tx.amount, 'amount'),
            toRaw(tx.data, 'data'),
            toRaw(tx.expirationTime, 'expirationTime'),
            toRaw(tx.message, 'message'),
            toRaw(tx.payer, 'payer'),
        ]
        return keccak256(encode(raw))
    }
}
