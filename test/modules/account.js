import {assert} from 'chai'
import nock from 'nock'
import BigNumber from 'bignumber.js'
import {DEFAULT_HTTP_HOST} from '../../lib/config'
import LemoClient from '../../lib/main'

const lemoBase = {
    'address': '0x015780f8456f9c1532645087a19dcf9a7e0c7f97',
    'balance': '0x52b7d2dcc80cd2e40000000',
    'codeHash': '0x0000000000000000000000000000000000000000000000000000000000000000',
    'records': {
        '1': {
            'Height': 1,
            'Version': 1,
        },
    },
    'root': '0x0000000000000000000000000000000000000000000000000000000000000000',
}
const emptyAccount = {
    'balance': '0x0',
    'codeHash': '0x0000000000000000000000000000000000000000000000000000000000000000',
    'records': {},
    'root': '0x0000000000000000000000000000000000000000000000000000000000000000',
}

describe('account_getAccount', () => {
    beforeEach(() => {
        nock(DEFAULT_HTTP_HOST)
            // .log(console.log)
            .post('/', {jsonrpc: '2.0', id: /\d+/, method: 'account_getAccount', params: [/.*/]})
            .reply((uri, requestBody) => {
                const result = (requestBody.params[0] === lemoBase.address) ? lemoBase : emptyAccount
                result.address = requestBody.params[0]
                return [200, {
                    jsonrpc: '2.0',
                    id: 123,
                    result,
                }]
            })
        // .post('/', {jsonrpc: '2.0', id: /\d+/, method: 'account_getBalance', params: [/.*/]})
        // .reply(200, {
        //     jsonrpc: '2.0',R
        //     id: 123,
        //     result: '10000001000000000000000000',
        // })
    })

    it('account with balance', async () => {
        const lemo = new LemoClient()
        const result = await lemo.account.getAccount(lemoBase.address)
        assert.deepEqual(result, {
            'address': lemoBase.address,
            'balance': new BigNumber('1600000000000000000000000000'),
            'codeHash': '0x0000000000000000000000000000000000000000000000000000000000000000',
            'records': {
                'BalanceLog': {
                    'Height': 1,
                    'Version': 1,
                },
            },
            'root': '0x0000000000000000000000000000000000000000000000000000000000000000',
        })
    })

    it('not exist account', async () => {
        const lemo = new LemoClient()
        const result = await lemo.account.getAccount('0x1234567890123456789012345678901234567890')
        assert.deepEqual(result, {
            'address': '0x1234567890123456789012345678901234567890',
            'balance': new BigNumber(0),
            'codeHash': '0x0000000000000000000000000000000000000000000000000000000000000000',
            'records': {},
            'root': '0x0000000000000000000000000000000000000000000000000000000000000000',
        })
    })
})
