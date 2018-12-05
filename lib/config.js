// current transaction version. should between 0 to 128
export const TX_VERSION = 1
// Transaction Time To Live, 2hours. It is set on chain
export const TTTL = 2 * 60 * 60
// Gas price for smart contract. Unit is mo/gas
export const TX_DEFAULT_GAS_PRICE = 3000000000
// Max gas limit for smart contract. Unit is gas
export const TX_DEFAULT_GAS_LIMIT = 2000000

// 1: secp256k1 public key
export const ADDRESS_VERSION = 1
