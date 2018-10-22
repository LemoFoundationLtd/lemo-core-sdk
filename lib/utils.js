import BigNumber from 'bignumber.js'

export function isHash(hashOrHeight) {
    return typeof hashOrHeight === 'string' && hashOrHeight.toLowerCase().startsWith('0x')
}

export function parseBlock(block) {
    return block
}

export function strToBigNumber(num) {
    return new BigNumber(num)
}

export default {
    isHash,
    parseBlock,
    strToBigNumber,
}
