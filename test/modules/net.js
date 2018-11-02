import { assert } from 'chai'
import LemoClient from '../../lib/index'

describe('getPeerCount', () => {
    it('getPeerCount', async () => {
        const lemo = new LemoClient()
        const result = await lemo.net.getPeerCount()
        assert.equal(result, [])
    })
})

describe('getInfo', () => {
    it('getInfo', async () => {
        const lemo = new LemoClient()
        const result = await lemo.net.getInfo()
        assert.deepEqual(result, {
            nodeName: 'Glemo/v0.1.0-beta/windows-amd64/go1.9.2',
            nodeVersion: '0.1.0-beta',
            port: ':7001'
        })
    })
})