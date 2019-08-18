import {assert} from 'chai'
import TxWatcher from '../../lib/watchers/tx_watcher'
import BlockWatcher from '../../lib/watchers/block_watcher'
import {DEFAULT_POLL_DURATION} from '../../lib/const'
import Requester from '../../lib/network/requester'
import HttpConn from '../../lib/network/conn/http_conn'
import errors from '../../lib/errors'
import {formattedCurrentBlock, txInfo, txRes2} from '../datas'
import '../mock'

describe('module_tx_watcher', () => {
    it('tx_watcher', function itFunc(done) {
        this.timeout(DEFAULT_POLL_DURATION + 1000)
        const responses = [{jsonrpc: '2.0', id: 1, result: null}, {jsonrpc: '2.0', id: 2, result: {hash: 'hash'}}]
        const testTx = {hash: 'hash'}
        const error = new Error('waitTx too many times')
        const conn = {
            async send() {
                if (!responses.length) {
                    throw error
                }
                return responses.shift()
            },
        }
        const requester = new Requester(conn, {maxPollRetry: 0})
        const txWatcher = new TxWatcher(requester, undefined, {serverMode: false})
        txWatcher.waitTx('hash').then(tx => {
            assert.deepEqual(tx, testTx)
            done()
        })
    })
    it('server_mode_true_has_tx', async () => {
        const requester = new Requester(new HttpConn('http://127.0.0.1:8001'))
        const blockWatcher = new BlockWatcher(requester)
        const txWatcher = new TxWatcher(requester, blockWatcher, {serverMode: true, txPollTimeout: 1000})
        const hash = formattedCurrentBlock.transactions[0].hash
        const testTx = formattedCurrentBlock.transactions[0]
        const tx = await txWatcher.waitTx(hash)
        return assert.deepEqual(tx, testTx)
    })
    it('server_mode_true_timeOut', () => {
        const requester = new Requester(new HttpConn('http://127.0.0.1:8001'))
        const blockWatcher = new BlockWatcher(requester)
        const txWatcher = new TxWatcher(requester, blockWatcher, {serverMode: true, txPollTimeout: 1000})
        const hash = ''
        return txWatcher.waitTx(hash).then(() => {
            assert.fail(`expect error:${errors.InvalidPollTxTimeOut()}`)
        }, (e) => {
            assert.equal(e.message, errors.InvalidPollTxTimeOut())
        })
    })
    it('server_mode_false_has_tx', async () => {
        const requester = new Requester(new HttpConn('http://127.0.0.1:8001'))
        const blockWatcher = new BlockWatcher(requester)
        const txWatcher = new TxWatcher(requester, blockWatcher, {serverMode: false, txPollTimeout: 1000})
        const tx = await txWatcher.waitTx(txInfo.hashAfterSign)
        return assert.deepEqual(tx, txRes2)
    })
    it('server_mode_false_timeOut', () => {
        const requester = new Requester(new HttpConn('http://127.0.0.1:8001'))
        const blockWatcher = new BlockWatcher(requester)
        const txWatcher = new TxWatcher(requester, blockWatcher, {serverMode: false, txPollTimeout: 1000})
        const hash = ''
        return txWatcher.waitTx(hash).then(() => {
            assert.fail(`expect error:${errors.InvalidPollTxTimeOut()}`)
        }, (e) => {
            assert.equal(e.message, errors.InvalidPollTxTimeOut())
        })
    })
    it('server_mode_false_error', async () => {
        const hash = formattedCurrentBlock.transactions[0].hash
        const error = new Error('Cannot get the value of result')
        const conn = {
            async send() {
                throw error
            },
        }
        const requester = new Requester(conn, {maxPollRetry: 0})
        const txWatcher = new TxWatcher(requester, undefined, {serverMode: false, txPollTimeout: 1000})
        return txWatcher.waitTx(hash).then(() => {
            assert.fail('success', `throw error: ${error}`)
        }, e => {
            return assert.equal(e, error)
        })
    })
})

