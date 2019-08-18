import {assert} from 'chai'
import {resetRPC} from '../../lib/network/jsonrpc'
import {currentBlock} from '../datas'
import {DEFAULT_POLL_DURATION} from '../../lib/const';
import Requester from '../../lib/network/requester';
import errors from '../../lib/errors';
import HttpConn from '../../lib/network/conn/http_conn';
import '../mock'

/**
 * time out promise
 * @param {number} duration millisecond
 * @return {Promise}
 */
function wait(duration) {
    return new Promise(resolve => setTimeout(resolve, duration))
}

describe('Requester_new', () => {
    it('no conn', () => {
        assert.throws(() => {
            new Requester()
        }, errors.InvalidConn())
    })
    it('custom conn', async () => {
        const conn = new HttpConn('http://127.0.0.1:8001')
        const requester = new Requester(conn)
        assert.equal(requester.conn, conn)
    })
})

describe('Requester_send', () => {
    beforeEach(() => {
        resetRPC()
    })

    it('send with http conn', async () => {
        const conn = new HttpConn('http://127.0.0.1:8001')
        const requester = new Requester(conn)
        const result = await requester.send('chain_currentBlock', [true])
        assert.deepEqual(result, currentBlock)
    })
    it('send with custom conn', async () => {
        let sendRecord = null
        const conn = {
            send(...args) {
                sendRecord = args
                return {jsonrpc: '2.0', id: 1, result: {}}
            },
        }

        const requester = new Requester(conn)
        await requester.send('m', ['p'])
        assert.deepEqual(sendRecord, [
            {
                jsonrpc: '2.0',
                id: 1,
                method: 'm',
                params: ['p'],
            },
        ])
    })
})

describe('Requester_watch_stopWatch_isWatching', () => {
    beforeEach(() => {
        resetRPC()
    })

    const response = {jsonrpc: '2.0', id: 1, result: 123}
    const conn = {
        async send() {
            await wait(10)
            return response
        },
    }

    it('suddenly stopped error', () => {
        const error = new Error('Current process error')
        const errorConn = {
            async send() {
                await wait(10)
                throw error
            },
        }
        const requester = new Requester(errorConn, {maxPollRetry: 0})
        return new Promise((resolve, reject) => {
            const id = requester.watch('m', ['p'], () => {
                reject(error)
            })
            requester.stopWatch(id)
            assert.equal(requester.isWatching(), false)
            wait(20).then(resolve)
        })
    })
    it('suddenly stopped has response', () => {
        const error = new Error('Current process error')
        const requester = new Requester(conn, {maxPollRetry: 0})
        return new Promise((resolve, reject) => {
            const id = requester.watch('m', ['p'], () => {
                reject(error)
            })
            requester.stopWatch(id)
            assert.equal(requester.isWatching(), false)
            wait(20).then(resolve)
        })
    })
    it('stop immediately twice', () => {
        const requester = new Requester(conn)
        assert.equal(requester.isWatching(), false)
        let id = requester.watch('m', ['p'], () => {
        })
        assert.equal(requester.isWatching(), true)
        requester.stopWatch(id)
        assert.equal(requester.isWatching(), false)

        // try twice
        id = requester.watch('m', ['p'], () => {
        })
        assert.equal(requester.isWatching(), true)
        requester.stopWatch(id)
        assert.equal(requester.isWatching(), false)
    })
    it('stop all immediately', () => {
        const requester = new Requester(conn)
        assert.equal(requester.isWatching(), false)
        requester.watch('m', ['p'], () => {
        })
        assert.equal(requester.isWatching(), true)

        requester.watch('m', ['p'], () => {
        })
        assert.equal(requester.isWatching(), true)
        requester.stopWatch()
        assert.equal(requester.isWatching(), false)
    })
    it('stop after callback', function itFunc(done) {
        this.timeout(DEFAULT_POLL_DURATION + 1000)

        const requester = new Requester(conn)
        requester.watch('m', ['p'], (result) => {
            try {
                assert.equal(result, response.result)
                requester.stopWatch()
                done()
            } catch (e) {
                requester.stopWatch()
                done(e)
            }
        })
    })
    it('id++', () => {
        const requester = new Requester(conn)
        for (let i = 1; i < 4; i++) {
            const id = requester.watch('m', ['p'], () => {
            })
            assert.equal(id, i)
        }
        requester.stopWatch()
    })
})

describe('Requester_watch_error', () => {
    it('watch_error',  function itFunc(done) {
        this.timeout(DEFAULT_POLL_DURATION + 1000)
        const conn = new HttpConn('http://127.0.0.1:8001')
        const requester = new Requester(conn, {maxPollRetry: 0})
        const watchId = requester.watch('13', [true], (block, error) => {
            assert.equal(error.message, errors.InvalidConnection('http://127.0.0.1:8001'))
            requester.stopWatch(watchId)
            done()
        })
    })
})
