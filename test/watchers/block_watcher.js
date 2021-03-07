import {assert} from 'chai'
import BlockWatcher from '../../lib/watchers/block_watcher'
import Requester from '../../lib/network/requester'
import {NO_LAST_HEIGHT} from '../../lib/const'
import errors from '../../lib/errors'

describe('BlockWatcher_new', () => {
    it('normal', () => {
        const blockWatcher = new BlockWatcher(null, 100)
        assert.equal(blockWatcher.lastBlockHeight, 100)
        assert.deepEqual(blockWatcher.pendingBlocks, [])
        assert.deepEqual(blockWatcher.callbackInfos, {})
        assert.equal(typeof blockWatcher.idGenerator, 'number')
    })
    it('no startWatchHeight', () => {
        const blockWatcher = new BlockWatcher()
        assert.equal(blockWatcher.lastBlockHeight, NO_LAST_HEIGHT)
    })
})

describe('BlockWatcher_subscribe', () => {
    it('subscribe once then unsubscribe', () => {
        // only one response
        const blockHeights = [1]
        const requester = makeMockRequestor(blockHeights, 50)
        const blockWatcher = new BlockWatcher(requester)

        return new Promise((resolve) => {
            const subscribeId = blockWatcher.subscribe(true, (block, err) => {
                // if stop fail, the err should be not empty because there is no response
                if (err) {
                    assert.fail(err)
                } else {
                    blockWatcher.unsubscribe(subscribeId)
                    resolve()
                }
            })
            assert.equal(subscribeId > 0, true)
        })
    })
    it('subscribe twice', () => {
        // unsubscribe subscription1 when its first block came
        // then watch the subscription2 if it can receive all blocks
        const blockHeights = [1, 2, 3]
        const requester = makeMockRequestor(blockHeights, 50)
        const blockWatcher = new BlockWatcher(requester)

        return new Promise((resolve) => {
            const subscribeId1 = blockWatcher.subscribe(true, (block, err) => {
                if (err) {
                    assert.fail(err)
                } else if (block.header.height === 1) {
                    // unsubscribe when first block come
                    blockWatcher.unsubscribe(subscribeId1)
                } else {
                    assert.fail('unsubscribe fail')
                }
            })
            const subscribeId2 = blockWatcher.subscribe(true, (block, err) => {
                if (err) {
                    assert.fail(err)
                } else if (block.header.height === 3) {
                    // unsubscribe after all blocks come
                    blockWatcher.unsubscribe(subscribeId2)
                    resolve()
                }
            })
            assert.equal(subscribeId2 > subscribeId1, true)
        })
    })
    it('subscribe twice with different withBody', () => {
        const blockHeights = [1, 2, 3]
        const requester = makeMockRequestor(blockHeights, 50)
        const blockWatcher = new BlockWatcher(requester)

        return new Promise((resolve) => {
            const subscribeId1 = blockWatcher.subscribe(false, (block, err) => {
                if (err) {
                    assert.fail(err)
                } else {
                    assert.equal(block.transactions === undefined, true)
                }
            })
            const subscribeId2 = blockWatcher.subscribe(true, (block, err) => {
                if (err) {
                    assert.fail(err)
                } else {
                    assert.equal(Array.isArray(block.transactions), true)
                    if (block.header.height === 3) {
                        // unsubscribe after all blocks come
                        blockWatcher.unsubscribe(subscribeId1)
                        blockWatcher.unsubscribe(subscribeId2)
                        resolve()
                    }
                }
            })
            assert.equal(subscribeId2 > subscribeId1, true)
        })
    })
    it('unsubscribe twice', () => {
        const blockHeights = [1]
        const requester = makeMockRequestor(blockHeights, 50)
        const blockWatcher = new BlockWatcher(requester)

        const subscribeId = blockWatcher.subscribe(false, () => {
        })
        blockWatcher.unsubscribe(subscribeId)
        blockWatcher.unsubscribe(subscribeId)
    })
})

describe('BlockWatcher_callback', () => {
    it('response blocks in sequence', () => {
        const blockHeights = [10, 10, 13, 14, 14, 17, 18]
        const requester = makeMockRequestor(blockHeights, 50)
        const blockWatcher = new BlockWatcher(requester)

        return new Promise((resolve) => {
            let lastBlockHeight = -1
            const subscribeId = blockWatcher.subscribe(true, (block, err) => {
                if (err) {
                    assert.fail(err)
                    return
                }
                console.log(new Date(), 'got block:', block.header.height)
                // got blocks in sequence
                if (lastBlockHeight >= 0) {
                    assert.equal(lastBlockHeight + 1, block.header.height)
                }
                lastBlockHeight = block.header.height

                if (lastBlockHeight === blockHeights[blockHeights.length - 1]) {
                    blockWatcher.unsubscribe(subscribeId)
                    resolve()
                }
            })
        })
    })
    it('set startWatchHeight', () => {
        const blockHeights = [10, 11, 12]
        const requester = makeMockRequestor(blockHeights, 50)
        const blockWatcher = new BlockWatcher(requester, 5)

        return new Promise((resolve) => {
            let lastBlockHeight = 5
            const subscribeId = blockWatcher.subscribe(true, (block, err) => {
                if (err) {
                    assert.fail(err)
                    return
                }
                console.log(new Date(), 'got block:', block.header.height)
                // got blocks in sequence
                if (lastBlockHeight >= 0) {
                    assert.equal(lastBlockHeight + 1, block.header.height)
                }
                lastBlockHeight = block.header.height

                if (lastBlockHeight === blockHeights[blockHeights.length - 1]) {
                    blockWatcher.unsubscribe(subscribeId)
                    resolve()
                }
            })
        })
    })
    it('startWatchHeight too big', () => {
        const blockHeights = [10, 11, 12]
        const requester = makeMockRequestor(blockHeights, 50)
        const blockWatcher = new BlockWatcher(requester, 11)

        return new Promise((resolve) => {
            let lastBlockHeight = 11
            const subscribeId = blockWatcher.subscribe(true, (block, err) => {
                if (block.header.height === 10) {
                    assert.equal(err.message, errors.InvalidWatchBlockHeight(11, 10))
                    return
                }
                // got blocks in sequence
                assert.equal(lastBlockHeight + 1, block.header.height)
                lastBlockHeight = block.header.height
                if (lastBlockHeight === blockHeights[blockHeights.length - 1]) {
                    blockWatcher.unsubscribe(subscribeId)
                    resolve()
                }
            })
        })
    })
})

function makeMockRequestor(currentHeightList, fakeNetworkDelay) {
    const currentBlockResponses = currentHeightList.map((item) => {
        return {
            jsonrpc: '2.0',
            id: 1,
            result: {header: {height: item}},
        }
    })
    const error = new Error('should stop the test case now')
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
                case 'chain_currentBlock': {
                    if (!currentBlockResponses.length) {
                        throw error
                    }
                    console.log(new Date(), 'current block response height:', currentBlockResponses[0].result.header.height)
                    const block = currentBlockResponses.shift()
                    if (payload.params[0]) { // withBody
                        block.transactions = [{}]
                    }
                    return block
                }
                default:
                    throw new Error('not supported request')
            }
        },
    }
    return new Requester(conn, {maxPollRetry: 0, pollDuration: 100})
}

function wait(duration) {
    return new Promise(resolve => setTimeout(resolve, duration))
}
