import BigNumber from 'bignumber.js'
import {formatMoney} from '../utils'
import Tx from '../tx/tx'


export function parseBlock(signer, block) {
    if (block) {
        if (block.header) {
            block.header.height = Number(block.header.height)
            block.header.timestamp = Number(block.header.timestamp)
        }
        if (block.changeLogs) {
            block.changeLogs.forEach(item => {
                item.type = parseChangeLogType(item.type)
            })
        }
        if (block.transactions) {
            block.transactions.forEach(item => {
                parseTx(signer, item)
            })
        }
    }
    return block
}

export function parseAccount(account) {
    account.balance = parseMoney(account.balance)

    const oldRecords = account.records || {}
    account.records = {}
    Object.entries(oldRecords).forEach(([logType, record]) => {
        record.height = Number(record.height)
        record.version = Number(record.version)
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

export function parseTx(signer, tx) {
    tx.from = signer.recover(new Tx(tx))
    tx.amount = parseMoney(tx.amount)
    tx.expirationTime = Number(tx.expirationTime)
    tx.gasLimit = Number(tx.gasLimit)

    return tx
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

export default {
    parseBlock,
    parseAccount,
    parseTx,
    parseBigNumber,
    parseMoney,
}
