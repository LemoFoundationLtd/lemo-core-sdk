import {Buffer} from 'safe-buffer'
import BigNumber from 'bignumber.js'
import errors from './errors'
import {decodeAddress, encodeAddress} from './crypto'
import {USER_ID_LENGTH, SLICE_FROM_LENGTH, TEMP_ACCOUNT_TYPE} from './const'

export function isHash(hashOrHeight) {
    return typeof hashOrHeight === 'string' && hashOrHeight.toLowerCase().startsWith('0x')
}

export function has0xPrefix(str) {
    return typeof str === 'string' && str.slice(0, 2).toLowerCase() === '0x'
}

export function formatBuffer(buffer, trimLeft) {
    if (Buffer.isBuffer(buffer)) {
        buffer = buffer.length > 0 ? `0x${buffer.toString('hex')}` : ''
    }
    if (trimLeft && typeof buffer === 'string') {
        buffer = buffer.replace(/^0x(0+)/i, '0x')
    }
    return buffer
}

export function formatBigNumber(bn) {
    return BigNumber.isBigNumber(bn) ? `0x${bn.integerValue(BigNumber.ROUND_FLOOR).toString(10)}` : bn
}

export function formatMoney(mo) {
    mo = new BigNumber(mo).toString(10)
    if (mo === '0') {
        return '0 LEMO'
    }
    if (mo.length > 12) {
        // use LEMO
        return `${moToLemo(mo)} LEMO`
    }

    // use mo
    if (/0{9}$/.test(mo)) {
        return `${mo.slice(0, mo.length - 9)}G mo`
    } else if (/0{6}$/.test(mo)) {
        return `${mo.slice(0, mo.length - 6)}M mo`
    } else if (/0{3}$/.test(mo)) {
        return `${mo.slice(0, mo.length - 3)}K mo`
    } else {
        return `${mo} mo`
    }
}

/**
 * Takes an input and transforms it into an BigNumber
 *
 * @method toBigNumber
 * @param {number|string|BigNumber} num A number, string, HEX string or BigNumber
 * @return {BigNumber} BigNumber
 */
export function toBigNumber(num) {
    let result
    if (num instanceof BigNumber || (num.constructor && num.constructor.name === 'BigNumber')) {
        result = num
    } else if (typeof num === 'string' && num.startsWith('0x')) {
        result = new BigNumber(num.replace('0x', ''), 16)
    } else {
        result = new BigNumber(num.toString(10), 10)
    }
    if (result.isNaN()) {
        throw new Error(errors.MoneyFormatError())
    }
    return result
}

/**
 * 将单位从mo转换为LEMO的个数
 * @param {number|string} mo
 * @return {BigNumber}
 */
export function moToLemo(mo) {
    return toBigNumber(mo).dividedBy(new BigNumber('1000000000000000000', 10));
}

/**
 * 将单位从LEMO的个数转换为mo
 * @param {number|string} ether
 * @return {BigNumber}
 */
export function lemoToMo(ether) {
    return toBigNumber(ether).times(new BigNumber('1000000000000000000', 10));
}

export function toBuffer(v) {
    if (Buffer.isBuffer(v)) {
        return v
    }
    if (v === null || v === undefined) {
        return Buffer.allocUnsafe(0)
    }
    if (Array.isArray(v)) {
        return Buffer.from(v)
    }
    if (typeof v === 'string') {
        // is Hex String
        if (v.match(/^0x[0-9A-Fa-f]*$/)) {
            return hexStringToBuffer(v)
        } else {
            // encode string as utf8
            return Buffer.from(v)
        }
    }
    if (typeof v === 'number') {
        v = v.toString(16)
        return hexStringToBuffer(v)
    }
    // BigNumber object
    if (BigNumber.isBigNumber(v)) {
        v = v.toString(16)
        return hexStringToBuffer(v)
    }
    // BN object
    if (v.toArray) {
        return Buffer.from(v.toArray())
    }

    throw new Error(errors.NotSupportedType())
}

function hexStringToBuffer(hex) {
    if (hex.slice(0, 2).toLowerCase() === '0x') {
        hex = hex.slice(2)
    }
    if (hex.length % 2) {
        hex = `0${hex}`
    }
    return Buffer.from(hex, 'hex')
}

export function decodeUtf8Hex(hex) {
    return hexStringToBuffer(hex).toString()
}

export function bufferTrimLeft(buffer) {
    let i = 0
    for (; i < buffer.length; i++) {
        if (buffer[i].toString() !== '0') {
            buffer = buffer.slice(i)
            break
        }
    }
    if (i === buffer.length) {
        buffer = Buffer.allocUnsafe(0)
    }
    return buffer
}

export function bufferPadLeft(buffer, length) {
    if (buffer.length > length) {
        throw new Error(`data must be less than ${length} bytes`)
    } else if (buffer.length < length) {
        return setBufferLength(buffer, length, false)
    }
    return buffer
}

export function setBufferLength(buffer, length, right) {
    if (right) {
        if (buffer.length < length) {
            const buf = Buffer.allocUnsafe(length).fill(0)
            buffer.copy(buf)
            return buf
        }
        return buffer.slice(0, length)
    } else {
        if (buffer.length < length) {
            const buf = Buffer.allocUnsafe(length).fill(0)
            buffer.copy(buf, length - buffer.length)
            return buf
        }
        return buffer.slice(-length)
    }
}

/**
 * Create temp address
 * @param {string} from Creator address
 * @param {string} userId User id
 * @return {string}
 */
export function createTempAddress(from, userId) {
    if (typeof userId === 'string') {
        userId = Buffer.from(userId).toString('hex')
    } else if (typeof userId === 'number') {
        userId = userId.toString(16)
    } else {
        throw new Error(errors.InvalidUserId())
    }
    if (userId.length > USER_ID_LENGTH) {
        throw new Error(errors.TXInvalidUserIdLength())
    }
    userId = userId.padStart(USER_ID_LENGTH, '0')
    const codeAddress = decodeAddress(from)
    const sender = codeAddress.substring(codeAddress.length - SLICE_FROM_LENGTH)
    return encodeAddress(`0x${TEMP_ACCOUNT_TYPE}${sender}${userId}`)
}

/**
 * time out promise
 * @param {number} duration millisecond
 * @return {Promise}
 */
export function wait(duration) {
    return new Promise(resolve => setTimeout(resolve, duration))
}

export default {
    isHash,
    has0xPrefix,
    formatMoney,
    toBigNumber,
    lemoToMo,
    moToLemo,
    formatBuffer,
    toBuffer,
    decodeUtf8Hex,
    bufferTrimLeft,
    bufferPadLeft,
    setBufferLength,
    wait,
    createTempAddress,
}
