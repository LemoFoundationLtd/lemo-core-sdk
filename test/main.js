import {assert} from 'chai'
import LemoClient from '../lib/main'
import HttpConn from '../lib/network/conn/http_conn'
import errors from '../lib/errors'

describe('LemoClient_new', () => {
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
        }, errors.invalidConnConfig(config))
    })
    it('custom conn', async () => {
        let sendRecord = null
        const conn = {
            send(...args) {
                sendRecord = args
                return {jsonrpc: '2.0', id: 1, result: {}}
            }
        }

        const lemo = new LemoClient(conn)
        assert.equal(lemo._requester.conn, conn)
        await lemo.getCurrentBlock()
        assert.deepEqual(sendRecord, [{
            'jsonrpc': '2.0',
            'id': 1,
            'method': 'chain_latestStableBlock',
            'params': [undefined]
        }])
    })
})

describe('LemoClient__createAPI', () => {
    const testConn = {
        send: () => {
        }
    }

    it('lemo.test.setData', () => {
        const lemo = new LemoClient(testConn)
        lemo._createAPI('test', [{
            name: 'setData',
            method: 'api_name',
        }])
        assert.isFunction(lemo.test.setData)
    })

    it('2 apis without module name', async () => {
        const lemo = new LemoClient(testConn)
        lemo._createAPI('', [{
            name: 'setData',
            method: 'api_name',
        }, {
            name: 'setData2',
            method: 'api_name2',
        }])
        assert.isFunction(lemo.setData)
        assert.isFunction(lemo.setData2)
    })

    it('0 api', async () => {
        const lemo = new LemoClient(testConn)
        lemo._createAPI('aaa', [])
        assert.exists(lemo.aaa)
    })

    it('moduleName is unavailable', async () => {
        const lemo = new LemoClient(testConn)
        assert.throws(() => {
            lemo._createAPI('stopWatch', [{
                name: 'setData',
                method: 'api_name',
            }])
        }, errors.UnavailableAPIModule('stopWatch'))
    })
})
