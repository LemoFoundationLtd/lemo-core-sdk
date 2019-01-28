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
        }, errors.invalidConnConfig(config))
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
        await lemo.getCurrentBlock()
        assert.deepEqual(sendRecord, [
            {
                jsonrpc: '2.0',
                id: 1,
                method: 'chain_latestStableBlock',
                params: [false],
            },
        ])
    })
    it('hide property', () => {
        const hideProperties = ['_requester', '_createAPI', '_signer']
        hideProperties.forEach(property => {
            const lemo = new LemoClient()
            assert.exists(lemo._requester)
            // eslint-disable-next-line guard-for-in
            Object.keys(lemo).forEach(key => {
                assert.notEqual(key, property)
            })
        })
    })
})

describe('LemoClient__createAPI', () => {
    const testConn = {
        send: () => {
        },
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
})
