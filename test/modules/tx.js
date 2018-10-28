import {assert} from 'chai'
import nock from 'nock'
import BigNumber from 'bignumber.js'
import {DEFAULT_HTTP_HOST} from '../../lib/config'
import LemoClient from '../../lib/main'
import Tx from '../../lib/tx'


describe('module_tx_sendTx', () => {
    beforeEach(() => {
        // nock(DEFAULT_HTTP_HOST)
        //     // .log(console.log)
        //     .post('/', {jsonrpc: '2.0', id: /\d+/, method: 'account_getAccount', params: [/.*/]})
        //     .reply((uri, requestBody) => {
        //         const result = (requestBody.params[0] === lemoBase.address) ? lemoBase : emptyAccount
        //         result.address = requestBody.params[0]
        //         return [200, {
        //             jsonrpc: '2.0',
        //             id: 123,
        //             result,
        //         }]
        //     })
        // .post('/', {jsonrpc: '2.0', id: /\d+/, method: 'account_getBalance', params: [/.*/]})
        // .reply(200, {
        //     jsonrpc: '2.0',R
        //     id: 123,
        //     result: '10000001000000000000000000',
        // })
    })

    it('sign', async () => {
        const lemo = new LemoClient()
        const result = lemo.tx.sign({
            to: '0x1',
            amount: 1,
            gasLimit: 100,
            gasPrice: 2,
            data: 12,
            chainId: 200,
            expirationTime: 1544584596,
            toName: 'aa',
            message: 34,
        }, '0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb')
        assert.equal(result, '0xf8689400000000000000000000000000000000000000018261610264010c845c107d9422830300c8a0158b80d695e7d543ddb3ae09ed89b0fdd0c9f72b95a96e5f2b5e67a4d6d71a88a02b893b663e36f997df1e3f489b98d001cf615ee1e32b3c28ce6364f5cc681d5c')
    })
})
