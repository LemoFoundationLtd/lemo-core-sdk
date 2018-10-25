import nock from 'nock'

nock('http://127.0.0.1:8001')
    .log(console.log)
    .post('/', {jsonrpc: '2.0', id: /\d+/, method: 'account_getAccount', params: [/.*/]})
    .reply(function(uri, requestBody) {
        console.log('requestBody:', requestBody)
        return [200, 'success']
    })
// .reply(200, {
//     address: '0x123',
//     balance: 123
// })
