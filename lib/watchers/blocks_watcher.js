
import {parseBlock} from '../network/data_parser'
import  {CHAIN_NAME} from '../const'

class Watcher {
    constructor() {
        this.lastBlockHeight = -1
        this.pendingBlocks = []
        this.callbacks = {}
        this.requester = null
        this.idGenerator = 1
        this.watchId = 0
        this.withBody = true
    }

    subscribe(requester, callback, withBody) {
        this.requester = requester
        this.withBody = withBody
        const newWatchId = this.idGenerator++
        this.callbacks[newWatchId] = callback
        if (Object.keys(this.callbacks).length === 1) {
            this.watchId = requester.watch(`${CHAIN_NAME}_latestStableBlock`, [!!withBody], this.watchHandler.bind(this))
        }
        return  newWatchId
    }

    unsubscribe(watchId) {
        if (!this.requester) {
            throw new Error('can not use stopWatchBlock before using watchBlock')
        }
        delete this.callbacks[watchId]
        delete this.watchId
        if (!Object.keys(this.callbacks).length) {
            this.requester.stopWatch(watchId)
        }
    }

    fetchBlock(height) {
        return  this.requester.send(`${CHAIN_NAME}_chain_getBlockByHeight`, [height, !!this.withBody]).then(result => {
            return  parseBlock(this.chainID, result, this.withBody)
        })
    }

    watchHandler(block) {
        const newBlock = parseBlock(this.chainID, block, this.withBody)
        this.processBlock(this.fetchBlock, newBlock, this.withBody)
    }

    notify  ()  {
        if (this.lastBlockHeight === -1) {
            this.lastBlockHeight = this.pendingBlocks[0].header.height
            console.log(this.callbacks)
            this.callbacks['1'](this.pendingBlocks.shift())
            return
        }
        while (this.lastBlockHeight + 1 ===    this.pendingBlocks[0].header.height) {
            this.lastBlockHeight = this.pendingBlocks[0].header.height
            Object.keys(this.callbacks).forEach(item => {
                this.callbacks[item](this.pendingBlocks.shift())
            })
            if (!this.pendingBlocks.length) {
                break
            }
        }
    }

    insert  (result) {
        for (let i = 0; i <    this.pendingBlocks.length; i++) {
            if (result.header.height + 1 ===    this.pendingBlocks[i].header.height) {
                this.pendingBlocks.splice(i, 0, result)
                break
            }
        }
    }

    /**
    *  清空各个watchBlock用例影响的字段值
    */
    clearHistory ()  {
        this.lastBlockHeight = -1
        this.pendingBlocks = []
    }

    /**
    *  检查watchBlock有无缺块
    *
    * @param {Function} fetchBlock
    * @param {Object} block
    * @param {Function} callback
    */
    processBlock (fetchBlock, block, callback)  {
        const nextHeight = (this.pendingBlocks.length ? this.pendingBlocks[this.pendingBlocks.length - 1].header.height :  this.lastBlockHeight) + 1
        if (block.header.height <  this.lastBlockHeight) { // 新块变小抛异常
            throw new Error('block height must be bigger than the height of current block')
        } else if (block.header.height < nextHeight) {
            this.insert(block)
            this.notify(callback)
        } else { // 出现块不连续情况
            if (nextHeight === 0) {
                this.pendingBlocks.push(block)
                this.notify(callback)
                return
            }
            this.pendingBlocks.push(block)
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

