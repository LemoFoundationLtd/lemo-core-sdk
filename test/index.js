import {assert} from 'chai'
import LemoClient from '../lib/index'
import HttpConn from '../lib/network/conn/http_conn'
import errors from '../lib/errors'

describe('LemoClient_new', () => {
    it('no config', () => {
        const lemo = new LemoClient()
        assert.equal(lemo._requester.conn instanceof HttpConn, true)
        assert.equal(lemo.config.chainID, 1)
        assert.deepEqual(lemo.config.conn, {
            send: undefined,
            host: 'http://127.0.0.1:8001',
            timeout: undefined,
            username: undefined,
            password: undefined,
            headers: undefined,
        })
        assert.deepEqual(lemo.config.requester, {
            pollDuration: 3000,
            maxPollRetry: 5,
        })
        assert.equal(lemo.config.httpTimeOut, 120000)
    })
    it('full config', () => {
        const config = {
            chainID: 1,
            host: 'http://127.0.0.1:8002',
            timeout: 100,
            username: 'a',
            password: 'b',
            headers: {c: 'd'},
            pollDuration: 10,
            maxPollRetry: 10,
            httpTimeOut: 1000,
        }
        const lemo = new LemoClient(config)
        assert.equal(lemo.config.chainID, config.chainID)
        assert.deepEqual(lemo.config.conn, {
            send: undefined,
            host: config.host,
            timeout: config.timeout,
            username: config.username,
            password: config.password,
            headers: config.headers,
        })
        assert.deepEqual(lemo.config.requester, {
            pollDuration: config.pollDuration,
            maxPollRetry: config.maxPollRetry,
        })
        assert.equal(lemo.config.httpTimeOut, config.httpTimeOut)
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
    it('custom conn', async () => {
        let sendRecord = null
        const conn = {
            send(...args) {
                sendRecord = args
                return {jsonrpc: '2.0', id: 1, result: {}}
            },
        }

        const lemo = new LemoClient(conn)
        assert.equal(lemo._requester.conn.send, conn.send)
        await lemo.getNewestBlock()
        assert.deepEqual(sendRecord, [
            {
                jsonrpc: '2.0',
                id: 1,
                method: 'chain_currentBlock',
                params: [false],
            },
        ])
    })
    it('conn.host no http ip', () => {
        const lemo = new LemoClient({host: '127.0.0.1:8001'})
        assert.equal(lemo._requester.conn instanceof HttpConn, true)
        assert.equal(lemo._requester.conn.host, 'http://127.0.0.1:8001')
    })
    it('conn.host no http domain', () => {
        const lemo = new LemoClient({host: 'lemochain.com'})
        assert.equal(lemo._requester.conn instanceof HttpConn, true)
        assert.equal(lemo._requester.conn.host, 'http://lemochain.com')
    })
    it('hide property', () => {
        const hideProperties = ['_requester', '_blockWatcher', '_txWatcher', '_createAPI', '_parser']
        hideProperties.forEach(property => {
            const lemo = new LemoClient()
            assert.exists(lemo[property], `property = ${property}`)
            // eslint-disable-next-line guard-for-in
            Object.keys(lemo).forEach(key => {
                assert.notEqual(key, property)
            })
        })
    })
})

describe('LemoClient_createAPI', () => {
    const testConn = {
        send: () => {},
    }

    it('lemo.test.setData', () => {
        const lemo = new LemoClient(testConn)
        lemo._createAPI('test', 'setData', 'api_name')
        assert.isFunction(lemo.test.setData)
    })

    it('2 apis without module name', async () => {
        const lemo = new LemoClient(testConn)
        lemo._createAPI('', 'setData', 'api_name')
        lemo._createAPI('', 'setData2', () => 1)
        assert.isFunction(lemo.setData)
        assert.isFunction(lemo.setData2)
    })

    it('incorrect method name', async () => {
        const lemo = new LemoClient(testConn)
        assert.throws(() => {
            lemo._createAPI('stopWatch', 'setData')
        }, errors.InvalidAPIName(undefined))
    })

    it('moduleName is unavailable', async () => {
        const lemo = new LemoClient(testConn)
        assert.throws(() => {
            lemo._createAPI('stopWatch', 'setData', 'api_name')
        }, errors.UnavailableAPIModule('stopWatch'))
    })

    it('moduleName is unavailable', async () => {
        const lemo = new LemoClient(testConn)
        assert.throws(() => {
            lemo._createAPI('stopWatch', 'setData', 'api_name')
        }, errors.UnavailableAPIModule('stopWatch'))
    })

    it('test remote method name and params', () => {
        const methodName = 'chain_getData'
        const params = 'abc'
        const conn = {
            send: payload => {
                assert.equal(payload.method, methodName)
                assert.isArray(payload.params)
                assert.equal(payload.params.length, 1)
                assert.equal(payload.params[0], params)
                return {jsonrpc: '2.0', id: 1, result: {}}
            },
        }
        const lemo = new LemoClient(conn)
        lemo._createAPI('', 'setData2', methodName)
        return lemo.setData2(params)
    })

    it('custom function', () => {
        const testParam = 'abc'
        const lemo = new LemoClient(testConn)
        // eslint-disable-next-line func-names
        lemo._createAPI('', 'setData2', function(param) {
            assert.exists(this.requester)
            assert.equal(param, testParam)
        })
        lemo.setData2(testParam)
    })
})
