import {decodeAddress, keccak256, pubKeyToAddress, recover, sign} from '../crypto';
import {encode} from '../rlp';
import {toRaw} from './tx_helper'
import {toBuffer} from '../utils';
import {TX_ADDRESS_LENGTH} from '../const';


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
     * Recover from sigs address from a signed transaction
     * @param {Tx} tx
     * @return {[string]}
     */
    recover(tx) {
        return tx.sigs.map(sig => {
            const pubKey = recover(this.hashForSign(tx), toBuffer(sig))
            if (!pubKey) {
                throw new Error('invalid signature')
            }
            return pubKeyToAddress(pubKey)
        })
    }

    hashForSign(tx) {
        const raw = [
            toRaw(tx.type, 'type'),
            toRaw(tx.version, 'version'),
            toRaw(tx.chainID, 'chainID'),
            toRaw(decodeAddress(tx.from), 'from', TX_ADDRESS_LENGTH),
            tx.gasPayer ? toRaw(decodeAddress(tx.gasPayer), 'gasPayer', TX_ADDRESS_LENGTH) : '',
            tx.to ? toRaw(decodeAddress(tx.to), 'to', TX_ADDRESS_LENGTH) : '',
            toRaw(tx.toName, 'toName'),
            toRaw(tx.gasPrice, 'gasPrice'),
            toRaw(tx.gasLimit, 'gasLimit'),
            toRaw(tx.amount, 'amount'),
            toRaw(tx.data, 'data'),
            toRaw(tx.expirationTime, 'expirationTime'),
            toRaw(tx.message, 'message'),
        ]

        return keccak256(encode(raw))
    }
}
