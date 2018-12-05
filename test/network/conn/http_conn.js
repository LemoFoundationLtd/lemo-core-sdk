import {assert} from 'chai';
import HttpConn from '../../../lib/network/conn/http_conn'
import errors from '../../../lib/errors';

describe('HttpConn_new', () => {
    it('empty host', () => {
        assert.throws(() => {
            new HttpConn()
        }, errors.InvalidHTTPHost())
    });
    it('default conn', () => {
        const host = 'http://127.0.0.1:8001'
        const conn = new HttpConn(host)
        assert.strictEqual(conn.host, host);
        assert.strictEqual(conn.timeout, 0);
        assert.strictEqual(typeof conn.axiosInstance, 'function');
        assert.strictEqual(conn.axiosInstance.defaults.baseURL, host);
        assert.strictEqual(conn.axiosInstance.defaults.timeout, 0);
        assert.strictEqual(conn.axiosInstance.defaults.headers['Content-Type'], 'application/json');
        assert.strictEqual(conn.axiosInstance.defaults.auth, undefined);
    });
});
