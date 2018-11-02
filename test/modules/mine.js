import { assert } from 'chai'
import LemoClient from '../../lib/index'

describe('getMining', () => {
    it('getMining', async () => {
        const lemo = new LemoClient()
        const result = await lemo.mine.getMining()
        assert.equal(typeof result, 'boolean')
    })
})

describe('getLemoBase', () => {
    it('getLemoBase', async () => {
        const lemo = new LemoClient()
        const result = await lemo.mine.getLemoBase()
        assert.equal(result, 'Lemo888888888888888888888888888888888888')
    })
})