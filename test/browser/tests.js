
const assert = chai.should()

describe('module_account_newKeyPair', () => {
    it('newKeyPair', () => {
        const lemo = new LemoClient()
        const account = lemo.account.newKeyPair()
        assert.exists(account.privateKey)
        assert.exists(account.address)
    })
})

describe('123', () => {
    it('123456', () => {

    })
})

