import {assert} from 'chai'
import LemoCore from '../lib/index'
import HttpConn from '../lib/network/conn/http_conn'
import errors from '../lib/errors'

describe('LemoCore_static', () => {
    const props = ['SDK_VERSION', 'BigNumber', 'TxType', 'ChangeLogType']
    const lemo = new LemoCore()
    props.forEach(prop => {
        it(prop, () => {
            assert.exists(LemoCore[prop])
            assert.exists(lemo[prop])
        })
    })
})

describe('LemoCore_new', () => {
    it('no config', () => {
        const lemo = new LemoCore()
        assert.strictEqual(lemo.requester.conn instanceof HttpConn, true)
        assert.strictEqual(lemo.config.chainID, 1)
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
        assert.strictEqual(lemo.config.httpTimeOut, 120000)
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
        const lemo = new LemoCore(config)
        assert.strictEqual(lemo.config.chainID, config.chainID)
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
        assert.strictEqual(lemo.config.httpTimeOut, config.httpTimeOut)
    })
    it('http conn', () => {
        const lemo = new LemoCore({host: 'http://127.0.0.1:8002'})
        assert.strictEqual(lemo.requester.conn instanceof HttpConn, true)
        assert.strictEqual(lemo.requester.conn.host, 'http://127.0.0.1:8002')
    })
    it('http conn localhost', () => {
        const lemo = new LemoCore({host: 'http://localhost:8002'})
        assert.strictEqual(lemo.requester.conn.host, 'http://localhost:8002')
    })
    it('custom conn', async () => {
        let sendRecord = null
        const conn = {
            send(...args) {
                sendRecord = args
                return {jsonrpc: '2.0', id: 1, result: {}}
            },
        }

        const lemo = new LemoCore(conn)
        assert.strictEqual(lemo.requester.conn.send, conn.send)
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
        const lemo = new LemoCore({host: '127.0.0.1:8001'})
        assert.strictEqual(lemo.requester.conn instanceof HttpConn, true)
        assert.strictEqual(lemo.requester.conn.host, 'http://127.0.0.1:8001')
    })
    it('conn.host no http domain', () => {
        const lemo = new LemoCore({host: 'lemochain.com'})
        assert.strictEqual(lemo.requester.conn instanceof HttpConn, true)
        assert.strictEqual(lemo.requester.conn.host, 'http://lemochain.com')
    })
    it('hide property', () => {
        const hideProperties = ['requester', 'blockWatcher', 'txWatcher', 'createAPI', 'parser']
        hideProperties.forEach(property => {
            const lemo = new LemoCore()
            assert.exists(lemo[property], `property = ${property}`)
            // eslint-disable-next-line guard-for-in
            Object.keys(lemo).forEach(key => {
                assert.notEqual(key, property)
            })
        })
    })
})

describe('LemoCore_createAPI', () => {
    const testConn = {
        send: () => {
        },
    }

    it('lemo.test.setData', () => {
        const lemo = new LemoCore(testConn)
        lemo.createAPI('test', 'setData', 'api_name')
        assert.isFunction(lemo.test.setData)
    })

    it('2 apis without module name', async () => {
        const lemo = new LemoCore(testConn)
        lemo.createAPI('', 'setData', 'api_name')
        lemo.createAPI('', 'setData2', () => 1)
        assert.isFunction(lemo.setData)
        assert.isFunction(lemo.setData2)
    })

    it('incorrect method name', async () => {
        const lemo = new LemoCore(testConn)
        assert.throws(() => {
            lemo.createAPI('stopWatch', 'setData')
        }, errors.InvalidAPIName(undefined))
    })

    it('moduleName is unavailable', async () => {
        const lemo = new LemoCore(testConn)
        assert.throws(() => {
            lemo.createAPI('stopWatch', 'setData', 'api_name')
        }, errors.UnavailableAPIModule('stopWatch'))
    })

    it('moduleName is unavailable', async () => {
        const lemo = new LemoCore(testConn)
        assert.throws(() => {
            lemo.createAPI('stopWatch', 'setData', 'api_name')
        }, errors.UnavailableAPIModule('stopWatch'))
    })

    it('test remote method name and params', () => {
        const methodName = 'chain_getData'
        const params = 'abc'
        const conn = {
            send: payload => {
                assert.strictEqual(payload.method, methodName)
                assert.isArray(payload.params)
                assert.strictEqual(payload.params.length, 1)
                assert.strictEqual(payload.params[0], params)
                return {jsonrpc: '2.0', id: 1, result: {}}
            },
        }
        const lemo = new LemoCore(conn)
        lemo.createAPI('', 'setData2', methodName)
        return lemo.setData2(params)
    })

    it('custom function', () => {
        const testParam = 'abc'
        const lemo = new LemoCore(testConn)
        // eslint-disable-next-line func-names
        lemo.createAPI('', 'setData2', function(param) {
            assert.exists(this.requester)
            assert.strictEqual(param, testParam)
        })
        lemo.setData2(testParam)
    })
})
