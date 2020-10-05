// The interval time of watching poll. It is in milliseconds
export const DEFAULT_POLL_DURATION = 3000
// The max retry times when poll failed
export const MAX_POLL_RETRY = 5
// The max poll timeOut of tx
export const TX_POLL_MAX_TIME_OUT = 120000
// It's a special height which means watch block from the newest block
export const NO_LAST_HEIGHT = -1

export const ChangeLogType = {
    BalanceLog: 1,
    StorageLog: 2,
    StorageRootLog: 3,
    AssetCodeLog: 4,
    AssetCodeStateLog: 5,
    AssetCodeRootLog: 6,
    AssetCodeTotalSupplyLog: 7,
    AssetIdLog: 8,
    AssetIdRootLog: 9,
    EquityLog: 10,
    EquityRootLog: 11,
    CandidateLog: 12,
    CandidateStateLog: 13,
    CodeLog: 14,
    AddEventLog: 15,
    SuicideLog: 16,
    VoteForLog: 17,
    VotesLog: 18,
    SignerLog: 19,
}

// module name
export const ACCOUNT_NAME = 'account'
export const CHAIN_NAME = 'chain'
export const GLOBAL_NAME = ''
export const MINE_NAME = 'mine'
export const NET_NAME = 'net'
export const TX_NAME = 'tx'
