/* secp256k1-node v3.5.2 https://github.com/cryptocoinjs/secp256k1-node */
/* modified by lnkyan to minimize the size and to import new elliptic library which fit the rollup */
import assert from './assert'
import messages from './messages'
import secp256k1 from './secp256k1'

export function sign(message, privateKey) {
    assert.isBuffer(message, messages.MSG32_TYPE_INVALID)
    assert.isBufferLength(message, 32, messages.MSG32_LENGTH_INVALID)

    assert.isBuffer(privateKey, messages.EC_PRIVATE_KEY_TYPE_INVALID)
    assert.isBufferLength(privateKey, 32, messages.EC_PRIVATE_KEY_LENGTH_INVALID)

    return secp256k1.sign(message, privateKey)
}

export function recover(message, signature, recovery, compressed) {
    assert.isBuffer(message, messages.MSG32_TYPE_INVALID)
    assert.isBufferLength(message, 32, messages.MSG32_LENGTH_INVALID)

    assert.isBuffer(signature, messages.ECDSA_SIGNATURE_TYPE_INVALID)
    assert.isBufferLength(signature, 64, messages.ECDSA_SIGNATURE_LENGTH_INVALID)

    assert.isNumber(recovery, messages.RECOVERY_ID_TYPE_INVALID)
    assert.isNumberInInterval(recovery, -1, 4, messages.RECOVERY_ID_VALUE_INVALID)

    assert.isBoolean(compressed, messages.COMPRESSED_TYPE_INVALID)

    return secp256k1.recover(message, signature, recovery, compressed)
}

export default {
    sign,
    recover,
}
