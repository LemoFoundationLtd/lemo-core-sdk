import {assert} from 'chai'
import TxWatcher from '../../lib/watchers/tx_watcher'
import BlockWatcher from '../../lib/watchers/block_watcher'
import {DEFAULT_POLL_DURATION} from '../../lib/config'
import Requester from '../../lib/network/requester'
import HttpConn from '../../lib/network/conn/http_conn'
import errors from '../../lib/errors'
import '../mock'

describe('module_tx_watcher', () => {
    it('tx_watcher', function itFunc(done) {
        this.timeout(DEFAULT_POLL_DURATION + 1000)
        const responses = [{jsonrpc: '2.0', id: 1, result: null}, {jsonrpc: '2.0', id: 2, result: 'hash'}]
        const testTxHash = '0xfc4e1eccdc7e199336503ae67da0ee66eb46e1f953f65f22c8b62b53db76a103'
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
        const txWatcher = new TxWatcher(requester)
        txWatcher.waitTx(testTxHash).then(txHash => {
            assert.equal(txHash, testTxHash)
            done()
        })
    })
    it('server_mode_has_hash', async () => {
        const requester = new Requester(new HttpConn('http://127.0.0.1:8001'), {maxPollRetry: 0})
        const blockWatcher = new BlockWatcher(requester)
        const txWatcher = new TxWatcher(requester, blockWatcher, true)
        const hash = '0x314f1b9c8585e53446983e68fdbf6642e00e5b58cfde9165fdec051cfb21d157'
        const txHash = await txWatcher.waitTx(hash)
        return  assert.equal(hash, txHash)
    })
    it('server_mode_timeOut', async () => {
        const requester = new Requester(new HttpConn('http://127.0.0.1:8001'), {maxPollRetry: 0})
        const blockWatcher = new BlockWatcher(requester)
        const txWatcher = new TxWatcher(requester, blockWatcher, true)
        const hash = ''
        txWatcher.waitTx(hash).catch(e => {
            return assert.equal(e, errors.InvalidPollTxTimeOut())
        })
    })
})
