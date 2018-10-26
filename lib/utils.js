import BigNumber from 'bignumber.js'

export function isHash(hashOrHeight) {
    return typeof hashOrHeight === 'string' && hashOrHeight.toLowerCase().startsWith('0x')
}

export function parseBlock(block) {
    return block
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
    return new BigNumber(str, 16)
}

export default {
    isHash,
    parseBlock,
    parseAccount,
    parseBigNumber,
}
