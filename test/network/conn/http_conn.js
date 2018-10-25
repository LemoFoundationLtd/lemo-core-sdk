import {assert} from 'chai';
import HttpConn from '../../../lib/network/conn/http_conn'
import {DEFAULT_HTTP_HOST} from '../../../lib/config'

describe('HttpConn_new', function() {
    it('default conn', function() {
        const conn = new HttpConn()
        assert.strictEqual(conn.host, DEFAULT_HTTP_HOST);
        assert.strictEqual(conn.timeout, 0);
        assert.strictEqual(typeof conn.axiosInstance, 'function');
        assert.strictEqual(conn.axiosInstance.defaults.baseURL, DEFAULT_HTTP_HOST);
        assert.strictEqual(conn.axiosInstance.defaults.timeout, 0);
        assert.strictEqual(conn.axiosInstance.defaults.headers['Content-Type'], 'application/json');
        assert.strictEqual(conn.axiosInstance.defaults.auth, undefined);
    });
});
