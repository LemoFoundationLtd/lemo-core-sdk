import nock from 'nock'
import Tx from '../lib/tx';
import { DEFAULT_HTTP_HOST } from '../lib/config'
import { lemoBase } from './datas'

const emptyAccount = {
    'balance': '0x0',
    'codeHash': '0x0000000000000000000000000000000000000000000000000000000000000000',
    'records': {},
    'root': '0x0000000000000000000000000000000000000000000000000000000000000000',
}

const mockInfos = [{
        method: 'account_getAccount',
        paramsCount: 1,
        reply(args) {
            const result = (args[0] === lemoBase.address) ? lemoBase : emptyAccount
            result.address = args[0]
            return result
        }
    },
    {
        method: 'tx_sendTx',
        paramsCount: 1,
        reply(args) {
            const tx = new Tx(args[0])
            return `0x${tx.hash().toString('hex')}`
        }
    },
]

function startMock() {
    nock(DEFAULT_HTTP_HOST)
        // .log(console.log)
        .post('/', (body) => {
            const mockInfo = mockInfos.find(info => info.method === body.method)
            return body.jsonrpc === '2.0' &&
                typeof body.id === 'number' &&
                Array.isArray(body.params) &&
                mockInfo &&
                body.params.length === mockInfo.paramsCount
        })
        .times(10000000000)
        .reply((uri, body) => {
            const mockInfo = mockInfos.find(info => info.method === body.method)
            const result = mockInfo.reply(body.params)
            return [200, {
                jsonrpc: '2.0',
                id: 123,
                result,
            }]
        })
}

// startMock()