export const TxType = {
    // Ordinary transaction for transfer LEMO or call smart contract
    ORDINARY: 0,
    // Vote transaction for set vote target
    VOTE: 1,
    // Candidate transaction for register or edit candidate information
    CANDIDATE: 2,
}

export const ChangeLogTypes = {
    BalanceLog: 1,
    StorageLog: 2,
    CodeLog: 3,
    AddEventLog: 4,
    SuicideLog: 5,
    VoteForLog: 6,
    VotesLog: 7,
    CandidateProfileLog: 8,
    TxCountLog: 9,
}

// The length of nodeID
export const NODE_ID_LENGTH = 128
// The max length limit of toName field in transaction
export const MAX_TX_TO_NAME_LENGTH = 100
// The max length limit of message field in transaction
export const MAX_TX_MESSAGE_LENGTH = 1024
// The max length limit of host field in deputy
export const MAX_DEPUTY_HOST_LENGTH = 128
// The length of hash string (with 0x)
export const HASH_LENGTH = 66
// The length of to field in transaction
export const TX_TO_LENGTH = 20
// The length of signature Buffer in transaction
export const TX_SIG_BYTE_LENGTH = 65

// module name
export const ACCOUNT_NAME = 'account'
export const CHAIN_NAME = 'chain'
export const GLOBAL_NAME = ''
export const MINE_NAME = 'mine'
export const NET_NAME = 'net'
export const TOOL_NAME = 'tool'
export const TX_NAME = 'tx'
