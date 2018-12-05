import BigNumber from 'bignumber.js'
import {Buffer} from 'safe-buffer';
import errors from '../errors';
import {bufferTrimLeft, has0xPrefix, setBufferLength, toBuffer} from '../utils';
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
            throw new Error(errors.TXFieldToLong(fieldName, length))
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

export function validateTxConfig(config) {
    // v, type, version
    if (config.v) {
        checkType(config, 'v', ['string', Buffer], true)
        checkRange(config, 'v', 0, 0xffffffff)
        checkRange(config, 'v', 0, 0xffffffff)
        if (config.type) {
            throw new Error(errors.TXVTypeConflict(config))
        }
        if (config.version) {
            throw new Error(errors.TXVVersionConflict(config))
        }
    } else {
        if (config.type) {
            checkType(config, 'type', ['number'], true)
            checkRange(config, 'type', 0, 0xff)
        }
        if (config.version) {
            checkType(config, 'version', ['number'], true)
            checkRange(config, 'version', 0, 0x7f)
        }
    }
    if (config.to) {
        // TODO validate address
        checkType(config, 'to', ['string'], false)
    }
    if (config.toName) {
        checkType(config, 'toName', ['string'], false)
    }
    if (config.gasPrice) {
        checkType(config, 'gasPrice', ['number', 'string'], true)
    }
    if (config.gasLimit) {
        checkType(config, 'gasLimit', ['number', 'string'], true)
    }
    if (config.amount) {
        checkType(config, 'amount', ['number', 'string'], true)
    }
    if (config.data) {
        checkType(config, 'data', ['string', Buffer], true)
    }
    if (config.expirationTime) {
        checkType(config, 'expirationTime', ['number', 'string'], true)
    }
    if (config.message) {
        checkType(config, 'message', ['string'], false)
    }
    if (config.r) {
        checkType(config, 'r', ['string', Buffer], true)
    }
    if (config.s) {
        checkType(config, 's', ['string', Buffer], true)
    }
}

/**
 * @param {object} obj
 * @param {string} fieldName
 * @param {Array} types
 * @param {boolean} isNumber If the type is string, then it must be a number string
 */
function checkType(obj, fieldName, types, isNumber) {
    const data = obj[fieldName]
    const typeStr = typeof data
    for (let i = 0; i < types.length; i++) {
        if (typeStr === types[i]) {
            // Type is correct now. Check number characters before we leave
            if (typeStr === 'string' && isNumber) {
                const isHex = has0xPrefix(data)
                if (isHex && !/^0x[0-9a-f]*$/i.test(data)) {
                    throw new Error(errors.TXMustBeNumber(fieldName, data))
                }
                if (!isHex && !/^\d+$/.test(data)) {
                    throw new Error(errors.TXMustBeNumber(fieldName, data))
                }
            }
            return
        }
        const isClassType = typeof types[i] === 'object' || typeof types[i] === 'function'
        if (isClassType && data instanceof types[i]) {
            return
        }
    }
    throw new Error(errors.TXInvalidType(fieldName, data, types))
}

/**
 * @param {object} obj
 * @param {string} fieldName
 * @param {number} from
 * @param {number} to
 */
function checkRange(obj, fieldName, from, to) {
    let data = obj[fieldName]
    // convert all Buffer to string
    if (data instanceof Buffer) {
        data = `0x${data.toString('hex')}`
    }
    // convert all string to number
    if (typeof data === 'string') {
        data = parseInt(data, has0xPrefix(data) ? 16 : 10)
    }
    if (typeof data !== 'number') {
        throw new Error(errors.TXCanNotTestRange(fieldName, obj[fieldName]))
    }

    if (data < from || data > to) {
        throw new Error(errors.TXInvalidRange(fieldName, obj[fieldName], from, to))
    }
}
