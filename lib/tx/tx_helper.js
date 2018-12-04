import BigNumber from 'bignumber.js'
import {Buffer} from 'safe-buffer';
import {bufferTrimLeft, setBufferLength, toBuffer} from '../utils';
import {decodeAddress} from '../crypto';

// v is combined by these properties:
//     type    version  secp256k1.recovery  chainID
// |----8----|----7----|--------1--------|----16----|

// CombineV combines type, version, chainID together to generate V
export function combineV(type, version, recovery, chainID) {
    type = (type % (1 << 8)) << 24
    version = (version % (1 << 7)) << 17
    recovery = (recovery % (1 << 1)) << 16
    chainID %= 1 << 16
    return type | version | recovery | chainID
}

// ParseV split v to 4 parts
export function parseV(v) {
    const type = (v >> 24) % (1 << 8)
    const version = (v >> 17) % (1 << 7)
    const recovery = (v >> 16) % (1 << 1)
    const chainID = v % (1 << 16)
    return {type, version, recovery, chainID}
}

export function toRaw(tx, fieldName, isNumber, length) {
    let data = tx[fieldName]
    if (fieldName === 'to') {
        data = decodeAddress(data)
    }
    if (isNumber && !Buffer.isBuffer(data)) {
        // parse number in string (e.g. "0x10" or "16") to real number. or else it will be encode by ascii
        data = new BigNumber(data)
    }
    data = toBuffer(data)
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

export function toHexStr(tx, fieldName, length) {
    const str = toRaw(tx, fieldName, true, length).toString('hex')
    return str ? `0x${str}` : ''
}
