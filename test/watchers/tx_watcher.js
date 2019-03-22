import {assert} from 'chai'
import TxWatcher from '../../lib/watchers/tx_watcher'
import {DEFAULT_POLL_DURATION} from '../../lib/config'
import Requester from '../../lib/network/requester'

describe('module_tx_watcher', () => {
    it('tx_watcher',   function itFunc(done) {
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
})
