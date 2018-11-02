import { Buffer } from 'safe-buffer'
import BigNumber from 'bignumber.js'

export function isHash(hashOrHeight) {
    return typeof hashOrHeight === 'string' && hashOrHeight.toLowerCase().startsWith('0x')
}

export function has0xPrefix(str) {
    return typeof str === 'string' && str.slice(0, 2).toLowerCase() === '0x'
}

export function parseBlock(block) {
    block.ChangeLogs[0].type = parseString(block.ChangeLogs[0].type)
    return block
}

export function parseString(str) {
    return str.toString()
}

export function parseAccount(account) {
    account.balance = parseBigNumber(account.balance)

    const oldRecords = account.records || {}
    account.records = {}
    Object.entries(oldRecords).forEach(([logType, record]) => {
        account.records[parseChangeLogType(logType)] = record
    })

    return account
}

export function parseChangeLogType(logType) {
    const dict = ['', 'BalanceLog', 'StorageLog', 'CodeLog', 'AddEventLog', 'SuicideLog']
    if (logType <= 0 || logType >= dict.length) {
        return `UnknonwType(${logType})`
    }
    return dict[logType]
}

export function parseBigNumber(str) {
    const base = str.slice(0, 2).toLowerCase() === '0x' ? 16 : 10
    return new BigNumber(str, base)
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

export function toBuffer(v) {
    if (Buffer.isBuffer(v)) {
        return v
    }
    if (Array.isArray(v)) {
        v = Buffer.from(v)
    } else if (typeof v === 'string') {
        if (v.match(/^0x[0-9A-Fa-f]*$/)) { // is Hex String
            v = v.toLowerCase().startsWith('0x') ? v.slice(2) : v;
            if (v.length % 2) {
                v = `0${v}`;
            }
            v = Buffer.from(v, 'hex')
        } else {
            v = Buffer.from(v)
        }
    } else if (typeof v === 'number') {
        v = v.toString(16);
        if (v.length % 2) {
            v = `0${v}`;
        }
        v = Buffer.from(v, 'hex')
    } else if (v === null || v === undefined) {
        v = Buffer.allocUnsafe(0)
    } else if (BigNumber.isBigNumber(v)) {
        v = Buffer.from(v.toString(10))
    } else if (v.toArray) {
        // converts a BN to a Buffer
        v = Buffer.from(v.toArray())
    } else {
        throw new Error('invalid type')
    }
    return v
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

export default {
    isHash,
    has0xPrefix,
    parseBlock,
    parseAccount,
    parseBigNumber,
    formatBuffer,
    toBuffer,
    bufferTrimLeft,
    bufferPadLeft,
    setBufferLength,
}