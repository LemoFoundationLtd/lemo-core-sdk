import BigNumber from 'bignumber.js'
import {formatMoney, moToLemo} from '../utils'
import {ChangeLogTypes, TxType} from '../const'
import Tx from '../tx/tx'

export function parseBlock(chainID, block, withBody) {
    if (block) {
        if (block.header) {
            block.header.height = parseNumber(block.header.height)
            block.header.gasLimit = parseNumber(block.header.gasLimit)
            block.header.gasUsed = parseNumber(block.header.gasUsed)
            block.header.timestamp = parseNumber(block.header.timestamp)
        }
        if (withBody) {
            block.changeLogs = (block.changeLogs || []).map(parseChangeLog)
            block.transactions = (block.transactions || []).map(parseTx.bind(null, chainID))
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
    account.balance = parseMoney(account.balance)
    account.txCount = parseNumber(account.txCount)

    const oldRecords = account.records || {}
    account.records = {}
    Object.entries(oldRecords).forEach(([logType, record]) => {
        record.height = parseNumber(record.height)
        record.version = parseNumber(record.version)
        account.records[parseChangeLogType(logType)] = record
    })

    if (account.candidate) {
        account.candidate = parseCandidate(account.candidate)
    }

    return account
}

export function parseCandidate(candidate) {
    if (candidate.votes) {
        candidate.votes = moToLemo(candidate.votes).toString(10)
    }
    if (candidate.profile) {
        candidate.profile.isCandidate = /true/i.test(candidate.profile.isCandidate)
        candidate.profile.port = parseNumber(candidate.profile.port)
    }

    return candidate
}

export function parseChangeLog(changeLog) {
    changeLog.type = parseChangeLogType(changeLog.type)
    changeLog.version = parseNumber(changeLog.version)
    return changeLog
}

export function parseChangeLogType(logType) {
    logType = parseInt(logType, 10)
    const typeInfo = Object.entries(ChangeLogTypes).find(item => logType === item[1])
    if (!typeInfo) {
        return `UnknonwType(${logType})`
    }
    return typeInfo[0]
}

export function parseTxRes(chainID, res) {
    const tx = parseTx(chainID, res.tx)
    tx.minedTime = parseNumber(res.time)
    tx.blockHeight = parseNumber(res.height)
    tx.blockHash = res.blockHash

    return tx
}

export function parseTxListRes(chainID, res) {
    let txList = res.txList || []

    txList = txList.map(item => {
        const tx = parseTx(chainID, item.tx)
        tx.minedTime = parseNumber(item.time)
        return tx
    })

    return {txList, total: parseNumber(res.total)}
}

function parseTx(chainID, tx) {
    // new Tx will fill default fields such as gasPrice. So we couldn't return it directly
    const txObj = new Tx(tx)
    tx.from = txObj.from
    tx.type = txObj.type
    tx.typeText = parseTxType(txObj.type)
    tx.version = txObj.version
    tx.amount = parseMoney(tx.amount)
    tx.expirationTime = parseNumber(tx.expirationTime)
    tx.gasPrice = parseMoney(tx.gasPrice)
    tx.gasLimit = parseNumber(tx.gasLimit)

    return tx
}

function parseTxType(txType) {
    txType = parseInt(txType, 10)
    const typeInfo = Object.entries(TxType).find(item => txType === item[1])
    if (!typeInfo) {
        return `UnknonwType(${txType})`
    }
    return typeInfo[0]
}

function parseNumber(str) {
    return parseInt(str, 10) || 0
}

export function parseBigNumber(str) {
    return new BigNumber(str)
}

export function parseMoney(str) {
    const result = new BigNumber(str)
    Object.defineProperty(result, 'toMoney', {
        enumerable: false,
        value: formatMoney.bind(null, result),
    })
    return result
}

export function parseAsset(result) {
    result.equities.forEach(item => {
        item.equity = formatMoney(item.equity)
    })
    return result
}

export default {
    parseBlock,
    parseAccount,
    parseCandidate,
    parseTx,
    parseTxRes,
    parseTxListRes,
    parseBigNumber,
    parseMoney,
    parseAsset,
}
