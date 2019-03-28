/* secp256k1-node v3.5.2 https://github.com/cryptocoinjs/secp256k1-node */
/* modified by lnkyan to minimize the size and to import new elliptic library which fit the rollup */
import {Buffer} from 'safe-buffer'
import BigNumber from 'bignumber.js'
import elliptic from 'elliptic'
import assert from './assert'
import messages from './messages'

// eslint-disable-next-line new-cap
const ec = new elliptic.ec('secp256k1')
const N = bnToBigNumber(ec.curve.n)


function checkSignParams(message, privateKey) {
    assert.isBuffer(message, messages.MSG32_TYPE_INVALID)
    assert.isBufferLength(message, 32, messages.MSG32_LENGTH_INVALID)

    assert.isBuffer(privateKey, messages.EC_PRIVATE_KEY_TYPE_INVALID)
    assert.isBufferLength(privateKey, 32, messages.EC_PRIVATE_KEY_LENGTH_INVALID)
}

export function sign(message, privateKey) {
    checkSignParams(message, privateKey)

    const d = bufferToBigNumber(privateKey)
    if (d.comparedTo(N) >= 0 || d.isZero()) {
        throw new Error(messages.ECDSA_SIGN_FAIL)
    }

    const result = ec.sign(message, privateKey, {canonical: true})
    return {
        signature: Buffer.concat([result.r.toArrayLike(Buffer, 'be', 32), result.s.toArrayLike(Buffer, 'be', 32)]),
        recovery: result.recoveryParam,
    }
}

function checkRecoverParams(message, signature, recovery) {
    assert.isBuffer(message, messages.MSG32_TYPE_INVALID)
    assert.isBufferLength(message, 32, messages.MSG32_LENGTH_INVALID)

    assert.isBuffer(signature, messages.ECDSA_SIGNATURE_TYPE_INVALID)
    assert.isBufferLength(signature, 64, messages.ECDSA_SIGNATURE_LENGTH_INVALID)

    assert.isNumber(recovery, messages.RECOVERY_ID_TYPE_INVALID)
    assert.isNumberInInterval(recovery, -1, 4, messages.RECOVERY_ID_VALUE_INVALID)
}

export function recover(message, signature, recovery) {
    checkRecoverParams(message, signature, recovery)

    const sigObj = {r: signature.slice(0, 32), s: signature.slice(32, 64)}

    const sigr = bufferToBigNumber(sigObj.r)
    const sigs = bufferToBigNumber(sigObj.s)
    if (sigr.comparedTo(N) >= 0 || sigs.comparedTo(N) >= 0) {
        throw new Error(messages.ECDSA_SIGNATURE_PARSE_FAIL)
    }
    if (sigr.isZero() || sigs.isZero()) {
        throw new Error(messages.ECDSA_RECOVER_FAIL)
    }

    try {
        const point = ec.recoverPubKey(message, sigObj, recovery)
        return Buffer.from(point.encode())
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
    N,
}
