import {assert} from 'chai'
import BlockFetcher from '../../lib/watchers/block_fetcher'
import Requester from '../../lib/network/requester'

describe('BlockFetcher_new', () => {
    it('normal', () => {
        const blockFetcher = new BlockFetcher(null, null)
        assert.deepEqual(blockFetcher.fetchTasks, [])
        assert.equal(blockFetcher.runningToken.length > 0, true)
        blockFetcher.runningToken.forEach(item => {
            assert.equal(typeof item, 'object')
        })
    })
})

describe('BlockFetcher_addFetchTasks', () => {
    it('invalid params', () => {
        const blockFetcher = new BlockFetcher(null, () => {
            assert.fail('should not be called')
        })
        blockFetcher.addFetchTasks(1, 0, false)
    })
    it('add once without body', () => {
        const requester = makeMockRequestor(50)
        const expectHeights = [3, 4, 5, 6, 7]

        return new Promise((resolve) => {
            const blockFetcher = new BlockFetcher(requester, (block, err) => {
                if (err) {
                    assert.fail(err)
                } else {
                    console.log(new Date(), 'got block:', block.header.height)
                    assert.equal(block.header.height, expectHeights.shift())
                    if (!expectHeights.length) {
                        resolve()
                    }
                }
            })
            blockFetcher.addFetchTasks(3, 7, false)
        })
    })
    it('add twice with different withBody', () => {
        const requester = makeMockRequestor(50)
        const expectHeights = [3, 4, 5, 6, 7, 8]

        return new Promise((resolve) => {
            const blockFetcher = new BlockFetcher(requester, (block, err) => {
                if (err) {
                    assert.fail(err)
                } else {
                    console.log(new Date(), 'got block:', block.header.height)
                    assert.equal(block.header.height, expectHeights.shift())
                    if (block.header.height >= 5) {
                        assert.equal(Array.isArray(block.transactions), true)
                    } else {
                        assert.equal(block.transactions, undefined)
                    }
                    if (!expectHeights.length) {
                        resolve()
                    }
                }
            })
            blockFetcher.addFetchTasks(3, 7, false)
            blockFetcher.addFetchTasks(5, 8, true)
        })
    })
    it('add twice and second task is smaller', () => {
        const requester = makeMockRequestor(50)
        const expectHeights = [6, 7, 2, 3, 4, 5, 6, 7, 8]

        return new Promise((resolve) => {
            const blockFetcher = new BlockFetcher(requester, (block, err) => {
                if (err) {
                    assert.fail(err)
                } else {
                    console.log(new Date(), 'got block:', block.header.height)
                    assert.equal(block.header.height, expectHeights.shift())
                    if (!expectHeights.length) {
                        resolve()
                    }
                }
            })
            blockFetcher.addFetchTasks(6, 8, false)
            blockFetcher.addFetchTasks(2, 4, false)
        })
    })
    it('add again when token available ', () => {
        const requester = makeMockRequestor(50)
        const expectHeights = [6, 10, 11]

        return new Promise(async (resolve) => {
            const blockFetcher = new BlockFetcher(requester, (block, err) => {
                if (err) {
                    assert.fail(err)
                } else {
                    console.log(new Date(), 'got block:', block.header.height)
                    assert.equal(block.header.height, expectHeights.shift())
                    if (!expectHeights.length) {
                        resolve()
                    }
                }
            })
            blockFetcher.addFetchTasks(6, 6, false)
            blockFetcher.addFetchTasks(10, 11, false)
        })
    })
    it('add again when first finished ', () => {
        const requester = makeMockRequestor(50)
        const expectHeights = [6, 10]

        return new Promise(async (resolve) => {
            const blockFetcher = new BlockFetcher(requester, (block, err) => {
                if (err) {
                    assert.fail(err)
                } else {
                    console.log(new Date(), 'got block:', block.header.height)
                    assert.equal(block.header.height, expectHeights.shift())
                    if (!expectHeights.length) {
                        resolve()
                    }
                }
            })
            blockFetcher.addFetchTasks(6, 6, false)
            await wait(70)
            blockFetcher.addFetchTasks(10, 10, false)
        })
    })
})

function makeMockRequestor(fakeNetworkDelay) {
    const conn = {
        async send(payload) {
            console.log(new Date(), `send ${payload.method}(${payload.params})`)
            await wait(fakeNetworkDelay)
            switch (payload.method) {
                case 'chain_getBlockByHeight': {
                    const block = {header: {height: payload.params[0]}}
                    if (payload.params[1]) { // withBody
                        block.transactions = [{}]
                    }
                    return {
                        jsonrpc: '2.0',
                        id: 1,
                        result: block,
                    }
                }
                default:
                    throw new Error('not supported request')
            }
        },
    }
    return new Requester(conn)
}

function wait(duration) {
    return new Promise(resolve => setTimeout(resolve, duration))
}
