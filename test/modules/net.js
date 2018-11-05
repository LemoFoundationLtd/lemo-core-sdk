import {assert} from 'chai'
import LemoClient from '../../lib/index'

describe('getPeersCount', () => {
    it('getPeersCount', async () => {
        const lemo = new LemoClient()
        const result = await lemo.net.getPeersCount()
        assert.strictEqual(result, 0)
    })
})

describe('getInfo', () => {
    it('getInfo', async () => {
        const lemo = new LemoClient()
        const result = await lemo.net.getInfo()
        assert.deepEqual(result, {
            goVersion: 'go1.9.2',
            nodeName: 'Lemo',
            nodeOS: 'windows-amd64',
            nodeVersion: '1.0.0',
            port: '7001'
        })
    })
})
