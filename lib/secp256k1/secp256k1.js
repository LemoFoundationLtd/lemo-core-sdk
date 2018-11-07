import {Buffer} from 'safe-buffer'
import BigNumber from 'bignumber.js'
import elliptic from 'elliptic'
import messages from './messages'

// eslint-disable-next-line new-cap
const ec = new elliptic.ec('secp256k1')
const ecparams = ec.curve

export function sign(message, privateKey) {
    const d = bufferToBigNumber(privateKey)
    if (d.comparedTo(bnToBigNumber(ecparams.n)) >= 0 || d.isZero()) {
        throw new Error(messages.ECDSA_SIGN_FAIL)
    }

    const result = ec.sign(message, privateKey, {canonical: true})
    return {
        signature: Buffer.concat([result.r.toArrayLike(Buffer, 'be', 32), result.s.toArrayLike(Buffer, 'be', 32)]),
        recovery: result.recoveryParam,
    }
}

export function recover(message, signature, recovery, compressed) {
    const sigObj = {r: signature.slice(0, 32), s: signature.slice(32, 64)}

    const sigr = bufferToBigNumber(sigObj.r)
    const sigs = bufferToBigNumber(sigObj.s)
    if (sigr.comparedTo(bnToBigNumber(ecparams.n)) >= 0 || sigs.comparedTo(bnToBigNumber(ecparams.n)) >= 0) {
        throw new Error(messages.ECDSA_SIGNATURE_PARSE_FAIL)
    }

    try {
        if (sigr.isZero() || sigs.isZero()) throw new Error()

        const point = ec.recoverPubKey(message, sigObj, recovery)
        return Buffer.from(point.encode(true, compressed))
    } catch (err) {
        throw new Error(messages.ECDSA_RECOVER_FAIL)
    }
}

function bufferToBigNumber(buffer) {
    return new BigNumber(buffer.toString('hex'), 16)
}

function bnToBigNumber(bn) {
    return new BigNumber(bn.toString(16), 16)
}

export default {
    sign,
    recover,
}