describe('module_tx_watcher_server_mode', () => {
    it('server_mode_true_has_tx', async () => {
        const requester = new Requester(new HttpConn('http://127.0.0.1:8001'))
        const blockWatcher = new BlockWatcher(requester)
        const txWatcher = new TxWatcher(requester, blockWatcher, {serverMode: true, txPollTimeout: 1000})
        const hash = formattedCurrentBlock.transactions[0].hash
        const testTx = formattedCurrentBlock.transactions[0]
        const tx = await txWatcher.waitTx(hash)
        return assert.deepEqual(tx, testTx)
    })
    it('server_mode_true_timeOut', () => {
        const requester = new Requester(new HttpConn('http://127.0.0.1:8001'))
        const blockWatcher = new BlockWatcher(requester)
        const txWatcher = new TxWatcher(requester, blockWatcher, {serverMode: true, txPollTimeout: 1000})
        const hash = ''
        return txWatcher.waitTx(hash).then(() => {
            assert.fail(`expect error:${errors.InvalidPollTxTimeOut()}`)
        }, (e) => {
            assert.equal(e.message, errors.InvalidPollTxTimeOut())
        })
    })
    it('server_mode_false_has_tx', async () => {
        const requester = new Requester(new HttpConn('http://127.0.0.1:8001'))
        const blockWatcher = new BlockWatcher(requester)
        const txWatcher = new TxWatcher(requester, blockWatcher, {serverMode: false, txPollTimeout: 1000})
        const tx = await txWatcher.waitTx(txInfo.hashAfterSign)
        return assert.deepEqual(tx, txRes2)
    })
    it('server_mode_false_timeOut', () => {
        const requester = new Requester(new HttpConn('http://127.0.0.1:8001'))
        const blockWatcher = new BlockWatcher(requester)
        const txWatcher = new TxWatcher(requester, blockWatcher, {serverMode: false, txPollTimeout: 1000})
        const hash = ''
        return txWatcher.waitTx(hash).then(() => {
            assert.fail(`expect error:${errors.InvalidPollTxTimeOut()}`)
        }, (e) => {
            assert.equal(e.message, errors.InvalidPollTxTimeOut())
        })
    })
})

describe('module_tx_watcher_watchTx', () => {
    it('watchTx_multiple_params', function itFunc(done) {
        this.timeout(DEFAULT_POLL_DURATION + 1000)
        const requester = new Requester(new HttpConn('http://127.0.0.1:8001'))
        const blockWatcher = new BlockWatcher(requester)
        const txWatcher = new TxWatcher(requester, blockWatcher, {serverMode: false, txPollTimeout: 1000})
        const testConfig = {
            type: 0,
            version: 1,
            to: 'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY',
            toName: 'aa',
            message: 'aaa',
        }
        const watchTxId = txWatcher.watchTx(testConfig, (txArr => {
            assert.equal(txArr.length, 1)
            assert.deepEqual(txArr[0], formattedCurrentBlock.transactions[0])
            txWatcher.stopWatchTx(watchTxId)
            done()
        }))
    })
    it('watchTx_one_param', function itFunc(done) {
        this.timeout(DEFAULT_POLL_DURATION + 1000)
        const requester = new Requester(new HttpConn('http://127.0.0.1:8001'))
        const blockWatcher = new BlockWatcher(requester)
        const txWatcher = new TxWatcher(requester, blockWatcher, {serverMode: false, txPollTimeout: 1000})
        const testConfig = {
            type: 0,
        }
        const watchTxId = txWatcher.watchTx(testConfig, (txArr => {
            assert.equal(txArr.length, 1)
            assert.deepEqual(txArr[0], formattedCurrentBlock.transactions[0])
            txWatcher.stopWatchTx(watchTxId)
            done()
        }))
    })
    it('watchTx_result_null', function itFunc(done) {
        this.timeout(DEFAULT_POLL_DURATION + 1000)
        const requester = new Requester(new HttpConn('http://127.0.0.1:8001'))
        const blockWatcher = new BlockWatcher(requester)
        const txWatcher = new TxWatcher(requester, blockWatcher, {serverMode: false, txPollTimeout: 1000})
        const testConfig = {
            type: 100,
        }
        const watchTxId = txWatcher.watchTx(testConfig, (() => {
            done(new Error('not expect to execute callback'))
        }))
        txWatcher.stopWatchTx(watchTxId)
        done()
    })
})

