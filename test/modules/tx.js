import {assert} from 'chai'
import LemoTx from 'lemo-tx'
import LemoCore from '../../lib/index'
import {resetRPC} from '../../lib/network/jsonrpc'
import {block1, emptyTxInfo, txInfos, chainID, testPrivate, txInfo, tx4, testAddr} from '../datas'
import '../mock'
import {DEFAULT_POLL_DURATION} from '../../lib/const'
import errors from '../../lib/errors'

describe('module_tx_send', () => {
    it('sign and send', async () => {
        const lemo = new LemoCore({chainID})
        const txConfig = {
            from: testAddr,
            chainID,
        }
        const tx = new LemoTx(txConfig)
        tx.signWith(testPrivate)
        const nowHash = tx.hash()
        const result = LemoTx.sign(testPrivate, tx)
        const sendHash = await lemo.tx.send(JSON.parse(result), testPrivate)
        assert.strictEqual(sendHash, nowHash)
    })
    it('send a string txConfig', async () => {
        const lemo = new LemoCore({chainID})
        const txConfig = {
            from: testAddr,
            chainID,
        }
        const tx = new LemoTx(txConfig)
        tx.signWith(testPrivate)
        const nowHash = tx.hash()
        const result = LemoTx.sign(testPrivate, tx)
        const sendHash = await lemo.tx.send(result, testPrivate)
        assert.strictEqual(sendHash, nowHash)
    })
    it('send a signed tx', async () => {
        const lemo = new LemoCore({chainID})
        const txConfig = {
            from: testAddr,
            chainID,
        }
        const tx = new LemoTx(txConfig)
        tx.signWith(testPrivate)
        const sendHash = await lemo.tx.send(tx)
        const result = LemoTx.sign(testPrivate, tx)
        const resultHash = await lemo.tx.send(result, testPrivate)
        assert.strictEqual(resultHash, sendHash)
    })
    it('send a unsigned tx', async () => {
        const lemo = new LemoCore({chainID})
        const time = Math.floor(Date.now() / 1000) + 30 * 60
        const txConfig = {
            ...txInfo.txConfig,
            expirationTime: time,
        }
        const tx = new LemoTx(txConfig)
        try {
            await lemo.tx.send(tx)
        } catch (e) {
            assert.strictEqual(e.message, errors.InvalidTxSigs())
            return
        }
        assert.fail(undefined, errors.InvalidTxSigs())
    })
    it('send a timeOut tx', async () => {
        const lemo = new LemoCore({chainID})
        const tx = new LemoTx(txInfo.txConfig)
        try {
            await lemo.tx.send(tx)
        } catch (e) {
            assert.strictEqual(e.message, errors.InvalidTxTimeOut())
            return
        }
        assert.fail(undefined, errors.InvalidTxTimeOut())
    })
})

