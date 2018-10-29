import {Buffer} from 'safe-buffer'
import keccak from 'keccak'
import BigNumber from 'bignumber.js'
import baseX from 'base-x'
import {setBufferLength, toBuffer} from './utils'
import {ADDRESS_VERSION} from './config';
import secp256k1 from './secp256k1/index'

// secp256k1n/2
const N_DIV_2 = new BigNumber('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16)
const base26 = baseX('23456789ABCDFGHJKNPQRSTWYZ')

/**
 * sign hash
 * @param {Buffer} privateKey length must be 32
 * @param {Buffer} hash length must be 32
 * @return {{recovery: number, r: string, s: string}}
 */
export function sign(privateKey, hash) {
    const sig = secp256k1.sign(hash, privateKey)

    return {
        recovery: sig.recovery,
        r: sig.signature.slice(0, 32),
        s: sig.signature.slice(32, 64),
    }
}

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

    return `Lemo${encoded}`
}
