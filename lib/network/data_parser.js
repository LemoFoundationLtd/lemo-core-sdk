import {toBuffer} from 'lemo-utils'
import LemoTx from 'lemo-tx'

export function parseBlock(block, withBody) {
    if (block) {
        if (block.header) {
            block.header.height = parseNumber(block.header.height)
            block.header.gasLimit = parseNumber(block.header.gasLimit)
            block.header.gasUsed = parseNumber(block.header.gasUsed)
            block.header.timestamp = parseNumber(block.header.timestamp)
        }
        if (withBody) {
            block.changeLogs = (block.changeLogs || []).map(parseChangeLog)
            block.transactions = (block.transactions || []).map(parseTx)
        } else {
            delete block.changeLogs
            delete block.transactions
            delete block.confirms
            delete block.deputyNodes
            delete block.events
        }
    }
    return block
}

export function parseAccount(account) {
    const oldRecords = account.records || {}
    account.records = {}
    Object.entries(oldRecords).forEach(([logType, record]) => {
        record.height = parseNumber(record.height)
        record.version = parseNumber(record.version)
        account.records[parseNumber(logType)] = record
    })

    if (account.candidate) {
        account.candidate = parseCandidate(account.candidate)
    }

    return account
}

export function parseCandidate(candidate) {
    if (candidate.profile) {
        candidate.profile.isCandidate = /true/i.test(candidate.profile.isCandidate)
    }

    return candidate
}

export function parseChangeLog(changeLog) {
    changeLog.type = parseNumber(changeLog.type)
    changeLog.version = parseNumber(changeLog.version)
    return changeLog
}


function parseTx(tx) {
    tx.type = parseNumber(tx.type)
    tx.version = parseNumber(tx.version)
    tx.expirationTime = parseNumber(tx.expirationTime)
    tx.gasLimit = parseNumber(tx.gasLimit)
    tx.parsedData = parseTxData(tx.type, tx.data)
    tx.gasUsed = parseNumber(tx.gasUsed)

    return tx
}

function parseNumber(str) {
    return parseInt(str, 10) || 0
}

export function parseTxData(type, data) {
    type = parseNumber(type)
    let result
    switch (type) {
        case LemoTx.TxType.ORDINARY:
        case LemoTx.TxType.CREATE_CONTRACT:
        case LemoTx.TxType.VOTE:
            result = undefined
            break
        case LemoTx.TxType.BOX_TX:
            data = JSON.parse(toBuffer(data).toString())
            result = data.subTxList.map(parseTx)
            break
        default:
            result = JSON.parse(toBuffer(data).toString())
            break
    }
    return result
}


export function parseAssetInfo(result) {
    result.decimal = parseNumber(result.decimal)
    return result
}

export function parseMetaData(result) {
    if (result.metaData === undefined) {
        result.metaData = ''
    }
    return result
}

export function parseTermReward(result) {
    result.term = parseNumber(result.term)
    result.rewardHeight = parseNumber(result.rewardHeight)
    return result
}

export function parseDeputyNode(result) {
    result = result.map(item => {
        item.rank = parseNumber(item.rank)
        item.port = parseNumber(item.port)
        return item
    })
    return result
}

export default {
    parseBlock,
    parseAccount,
    parseCandidate,
    parseTx,
    parseAssetInfo,
    parseMetaData,
    parseTermReward,
    parseDeputyNode,
}
