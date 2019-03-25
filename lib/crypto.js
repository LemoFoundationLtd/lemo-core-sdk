import {Buffer} from 'safe-buffer'
import keccak from 'keccak'
import BigNumber from 'bignumber.js'
import baseX from 'base-x'

import errors from './errors';
import {setBufferLength, toBuffer, has0xPrefix, bufferTrimLeft} from './utils'
import {ADDRESS_VERSION} from './config';
import {ADDRESS_BYTE_LENGTH} from './const';
import secp256k1 from './secp256k1/index'
import messages from './secp256k1/messages'
import BN from './secp256k1/bn/index'
import g from './secp256k1/ecpointg'

// secp256k1n/2
const N_DIV_2 = new BigNumber('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16)
const BASE26_ALPHABET = '83456729ABCDFGHJKNPQRSTWYZ'
const BASE26_0 = BASE26_ALPHABET[0]
const base26 = baseX(BASE26_ALPHABET)
const ADDRESS_LOGO = 'Lemo'

/**
 * sign hash
 * @param {Buffer} privateKey length must be 32
 * @param {Buffer} hash length must be 32
 * @return {Buffer}
 */
export function sign(privateKey, hash) {
    const sig = secp256k1.sign(hash, privateKey)
    const recovery = Buffer.from([sig.recovery])
    return Buffer.concat([recovery, sig.signature]);
}

/**
 * Recover public key from hash and sign data
 * @param {Buffer} hash
 * @param {Buffer} sig
 * @return {Buffer|null}
 */
export function recover(hash, sig) {
    sig = setBufferLength(sig, 65)
    const recovery = sig[0]
    if (recovery !== 0 && recovery !== 1) {
        console.error('Invalid signature recovery value')
        return null
    }

    // const r = sig.slice(1, 33)
    const s = sig.slice(33, 65)
    // All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
    if (new BigNumber(s).gt(N_DIV_2)) {
        return null
    }

    try {
        const signature = sig.slice(1)

        return secp256k1.recover(hash, signature, recovery, false)
    } catch (e) {
        return null
    }
}

/**
 * Decode public key to LemoChain address
 * @param {Buffer} pubKey
 * @return {string}
 */
export function pubKeyToAddress(pubKey) {
    const addressBin = Buffer.concat([Buffer.from([ADDRESS_VERSION]), keccak256(pubKey.slice(1)).slice(0, 19)])
    return encodeAddress(addressBin)
}

/**
 * sha3
 * @param {Buffer} data
 * @return {Buffer}
 */
export function keccak256(data) {
    return keccak('keccak256').update(data).digest()
}

/**
 * Decode hex address to LemoChain address
 * @param {Buffer} data
 * @return {string}
 */
export function encodeAddress(data) {
    data = toBuffer(data)

    let checkSum = 0
    for (let i = 0; i < data.length; i++) {
        checkSum ^= data[i]
    }

    const fullPayload = Buffer.concat([data, Buffer.from([checkSum])])

    let encoded = base26.encode(fullPayload)
    while (encoded.length < 36) {
        encoded = BASE26_0 + encoded
    }

    return ADDRESS_LOGO + encoded
}

/**
 * Decode LemoChain address to hex address
 * @param {string} address
 * @return {string}
 */
export function decodeAddress(address) {
    if (typeof address !== 'string') {
        throw new Error(errors.InvalidAddressType(address))
    }

    const origAddr = address
    if (has0xPrefix(address)) {
        if (new RegExp(`^0x[0-9a-f]{0,${ADDRESS_BYTE_LENGTH * 2}}$`, 'i').test(address)) {
            return address
        } else {
            throw new Error(errors.InvalidHexAddress(origAddr))
        }
    }
    address = address.toUpperCase()
    if (address.slice(0, 4) !== ADDRESS_LOGO.toUpperCase()) {
        // no logo
        throw new Error(errors.InvalidAddress(origAddr))
    }
    if (address.length < 4 + 2) {
        // no checkSum
        throw new Error(errors.InvalidAddressCheckSum(origAddr))
    }

    let fullPayload
    try {
        fullPayload = base26.decode(address.slice(4))
    } catch (e) {
        throw new Error(errors.DecodeAddressError(address, e.message))
    }
    fullPayload = bufferTrimLeft(fullPayload)
    const maxLenWithCheckSum = ADDRESS_BYTE_LENGTH + 1
    if (fullPayload.length > maxLenWithCheckSum) {
        throw new Error(errors.InvalidAddressLength(origAddr))
    }
    const data = fullPayload.slice(0, fullPayload.length - 1)
    const checkSum = fullPayload[fullPayload.length - 1]

    let realCheckSum = 0
    for (let i = 0; i < data.length; i++) {
        realCheckSum ^= data[i]
    }
    if (realCheckSum !== checkSum) {
        throw new Error(errors.InvalidAddressCheckSum(origAddr))
    }

    // trim left 00
    const hex = data.toString('hex').replace(/^(00)+/, '')
    return `0x${hex}`
}


function privateToAddress(privKey) {
    privKey = toBuffer(privKey)
    const d = BN.fromBuffer(privKey)
    if (d.isOverflow() || d.isZero()) {
        throw new Error(messages.EC_PUBLIC_KEY_CREATE_FAIL)
    }
    return pubKeyToAddress(g.mul(d).toPublicKey(false))
}

function randomBytes(size) {
    const numArr = new Array(size).fill(0).map(() => Math.floor(Math.random() * 256))
    return Buffer.from(numArr)
}

/**
 * 创建账户
 * @return {{privateKey: string, address: string}}
 */
export function generateAccount() {
    let privKey
    let address
    while (!address) {
        privKey = randomBytes(32)
        try {
            address = privateToAddress(privKey)
        } catch (error) {
            console.warn(error, 'try again')
        }
    }
    return {
        privateKey: `0x${privKey.toString('hex')}`,
        address,
    }
}

