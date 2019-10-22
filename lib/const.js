// The interval time of watching poll. It is in milliseconds
export const DEFAULT_POLL_DURATION = 3000
// The max retry times when poll failed
export const MAX_POLL_RETRY = 5
// The max poll timeOut of tx
export const TX_POLL_MAX_TIME_OUT = 120000
// It's a special height which means watch block from the newest block
export const NO_LAST_HEIGHT = -1

export const TxType = {
    // Ordinary transaction for transfer LEMO or call smart contract
    ORDINARY: 0,
    // 创建智能合约交易
    CREATE_CONTRACT: 1,
    // Vote transaction for set vote target
    VOTE: 2,
    // Candidate transaction for register or edit candidate information
    CANDIDATE: 3,
    // 创建资产交易
    CREATE_ASSET: 4,
    // 发行资产交易
    ISSUE_ASSET: 5,
    // 增发资产交易
    REPLENISH_ASSET: 6,
    // 修改资产交易
    MODIFY_ASSET: 7,
    // 交易资产交易
    TRANSFER_ASSET: 8,
    // 修改多重签名
    MODIFY_SIGNER: 9,
    // 箱子交易
    BOX_TX: 10,
}

export const ChangeLogTypes = {
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
