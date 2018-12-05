import {assert} from 'chai'
import {resetRPC} from '../../lib/network/jsonrpc'
import {currentBlock} from '../datas'
import {wait} from '../../lib/utils'
import {POLL_DURATION} from '../../lib/config';
import Requester from '../../lib/network/requester';
import errors from '../../lib/errors';
import HttpConn from '../../lib/network/conn/http_conn';
import '../mock'

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
        const result = await requester.send('chain_latestStableBlock', [true])
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
        this.timeout(POLL_DURATION + 1000)

        const requester = new Requester(conn)
        requester.watch('m', ['p'], (result) => {
            try {
                assert.equal(result, response.result)
                done()
            } catch (e) {
                done(e)
            }
            requester.stopWatch()
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
