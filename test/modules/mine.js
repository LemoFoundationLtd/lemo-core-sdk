import {assert} from 'chai'
import LemoCore from '../../lib/index'
import '../mock'

describe('module_mine_getMining', () => {
    it('getMining', async () => {
        const lemo = new LemoCore()
        const result = await lemo.mine.getMining()
        assert.strictEqual(typeof result, 'boolean')
    })
})

describe('module_mine_getMiner', () => {
    it('getMiner', async () => {
        const lemo = new LemoCore()
        const result = await lemo.mine.getMiner()
        assert.strictEqual(result, 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG')
    })
})
