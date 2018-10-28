import rlp from 'rlp'
import {CHAIN_ID, TX_VERSION, TTTL} from './config';
import {sign, recover, pubKeyToAddress, keccak256} from './crypto';
import {toBuffer, bufferTrimLeft, setBufferLength} from './utils';


export default class Tx {
    constructor(txConfig) {
        this.type = txConfig.type || 0
        this.version = txConfig.version || TX_VERSION
        this.chainId = txConfig.chainId || CHAIN_ID
        this.to = txConfig.to || ''
        this.toName = txConfig.toName || ''
        this.gasPrice = txConfig.gasPrice || 3000000000
        this.gasLimit = txConfig.gasLimit || 2000000
        this.amount = txConfig.amount || 0
        this.data = txConfig.data || ''
        // seconds
        this.expirationTime = txConfig.expirationTime || (Math.floor(Date.now() / 1000) + TTTL)
        this.message = txConfig.message || ''
        this.v = txConfig.v || combineV(this.type, this.version, 0, this.chainId)
        this.r = txConfig.r || ''
        this.s = txConfig.s || ''
        this.from = ''
    }

    serialize() {
        const raw = [
            toRaw(this, 'to', 20),
            toRaw(this, 'toName', 0),
            toRaw(this, 'gasPrice', 0),
            toRaw(this, 'gasLimit', 0),
            toRaw(this, 'amount', 0),
            toRaw(this, 'data', 0),
            toRaw(this, 'expirationTime', 0),
            toRaw(this, 'message', 0),
            toRaw(this, 'v', 0),
            toRaw(this, 'r', 0),
            toRaw(this, 's', 0),
        ]

        return rlp.encode(raw)
    }

    hash() {
        return keccak256(this.serialize())
    }

    sign(privateKey) {
        privateKey = toBuffer(privateKey)
        new Signer().sign(this, privateKey)
        return this.hash()
    }

    recover() {
        new Signer().recover(this)
        return this.from
    }
}

class Signer {
    sign(tx, privateKey) {
        const sig = sign(privateKey, this.hashForSign(tx))
        tx.v = combineV(tx.type, tx.version, sig.recovery, tx.chainId)
        tx.r = sig.r
        tx.s = sig.s
    }

    recover(tx) {
        const recovery = parseV(tx.v).recovery
        const pubKey = recover(this.hashForSign(tx), recovery, tx.r, tx.s)
        if (!pubKey) {
            throw new Error('invalid signature')
        }
        tx.from = pubKeyToAddress(pubKey)
    }

    hashForSign(tx) {
        const raw = [
            toRaw(tx, 'type', 0),
            toRaw(tx, 'version', 0),
            toRaw(tx, 'chainId', 0),
            toRaw(tx, 'to', 20),
            toRaw(tx, 'toName', 0),
            toRaw(tx, 'gasPrice', 0),
            toRaw(tx, 'gasLimit', 0),
            toRaw(tx, 'amount', 0),
            toRaw(tx, 'data', 0),
            toRaw(tx, 'expirationTime', 0),
            toRaw(tx, 'message', 0),
        ]

        return keccak256(rlp.encode(raw))
    }
}

// v is combined by these properties:
//     type    version secp256k1.recovery  chainId
// |----8----|----7----|----1----|----16----|

// CombineV combines type, version, chainId together to generate V
function combineV(type, version, recovery, chainId) {
    type = (type % (1 << 8)) << 24
    version = (version % (1 << 7)) << 17
    recovery = (recovery % (1 << 1)) << 16
    chainId %= 1 << 16
    return type | version | recovery | chainId
}

// ParseV split v to 4 parts
function parseV(v) {
    const type = (v >> 24) % (1 << 8)
    const version = (v >> 17) % (1 << 7)
    const recovery = (v >> 16) % (1 << 1)
    const chainId = v % (1 << 16)
    return {type, version, recovery, chainId}
}

function toRaw(tx, fieldName, length) {
    let data = toBuffer(tx[fieldName])
    if (length) {
        if (data.length > length) {
            throw new Error(`The field ${fieldName} must less than ${length} bytes`)
        }
        data = setBufferLength(data, length, false)
    } else {
        data = bufferTrimLeft(data)
    }
    return data
}
