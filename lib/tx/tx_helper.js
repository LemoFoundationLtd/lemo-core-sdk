import BigNumber from 'bignumber.js'
import {Buffer} from 'safe-buffer';
import errors from '../errors';
import {bufferTrimLeft, has0xPrefix, setBufferLength, toBuffer} from '../utils';
import {decodeAddress} from '../crypto';
import {
    NODE_ID_LENGTH,
    MAX_TX_TO_NAME_LENGTH,
    MAX_TX_MESSAGE_LENGTH,
    MAX_DEPUTY_HOST_LENGTH,
    TX_SIG_BYTE_LENGTH,
} from '../const';

/**
 * @return {Buffer}
 */
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

export function checkChainID(config, chainID) {
    if (!config.chainID) {
        return {chainID, ...config}
    } else if (config.chainID !== chainID) {
        console.warn(`The chainID ${config.chainID} from transaction is different with ${chainID} from SDK`)
    }
    return config
}

export function verifyTxConfig(config) {
    if (!config.chainID) {
        throw new Error(errors.TXInvalidChainID())
    }
    checkType(config, 'chainID', ['number', 'string'], true)
    checkRange(config, 'chainID', 1, 0xffff)
    if (config.type) {
        checkType(config, 'type', ['number', 'string'], true)
        checkRange(config, 'type', 0, 0xffff)
    }
    if (config.version) {
        checkType(config, 'version', ['number', 'string'], true)
        checkRange(config, 'version', 0, 0xff)
    }
    if (config.to) {
        checkType(config, 'to', ['string'], false)
        // verify address
        decodeAddress(config.to)
    }
    if (config.toName) {
        checkType(config, 'toName', ['string'], false)
        checkMaxLength(config, 'toName', MAX_TX_TO_NAME_LENGTH)
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
        checkMaxLength(config, 'message', MAX_TX_MESSAGE_LENGTH)
    }
    if (config.sig) {
        checkType(config, 'sig', ['string', Buffer], true)
        checkMaxBytes(config, 'sig', TX_SIG_BYTE_LENGTH)
    }
}

export function verifyCandidateInfo(config) {
    checkType(config, 'isCandidate', ['undefined', 'boolean'], false)
    checkType(config, 'minerAddress', ['string'], false)
    // verify address
    decodeAddress(config.minerAddress)
    checkType(config, 'nodeID', ['string'], false)
    if (config.nodeID.length !== NODE_ID_LENGTH) {
        throw new Error(errors.TXInvalidLength('nodeID', config.nodeID, NODE_ID_LENGTH))
    }
    checkType(config, 'host', ['string'], false)
    checkMaxLength(config, 'host', MAX_DEPUTY_HOST_LENGTH)
    checkType(config, 'port', ['string', 'number'], true)
    checkRange(config, 'port', 1, 0xffff)
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

/**
 * @param {object} obj
 * @param {string} fieldName
 * @param {number} maxLength
 */
function checkMaxLength(obj, fieldName, maxLength) {
    const data = obj[fieldName]
    if (data.length > maxLength) {
        throw new Error(errors.TXInvalidMaxLength(fieldName, obj[fieldName], maxLength))
    }
}

/**
 * @param {object} obj
 * @param {string} fieldName
 * @param {number} maxBytesLength
 */
function checkMaxBytes(obj, fieldName, maxBytesLength) {
    const data = obj[fieldName]
    let dataLen = data.length
    if (typeof data === 'string') {
        dataLen = Math.ceil(dataLen / 2 - (has0xPrefix(data) ? 1 : 0))
    }
    if (dataLen > maxBytesLength) {
        throw new Error(errors.TXInvalidMaxBytes(fieldName, obj[fieldName], maxBytesLength, dataLen))
    }
}
