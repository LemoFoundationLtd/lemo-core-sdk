import {assert} from 'chai'
import TxWatcher from '../../lib/watchers/tx_watcher'
import BlockWatcher from '../../lib/watchers/block_watcher'
import {DEFAULT_POLL_DURATION} from '../../lib/config'
import Requester from '../../lib/network/requester'
import HttpConn from '../../lib/network/conn/http_conn'
import errors from '../../lib/errors'
import {currentBlock, formattedCurrentBlock, txInfo, txRes2} from '../datas'
import '../mock'

describe('module_tx_watcher', () => {
    it('tx_watcher', function itFunc(done) {
        this.timeout(DEFAULT_POLL_DURATION + 1000)
        const responses = [{jsonrpc: '2.0', id: 1, result: null}, {jsonrpc: '2.0', id: 2, result: {hash: 'hash'}}]
        const testTx =  {hash: 'hash'}
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
        txWatcher.waitTx('hash').then(tx => {
            assert.deepEqual(tx, testTx)
            done()
        })
    })
    it('server_mode_true_has_tx', async () => {
        const requester = new Requester(new HttpConn('http://127.0.0.1:8001'))
        const blockWatcher = new BlockWatcher(requester)
        const txWatcher = new TxWatcher(requester, blockWatcher, true)
        const hash = currentBlock.transactions[0].hash
        const testTx = formattedCurrentBlock.transactions[0]
        const tx = await txWatcher.waitTx(hash)
        return  assert.deepEqual(tx, testTx)
    })
    it('server_mode_true_timeOut',  () => {
        const requester = new Requester(new HttpConn('http://127.0.0.1:8001'))
        const blockWatcher = new BlockWatcher(requester)
        const txWatcher = new TxWatcher(requester, blockWatcher, true)
        const hash = ''
        txWatcher.waitTx(hash).catch(e => {
            assert.equal(e, errors.InvalidPollTxTimeOut())
        })
    })
    it('server_mode_false_has_tx', async () => {
        const requester = new Requester(new HttpConn('http://127.0.0.1:8001'))
        const blockWatcher = new BlockWatcher(requester)
        const txWatcher = new TxWatcher(requester, blockWatcher, false)
        const tx = await txWatcher.waitTx(txInfo.hashAfterSign)
        return assert.deepEqual(tx, txRes2)
    })
    it('server_mode_false_timeOut',  () => {
        const requester = new Requester(new HttpConn('http://127.0.0.1:8001'))
        const blockWatcher = new BlockWatcher(requester)
        const txWatcher = new TxWatcher(requester, blockWatcher, false)
        const hash = ''
        txWatcher.waitTx(hash).catch(e => {
            assert.equal(e, errors.InvalidPollTxTimeOut())
        })
    })
})
