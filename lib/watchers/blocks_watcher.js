
import {parseBlock} from '../network/data_parser'
import  {CHAIN_NAME} from '../const'

class Watcher {
    constructor() {
        this.lastBlockHeight = -1 // 上一个块高度
        this.pendingBlocks = [] // 缓冲数组
        this.callbacks = {} // 存多个callback
        this.requester = null // requester
        this.idGenerator = 1 // 生成返回Id
        this.watchId = 0 // requester.watch's Id
        this.withBody = true  // withBody
    }

    /**
    *  开始监听
    * @param {Function} requester
    * @param {boolean} withBody
    * @param {Function} callback
    */
    subscribe(requester, withBody, callback) {
        this.requester = requester
        this.withBody = withBody
        const newWatchId = this.idGenerator++
        this.callbacks[newWatchId] = callback
        if (Object.keys(this.callbacks).length === 1) {
            this.watchId = requester.watch(`${CHAIN_NAME}_latestStableBlock`, [!!withBody], this.watchHandler.bind(this))
        }
        return  newWatchId
    }

    /**
    *  取消监听
    * @param {string} watchId
    */
    unsubscribe(watchId) {
        if (!this.requester) {
            throw new Error('can not use stopWatchBlock before using watchBlock')
        }
        delete this.callbacks[watchId]
        if (!Object.keys(this.callbacks).length) {
            this.requester.stopWatch(this.watchId)
            delete this.watchId
        }
    }


    /**
    *  根据高度拉块
    * @param {number} height
    */
    fetchBlock(height) {
        return  this.requester.send(`${CHAIN_NAME}_chain_getBlockByHeight`, [height, !!this.withBody]).then(result => {
            return  parseBlock(this.chainID, result, this.withBody)
        })
    }

    /**
    *  requester's watch  callback
    * @param {Object} block
    */
    watchHandler(block) {
        const newBlock = parseBlock(this.chainID, block, this.withBody)
        this.processBlock(this.fetchBlock, newBlock, this.withBody)
    }

    updateBlockInfo() {
        const notifiedblock = this.pendingBlocks.shift()
        this.lastBlockHeight = notifiedblock.header.height
        Object.values(this.callbacks).forEach(item => {
            item(notifiedblock)
        })
    }

    /**
    *  将watchBlock的块通知出去
    *
    */
    notify() {
        if (this.lastBlockHeight === -1) {
            this.updateBlockInfo()
            return
        }
        if (this.pendingBlocks.length) {
            while (this.lastBlockHeight + 1 === this.pendingBlocks[0].header.height) {
                this.updateBlockInfo()
                if (!this.pendingBlocks.length) {
                    break
                }
            }
        }
    }

    /**
    *  更新缓冲数组的块
    *
    */
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

