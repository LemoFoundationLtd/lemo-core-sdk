import {assert} from 'chai'
import LemoClient from '../../lib/main'

describe('account_getAccount', () => {
    it('correct address', async() => {
        const lemo = new LemoClient()
        const result = await lemo.account.getAccount("0x123")
        assert.deepEqual(result, {})
    })
})
