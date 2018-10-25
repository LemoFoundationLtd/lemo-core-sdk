import {assert} from 'chai'
import LemoClient from '../lib/main'
import HttpConn from '../lib/network/conn/http_conn'
import {resetRPC} from '../lib/network/jsonrpc'

function createTestConn() {
    let sendRecord = null
    const conn = {
        send(...args) {
            sendRecord = args
            return {jsonrpc: '2.0', id: 1, result: {}}
        }
    }
    return [conn, () => sendRecord]
}

describe('LemoClient_new', () => {
    beforeEach(() => {
        resetRPC()
    })

    it('default conn', () => {
        const lemo = new LemoClient()
        assert.equal(lemo._requester.conn instanceof HttpConn, true)
    })
    it('http conn', () => {
        const lemo = new LemoClient({host: 'http://127.0.0.1:8002'})
        assert.equal(lemo._requester.conn instanceof HttpConn, true)
        assert.equal(lemo._requester.conn.host, 'http://127.0.0.1:8002')
    })
    it('http conn localhost', () => {
        const lemo = new LemoClient({host: 'http://localhost:8002'})
        assert.equal(lemo._requester.conn.host, 'http://localhost:8002')
    })
    it('unknown conn', () => {
        const config = {host: 'abc'}
        assert.throws(() => {
            new LemoClient(config)
        }, `unknown conn config: ${config}`)
    })
    it('custom conn', async () => {
        const [testConn, getRecord] = createTestConn()
        const lemo = new LemoClient(testConn)
        assert.equal(lemo._requester.conn, testConn)
        await lemo.getCurrentBlock()
        assert.deepEqual(getRecord(), [{
            'jsonrpc': '2.0',
            'id': 1,
            'method': 'chain_latestStableBlock',
            'params': [undefined]
        }])
    })
})

describe('LemoClient__createAPI', () => {
    beforeEach(() => {
        resetRPC()
    })

    it('lemo.test.setData', async () => {
        const [testConn, getRecord] = createTestConn()
        const lemo = new LemoClient(testConn)
        lemo._createAPI('test', [{
            name: 'setData',
            method: 'api_name',
        }])
        await lemo.test.setData(123, {a: '8293'})
        assert.deepEqual(getRecord(), [{
            'jsonrpc': '2.0',
            'id': 1,
            'method': 'api_name',
            'params': [123, {a: '8293'}]
        }])
    })

    it('no module name', async () => {
        const [testConn, getRecord] = createTestConn()
        const lemo = new LemoClient(testConn)
        lemo._createAPI('', [{
            name: 'setData',
            method: 'api_name',
        }])
        await lemo.setData(123)
        assert.deepEqual(getRecord(), [{
            'jsonrpc': '2.0',
            'id': 1,
            'method': 'api_name',
            'params': [123]
        }])
    })

    it('custom call', async () => {
        const [testConn] = createTestConn()
        const lemo = new LemoClient(testConn)
        lemo._createAPI('', [{
            name: 'callMyFunc',
            call: (requester, ...args) => {
                assert.equal(requester, lemo._requester)
                assert.deepEqual(args, [123, '8293'])
                return 100
            },
        }])
        const result = lemo.callMyFunc(123, '8293')
        assert.equal(result, 100)
    })

    it('custom async call', async () => {
        const [testConn] = createTestConn()
        const lemo = new LemoClient(testConn)
        lemo._createAPI('', [{
            name: 'callMyFunc',
            call: () => Promise.resolve(200),
        }])
        const result = await lemo.callMyFunc()
        assert.equal(result, 200)
    })
})
