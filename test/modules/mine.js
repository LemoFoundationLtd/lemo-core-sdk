import {assert} from 'chai'
import LemoClient from '../../lib/index'
import '../mock'

describe('module_mine_getMining', () => {
    it('getMining', async () => {
        const lemo = new LemoClient()
        const result = await lemo.mine.getMining()
        assert.equal(typeof result, 'boolean')
    })
})

describe('module_mine_getMiner', () => {
    it('getMiner', async () => {
        const lemo = new LemoClient()
        const result = await lemo.mine.getMiner()
        assert.equal(result, 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG')
    })
})
