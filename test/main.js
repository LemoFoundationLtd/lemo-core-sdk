const LemoClient = require('..')


const testProvider = {
    send(...args) {
        console.log('test', ...args)
        return {
            jsonrpc: '2.0',
            id: 1,
            result: {},
        }
    }
}
const lemo = new LemoClient(LemoClient.newProvider({url: 'http://127.0.0.1:8001'}))
lemo.extend([
    LemoClient.newMethod({
        module: 'aaa',
        name: 'bbb',
        call: 'ccc',
    })
])


lemo.chain.test1()
lemo.aaa.bbb(123, '8293')
    .catch(e => console.error(e))

lemo.chain.getBlockByNumber(0)
    .then(d => console.log(d))
