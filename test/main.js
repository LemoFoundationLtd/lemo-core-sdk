import {assert} from 'chai';
import LemoClient from '../lib/main'
import HttpConn from '../lib/conn/http_conn'

function createTestConn() {
    let sendRecord = null
    const conn = {
        send(...args) {
            sendRecord = JSON.stringify(args)
            return {jsonrpc: '2.0', id: 1, result: {}}
        }
    }
    return [conn, () => sendRecord]
}

describe('LemoClient_new', function() {
    it('default conn', function() {
        const lemo = new LemoClient()
        assert.equal(lemo._requester.conn instanceof HttpConn, true);
    });
    it('http conn', function() {
        const lemo = new LemoClient({host: 'http://127.0.0.1:8002'})
        assert.equal(lemo._requester.conn instanceof HttpConn, true);
        assert.equal(lemo._requester.conn.host, 'http://127.0.0.1:8002');
    });
    it('http conn localhost', function() {
        const lemo = new LemoClient({host: 'http://localhost:8002'})
        assert.equal(lemo._requester.conn.host, 'http://localhost:8002');
    });
    it('unknown conn', function() {
        const config = {host: 'abc'}
        assert.throws(() => {
            new LemoClient(config)
        }, `unknown conn config: ${config}`);
    });
    it('custom conn', function() {
        const [testConn, getRecord] = createTestConn()
        const lemo = new LemoClient(testConn)
        assert.equal(lemo._requester.conn, testConn);
        lemo.getCurrentBlock()
        assert.equal(getRecord(), JSON.stringify([{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "chain_latestStableBlock",
            "params": [null]
        }]));
    });
});

describe('LemoClient__createAPI', function() {
    it('aaa.bbb', function() {
        const [testConn, getRecord] = createTestConn()
        const lemo = new LemoClient(testConn)
        lemo._createAPI('aaa', [{
            name: 'bbb',
            method: 'ccc',
        }])
        lemo.aaa.bbb(123, '8293')
        assert.equal(getRecord(), JSON.stringify([{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "ccc",
            "params": [123, '8293']
        }]));
    });
});


async function test() {
    const lemo = new LemoClient()
    lemo.getCurrentBlock(true)
        .then(d => console.log(d))
    lemo.getNodeVersion()
        .then(d => console.log(d))

    const watchId = lemo.watchBlock(false, newBlock => console.log(newBlock))
    setTimeout(() => {
        lemo.stopWatch(watchId)
    }, 10000)
}