describe('module_tx_waitConfirm', () => {
    beforeEach(() => {
        resetRPC()
    })
    it('waitConfirm_narmal', async () => {
        const time = Math.floor(Date.now() / 1000) + (30 * 60)
        const txConfig = {
            ...txInfo.txConfig,
            expirationTime: time,
        }
        const lemo = new LemoCore({
            chainID,
        })
        const lemo1 = new LemoCore({
            chainID,
            send: () => {
                return {jsonrpc: '2.0', id: 1, result: txInfo.txConfig}
            },
        })
        const txHash = await lemo.tx.send(txConfig, testPrivate)
        const result = await lemo1.tx.waitConfirm(txHash)
        assert.strictEqual(result.data, txInfo.txConfig.data)
    })
    it('waitConfirm_has_serverMode_one_time', async () => {
        const time = Math.floor(Date.now() / 1000) + (30 * 60)
        const nowTime = Math.floor(Date.now() / 1000)
        // Restructure, change the transaction expirationTime
        const txConfig = {
            ...block1.transactions[0],
            chainID,
            expirationTime: time,
        }
        // new a LemoCore
        const lemo = new LemoCore({
            chainID,
        })
        // Send real-time trading
        const txHash = await lemo.tx.send(txConfig, testPrivate)
        // Change block timestamp
        const blockData = {
            ...block1,
            transactions: [{
                ...block1.transactions[0],
                hash: txHash,
            }],
            header: {
                timestamp: nowTime,
            },
        }
        // New lemoCore with serverMode to verify waitTxByWatchBlock
        const lemo1 = new LemoCore({
            chainID,
            serverMode: true,
            send: (value) => {
                if (value.id === 2) {
                    return {jsonrpc: '2.0', id: 2, result: blockData}
                } else {
                    return {jsonrpc: '2.0', id: 3, result: txConfig}
                }
            },
        })
        const result = await lemo1.tx.waitConfirm(txHash, txConfig.expirationTime)
        assert.strictEqual(result.hash, txHash)
    })
    it('waitConfirm_has_serverMode_two_time', async () => {
        const time = Math.floor(Date.now() / 1000) + (30 * 60)
        const nowTime = Math.floor(Date.now() / 1000)
        // Restructure, change the transaction expirationTime
        const txConfig = {
            ...block1.transactions[0],
            chainID,
            expirationTime: time,
        }
        // new a LemoCore
        const lemo = new LemoCore({chainID})
        // Send real-time trading
        const txHash = await lemo.tx.send(txConfig, testPrivate)
        // Change block timestamp
        const blockData = {
            ...block1,
            header: {
                timestamp: nowTime,
            },
            transactions: [{
                ...block1.transactions[0],
            }],
        }
        // New lemoCore with serverMode to verify waitTxByWatchBlock
        const lemo1 = new LemoCore({
            chainID,
            serverMode: true,
            send: (value) => {
                if (value.id === 2) {
                    return {jsonrpc: '2.0', id: 2, result: blockData}
                } else {
                    return {jsonrpc: '2.0', id: 3, result: txConfig}
                }
            },
        })
        const result = await lemo1.tx.waitConfirm(txHash, txConfig.expirationTime)
        assert.strictEqual(result.hash, txConfig.hash)
    })
    it('waitConfirm_has_serverMode_timeOut', async () => {
        const time = Math.floor(Date.now() / 1000)
        const nowTime = Math.floor(Date.now() / 1000) + (30 * 60)
        // Restructure, change the transaction expirationTime
        const txConfig = {
            ...block1.transactions[0],
            chainID,
            expirationTime: time,
        }
        // new a LemoCore
        const lemo = new LemoCore({
            chainID,
        })
        // Send real-time trading
        const txHash = await lemo.tx.send(txConfig, testPrivate)
        // Change block timestamp
        const blockData = {
            ...block1,
            header: {
                timestamp: nowTime,
            },
            transactions: [{
                ...block1.transactions[0],
            }],
        }
        // New lemoCore with serverMode to verify waitTxByWatchBlock
        const lemo1 = new LemoCore({
            chainID,
            serverMode: true,
            send: (value) => {
                if (value.id === 2) {
                    return {jsonrpc: '2.0', id: 2, result: blockData}
                } else {
                    return {jsonrpc: '2.0', id: 3, result: null}
                }
            },
        })
        const expectedErr = errors.InvalidTxTimeOut()
        return lemo1.tx.waitConfirm(txHash, txConfig.expirationTime).then(() => {
            throw new Error(`expected error: ${expectedErr}`)
        }, e => {
            if (e.message !== expectedErr) {
                throw new Error(`expected error: ${expectedErr}`)
            }
        })
    })
    it('waitConfirm_timeOut', async () => {
        const lemo = new LemoCore({chainID, httpTimeOut: 1000})
        tx4.expirationTime = Math.floor(new Date() / 1000) + (30 * 60)
        const txHash = await lemo.tx.send(tx4, testPrivate)
        const expectedErr = errors.InvalidPollTxTimeOut()
        return lemo.tx.waitConfirm(txHash).then(() => {
            assert.fail('success', `throw error: ${expectedErr}`)
        }, e => {
            return assert.strictEqual(e.message, expectedErr)
        })
    })
    it('waitConfirm_has_expirationTime', async () => {
        const time = Math.floor(new Date() / 1000) + (30 * 60)
        const txConfig = {
            ...txInfo.txConfig,
            expirationTime: time,
        }
        const lemo = new LemoCore({
            chainID,
        })
        const lemo1 = new LemoCore({
            chainID,
            send: () => {
                return {jsonrpc: '2.0', id: 1, result: txInfo.txConfig}
            },
        })
        const txHash = await lemo.tx.send(txConfig, testPrivate)
        const result = await lemo1.tx.waitConfirm(txHash)
        assert.strictEqual(result.data, txInfo.txConfig.data)
    })
})

describe('module_tx_watchTx', () => {
    it('watchTx', function itFunc(done) {
        this.timeout(DEFAULT_POLL_DURATION + 1000)
        const lemo = new LemoCore({chainID})
        const testConfig = {
            type: 0,
            version: 1,
            to: 'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY',
            toName: 'aa',
            message: 'aaa',
        }
        const watchTxId = lemo.tx.watchTx(testConfig, () => {
            lemo.tx.stopWatchTx(watchTxId)
            done()
        })
    })
})
