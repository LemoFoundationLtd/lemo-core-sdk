import {Buffer} from 'safe-buffer'
import keccak from 'keccak'
import BigNumber from 'bignumber.js'
import baseX from 'base-x'
import errors from './errors';
import {setBufferLength, toBuffer, has0xPrefix} from './utils'
import {ADDRESS_VERSION} from './config';
import secp256k1 from './secp256k1/index'

// secp256k1n/2
const N_DIV_2 = new BigNumber('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16)
const base26 = baseX('83456729ABCDFGHJKNPQRSTWYZ')
const ADDRESS_LOGO = 'Lemo'

/**
 * sign hash
 * @param {Buffer} privateKey length must be 32
 * @param {Buffer} hash length must be 32
 * @return {{recovery: number, r: Buffer, s: Buffer}}
 */
export function sign(privateKey, hash) {
    const sig = secp256k1.sign(hash, privateKey)

    return {
        recovery: sig.recovery,
        r: sig.signature.slice(0, 32),
        s: sig.signature.slice(32, 64),
    }
}

/**
 * recover secp256k1 public key from signature
 * @param {Buffer} hash length must be 32
 * @param {number} recovery
 * @param {Buffer} r
 * @param {Buffer} s
 * @return {Buffer} Public key
 */
export function recover(hash, recovery, r, s) {
    // All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
    if (new BigNumber(s).gt(N_DIV_2)) {
        return null
    }
    if (recovery !== 0 && recovery !== 1) {
        console.error('Invalid signature recovery value')
        return null
    }

    try {
        const signature = Buffer.concat([setBufferLength(r, 32), setBufferLength(s, 32)], 64)

        return secp256k1.recover(hash, signature, recovery, false)
    } catch (e) {
        return null
    }
}

export function pubKeyToAddress(pubKey) {
    const addressBin = Buffer.concat([Buffer.from([ADDRESS_VERSION]), keccak256(pubKey.slice(1)).slice(0, 19)])
    return encodeAddress(addressBin)
}

/**
 *
 * @param {Buffer} data
 * @return {Buffer}
 */
export function keccak256(data) {
    return keccak('keccak256').update(data).digest()
}

export function encodeAddress(data) {
    data = toBuffer(data)

    let checkSum = 0
    for (let i = 0; i < data.length; i++) {
        checkSum ^= data[i]
    }

    const fullPayload = Buffer.concat([data, Buffer.from([checkSum])])

    const encoded = base26.encode(fullPayload)

    return ADDRESS_LOGO + encoded
}

export function decodeAddress(address) {
    if (!address || has0xPrefix(address)) {
        return address
    }
    if (typeof address !== 'string') {
        throw new Error(errors.InvalidAddress(address))
    }
    address = address.toUpperCase()
    if (address.slice(0, 4) !== ADDRESS_LOGO.toUpperCase()) {
        throw new Error(errors.InvalidAddress(address))
    }

    const fullPayload = base26.decode(address.slice(4))
    const data = fullPayload.slice(0, fullPayload.length - 1)
    const checkSum = fullPayload[fullPayload.length - 1]

    let realCheckSum = 0
    for (let i = 0; i < data.length; i++) {
        realCheckSum ^= data[i]
    }
    if (realCheckSum !== checkSum) {
        throw new Error(errors.InvalidAddressCheckSum(address))
    }

    // trim left 00
    const hex = data.toString('hex').replace(/^(00)+/, '')
    return `0x${hex}`
}
