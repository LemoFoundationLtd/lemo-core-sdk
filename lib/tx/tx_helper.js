import BigNumber from 'bignumber.js'
import {Buffer} from 'safe-buffer'
import errors from '../errors'
import {bufferTrimLeft, has0xPrefix, setBufferLength, toBuffer} from '../utils'
import {decodeAddress} from '../crypto'
import {
    NODE_ID_LENGTH,
    MAX_TX_TO_NAME_LENGTH,
    MAX_TX_MESSAGE_LENGTH,
    MAX_DEPUTY_HOST_LENGTH,
    TX_SIG_BYTE_LENGTH,
    TX_ASSET_CODE_LENGTH,
    TX_ASSET_ID_LENGTH,
} from '../const'

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
        checkNegative(config, 'gasPrice')
    }
    if (config.gasLimit) {
        checkType(config, 'gasLimit', ['number', 'string'], true)
    }
    if (config.amount) {
        checkType(config, 'amount', ['number', 'string'], true)
        checkNegative(config, 'amount')
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
    if (config.gasPayerSig) {
        checkType(config, 'gasPayerSig', ['string', Buffer], true)
        checkMaxBytes(config, 'gasPayerSig', TX_SIG_BYTE_LENGTH)
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

export function verifyCreateAssetInfo(config) {
    if (config.category === undefined) {
        throw new Error(errors.TXParamMissingError('category'))
    }
    checkType(config, 'category', ['number'], true)
    checkRange(config, 'category', 1, 3)
    checkType(config, 'decimals', ['number'], true)
    checkRange(config, 'decimals', 0, 0xffff)
    checkType(config, 'isReplenishable', ['boolean'], false)
    checkType(config, 'isDivisible', ['boolean'], false)
    checkType(config.profile, 'name', ['string'], false)
    checkType(config.profile, 'symbol', ['string'], false)
    checkType(config.profile, 'description', ['string'], false)
    checkMaxLength(config.profile, 'description', 256)
    if (config.profile.suggestedGasLimit) {
        checkType(config.profile, 'suggestedGasLimit', ['string'], true)
    }
}

export function verifyIssueAssetInfo(config) {
    if (config.assetCode === undefined) {
        throw new Error(errors.TXParamMissingError('assetCode'))
    }
    checkType(config, 'assetCode', ['string'], false)
    if (config.assetCode.length !== TX_ASSET_CODE_LENGTH) {
        throw new Error(errors.TXInvalidLength('assetCode', config.assetCode, TX_ASSET_CODE_LENGTH))
    }
    if (config.metaData) {
        checkType(config, 'metaData', ['string'], false)
        checkMaxLength(config, 'metaData', 256)
    }
    if (config.supplyAmount === undefined) {
        throw new Error(errors.TXParamMissingError('supplyAmount'))
    }
    checkNegative(config, 'supplyAmount')
    checkType(config, 'supplyAmount', ['string'], true)
    if (/^0x/i.test(config.supplyAmount)) {
        throw new Error(errors.TXIsNotDecimalError('supplyAmount'))
    }
}

export function verifyReplenishAssetInfo(config) {
    checkType(config, 'assetId', ['string'], false)
    if (config.assetId.length !== TX_ASSET_ID_LENGTH) {
        throw new Error(errors.TXInvalidLength('assetId', config.assetId, TX_ASSET_ID_LENGTH))
    }
    checkType(config, 'replenishAmount', ['number', 'string'], true)
    checkNegative(config, 'replenishAmount')
}

export function verifyModifyAssetInfo(config) {
    checkType(config, 'assetCode', ['string'], false)
    if (config.assetCode.length !== TX_ASSET_CODE_LENGTH) {
        throw new Error(errors.TXInvalidLength('assetCode', config.assetCode, TX_ASSET_CODE_LENGTH))
    }
    if (config.info === undefined) {
        throw new Error(errors.TXInfoError())
    }
    if (config.info.name) {
        checkType(config.info, 'name', ['string'], false)
    }
    if (config.info.symbol) {
        checkType(config.info, 'symbol', ['string'], false)
    }
    if (config.info.description) {
        checkType(config.info, 'description', ['string'], false)
        checkMaxLength(config.info, 'description', 256)
    }
    if (config.info.suggestedGasLimit) {
        checkType(config.info, 'suggestedGasLimit', ['string'], true)
    }
    if (config.info.stop) {
        checkType(config.info, 'stop', ['boolean', 'string'], false)
        if (typeof config.info.stop === 'string' && (config.info.stop !== 'true' && config.info.stop !== 'false')) {
            throw new Error(errors.TxInvalidSymbol('stop'))
        }
    }
}

export function verifyTransferAssetInfo(config) {
    if (config.assetId === undefined) {
        throw new Error(errors.TXParamMissingError('assetId'))
    }
    checkType(config, 'assetId', ['string'], false)
    if (config.assetId.length !== TX_ASSET_ID_LENGTH) {
        throw new Error(errors.TXInvalidLength('assetId', config.assetId, TX_ASSET_ID_LENGTH))
    }
}

export function verifyGasInfo(noGasTx, gasPrice, gasLimit) {
    checkType(noGasTx, 'payer', ['string'], false)
    // verify address
    decodeAddress(noGasTx.payer)
    checkType(gasPrice, 'gasPrice', ['number', 'string'], true)
    checkNegative(gasPrice, 'gasPrice')
    checkType(gasLimit, 'gasLimit', ['number', 'string'], true)
}

/**
 * @param {object} obj
 * @param {string} fieldName
 * @param {Array} types
 * @param {boolean} isNumber If the type is string, then it must be a number string
 */
function checkType(obj, fieldName, types, isNumber) {
    let data
    if (typeof obj !== 'object') {
        data = obj
    } else {
        data = obj[fieldName]
    }
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

/**
 * @param {object} obj
 * @param {string} fieldName
 */
function checkNegative(obj, fieldName) {
    if (typeof obj[fieldName] === 'number' && obj[fieldName] < 0) {
        throw new Error(errors.TXNegativeError(fieldName))
    }
    if (typeof obj[fieldName] === 'string' && (obj[fieldName].startsWith('-'))) {
        throw new Error(errors.TXNegativeError(fieldName))
    }
}
