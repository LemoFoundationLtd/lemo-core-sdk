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
        assert.equal(result, '0x0000000000000000000000000000000000000000')
    })
})