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


async function test() {
    const lemo = new LemoClient({host: 'http://127.0.0.1:8001'})
    lemo.createAPI('aaa', [{
        name: 'bbb',
        api: 'ccc',
    }])
    lemo.getCurrentBlock(true)
        .then(d => console.log(d))
    lemo.getNodeVersion()
        .then(d => console.log(d))
    lemo.aaa.bbb(123, '8293')
        .catch(e => console.error(e))

    const watchId = lemo.watchBlock(false, newBlock => console.log(newBlock))
    setTimeout(() => {
        lemo.stopWatch(watchId)
    }, 10000)
}

test()
