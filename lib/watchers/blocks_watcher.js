
import {parseBlock} from '../network/data_parser'

let lastBlockHeight = -1
let pendingBlocks = []
const callbacks = []

class Watcher {
    subscribe(requester, callback, withBody) {
        callbacks.push(callback)
        if (callbacks.length) {
            const fetchBlock = (height) => {
                return requester.send('chain_getBlockByHeight', [height, !!withBody]).then(result => {
                    return  parseBlock(this.chainID, result, withBody)
                })
            }
            const watchHandler = block => {
                const newBlock = parseBlock(this.chainID, block, withBody)
                this.processBlock(fetchBlock, newBlock, callback)
            }
            return requester.watch('chain_latestStableBlock', [!!withBody], watchHandler)
        }
        return 0
    }

    unSubscribe(requester) {
        if (!callbacks.length) {
            requester.stopWatch()
        }
    }

    notify  (callback)  {
        if (lastBlockHeight === -1) {
            lastBlockHeight = pendingBlocks[0].header.height
            callback(pendingBlocks.shift())
            return
        }
        while (lastBlockHeight + 1 === pendingBlocks[0].header.height) {
            lastBlockHeight = pendingBlocks[0].header.height
            callback(pendingBlocks.shift())
            if (!pendingBlocks.length) {
                break
            }
        }
    }

    insert  (result) {
        for (let i = 0; i < pendingBlocks.length; i++) {
            if (result.header.height + 1 === pendingBlocks[i].header.height) {
                pendingBlocks.splice(i, 0, result)
                break
            }
        }
    }

    /**
 *  清空各个watchBlock用例影响的字段值
 */
    clearHistory ()  {
        lastBlockHeight = -1
        pendingBlocks = []
    }

    /**
 *  检查watchBlock有无缺块
 *
 * @param {Function} fetchBlock
 * @param {Object} block
 * @param {Function} callback
 */
    processBlock (fetchBlock, block, callback)  {
        const nextHeight = (pendingBlocks.length ? pendingBlocks[pendingBlocks.length - 1].header.height : lastBlockHeight) + 1
        if (block.header.height < lastBlockHeight) { // 新块变小抛异常
            throw new Error('block height must be bigger than the height of current block')
        } else if (block.header.height < nextHeight) {
            this.insert(block)
            this.notify(callback)
        } else { // 出现块不连续情况
            if (nextHeight === 0) {
                pendingBlocks.push(block)
                this.notify(callback)
                return
            }
            pendingBlocks.push(block)
            for (let i = nextHeight; i < block.header.height; i++) {
                const newBlockPromise = fetchBlock(i)
                newBlockPromise.then(result => {
                    this.insert(result)
                    this.notify(callback)
                })
            }
        }
    }
}
export default Watcher

