// The id of chain network.should between 0 to 128
export const CHAIN_ID_MAIN_NET = 1
export const CHAIN_ID_DEV_NET = 100
// Current transaction version. should between 0 to 128
export const TX_VERSION = 1
// Transaction Time To Live. It is set on chain
export const TTTL = 30 * 60
// Gas price for smart contract. Unit is mo/gas
export const TX_DEFAULT_GAS_PRICE = 3000000000
// Max gas limit for smart contract. Unit is gas
export const TX_DEFAULT_GAS_LIMIT = 2000000
// The interval time of watching poll. It is in milliseconds
export const DEFAULT_POLL_DURATION = 3000
// The max retry times when poll failed
export const MAX_POLL_RETRY = 5

// The  max  poll timeOut  of  tx
export const TX_POLL_MAX_TIME_OUT = 120000

// 1: secp256k1 public key
export const ADDRESS_VERSION = 1
