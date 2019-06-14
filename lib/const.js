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

export const CreateAssetType = {
    // 通证资产
    TokenAsset: 1,
    // 非同质化资产
    NonFungibleAsset: 2,
    // 通用资产
    CommonAsset: 3,
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
    SignersLog: 10,
}

// The length of nodeID
export const NODE_ID_LENGTH = 128
// The length of hex address bytes (without checksum)
export const ADDRESS_BYTE_LENGTH = 20
// The max length limit of toName field in transaction
export const MAX_TX_TO_NAME_LENGTH = 100
// The max length limit of message field in transaction
export const MAX_TX_MESSAGE_LENGTH = 1024
// The max length limit of host field in deputy
export const MAX_DEPUTY_HOST_LENGTH = 128
// The length of hash string (with 0x)
export const HASH_LENGTH = 66
// The length of address field in transaction
export const TX_ADDRESS_LENGTH = 20
// The length of signature bytes in transaction
export const TX_SIG_BYTE_LENGTH = 65
// 发行资产的唯一标识长度
export const TX_ASSET_CODE_LENGTH = 66
// 交易的资产Id长度
export const TX_ASSET_ID_LENGTH = 66
// 创建临时账户userID十六进制的长度
export const USER_ID_LENGTH = 20
// 创建临时账户时，从from截取出来的十六进制长度
export const SLICE_FROM_LENGTH = 18

// 合约账户的标识
export const CONTRACT_ACCOUNT_TYPE = '02'
// 临时账户的标识
export const TEMP_ACCOUNT_TYPE = '03'

// module name
export const ACCOUNT_NAME = 'account'
export const CHAIN_NAME = 'chain'
export const GLOBAL_NAME = ''
export const MINE_NAME = 'mine'
export const NET_NAME = 'net'
export const TOOL_NAME = 'tool'
export const TX_NAME = 'tx'
