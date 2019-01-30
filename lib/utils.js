import {Buffer} from 'safe-buffer'
import BigNumber from 'bignumber.js'

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
        return moToLemo(mo)
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

export function moToLemo(mo) {
    mo = new BigNumber(mo).toString(10)
    if (mo === '0') {
        return '0 LEMO'
    }
    if (/0{18}$/.test(mo)) {
        // no dot
        return `${mo.slice(0, mo.length - 18)} LEMO`
    }

    if (mo.length <= 18) {
        mo = mo.padStart(19, '0')
    }
    const int = mo.slice(0, mo.length - 18)
    const rest = mo.slice(mo.length - 18).replace(/0+$/, '')
    return `${int}.${rest} LEMO`
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

    throw new Error('invalid type')
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
    formatBuffer,
    toBuffer,
    bufferTrimLeft,
    bufferPadLeft,
    setBufferLength,
    wait,
}
