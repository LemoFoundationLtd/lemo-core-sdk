import {assert} from 'chai'
import TxWatcher from '../../lib/watchers/tx_watcher'
import {DEFAULT_POLL_DURATION} from '../../lib/config'
import Requester from '../../lib/network/requester'

describe('Requester_tx_watcher', () => {
    it('tx_watcher',  async function itFunc(done) {
        this.timeout(DEFAULT_POLL_DURATION + 1000)
        const responses = new Array(3).fill({jsonrpc: '2.0', id: 1, result: 'hash'})
        const hash = '0xfc4e1eccdc7e199336503ae67da0ee66eb46e1f953f65f22c8b62b53db76a103'
        let times = 0
        const conn = {
            async send() {
                if (responses.length === 1) {
                    assert.equal(times, 2)
                    requester.stopWatch()
                    done()
                    return responses.pop()
                }
                times++
                return responses.pop()
            },
        }
        const requester = new Requester(conn, {maxPollRetry: 0})
        const txWatcher = new TxWatcher(requester)
        txWatcher.pollTxHash(hash).then(txhash => {
            assert.equal(txhash, hash)
        })
        txWatcher.pollTxHash(hash).then(txhash => {
            assert.equal(txhash, hash)
        })
        txWatcher.pollTxHash(hash).then(txhash => {
            assert.equal(txhash, hash)
        })
    })
})
