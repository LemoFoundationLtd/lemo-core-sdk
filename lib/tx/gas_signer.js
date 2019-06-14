import {decodeAddress, keccak256, sign} from '../crypto';
import {encode} from '../rlp';
import {arrayToRaw, toRaw} from './tx_helper'
import {toBuffer} from '../utils';
import {TX_ADDRESS_LENGTH} from '../const'


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
            arrayToRaw(tx.sigs, 'sigs'),
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
            toRaw(decodeAddress(tx.from), 'from', TX_ADDRESS_LENGTH),
            tx.gasPayer ? toRaw(decodeAddress(tx.gasPayer), 'gasPayer', TX_ADDRESS_LENGTH) : '',
            tx.to ? toRaw(decodeAddress(tx.to), 'to', TX_ADDRESS_LENGTH) : '',
            toRaw(tx.toName, 'toName'),
            toRaw(tx.amount, 'amount'),
            toRaw(tx.data, 'data'),
            toRaw(tx.expirationTime, 'expirationTime'),
            toRaw(tx.message, 'message'),
        ]
        return keccak256(encode(raw))
    }
}
