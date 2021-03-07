import {parseBlock} from '../network/data_parser'
import {CHAIN_NAME, NO_LAST_HEIGHT} from '../const'
import BlockFetcher from './block_fetcher'
import errors from '../errors'

/**
 * 用于监听最新区块，并使得多次调用watchBlock只发一次请求
 */
class BlockWatcher {
    /**
     * @param {Requester} requester
     * @param {number?} startWatchHeight 如果设置，就从该高度的下一个区块开始监听
     */
    constructor(requester, startWatchHeight) {
        this.lastBlockHeight = typeof startWatchHeight === 'number' ? startWatchHeight : NO_LAST_HEIGHT // 收到已通知出去的最新的块的高度
        this.pendingBlocks = [] // 收到未通知出去的块的缓冲数组
        this.callbackInfos = {} // 多次subscribe所请求的回调函数对象集合
        this.requester = requester
        this.idGenerator = 1 // 用于每次调用subscribe时生成subscribeId
        this.watchId = 0 // requester.watch's Id，用于停止定时器
        this.fetcher = new BlockFetcher(requester, this.watchHandler.bind(this)) // 拉取区块时的任务队列
    }

    /**
     * @callback BlockWatchCallback
     * @param {object} block
     * @param {Error} error
     */
    /**
     * 监听最新区块
     * @param {boolean} withBody
     * @param {BlockWatchCallback} callback
     * @return {number}  记录每次调用watchBlock的Id
     */
    subscribe(withBody, callback) {
        const subscribeId = this.idGenerator++
        const oldWithBody = this.getWithBody()
        this.callbackInfos[subscribeId] = {withBody, callback}
        if (Object.keys(this.callbackInfos).length === 1) {
            this.watchId = this.requester.watch(`${CHAIN_NAME}_currentBlock`, [!!this.getWithBody()], this.watchHandler.bind(this))
        } else if (withBody && !oldWithBody) {
            this.requester.stopWatch(this.watchId)
            this.watchId = this.requester.watch(`${CHAIN_NAME}_currentBlock`, [!!this.getWithBody()], this.watchHandler.bind(this))
        }
        return subscribeId
    }

    /**
     * 取消监听最新区块
     * @param {number} watchId  subscribe返回的Id
     */
    unsubscribe(watchId) {
        delete this.callbackInfos[watchId]
        if (!Object.keys(this.callbackInfos).length) {
            this.requester.stopWatch(this.watchId)
            delete this.watchId
        }
    }

    getWithBody() {
        return Object.values(this.callbackInfos).some(item => {
            return item.withBody
        })
    }

    getLatestBlockHeight() {
        return this.pendingBlocks.length ? this.pendingBlocks[this.pendingBlocks.length - 1].header.height : this.lastBlockHeight
    }

    /**
     * requester's watch callback
     * @param {Object} block
     * @param {Error} error
     */
    watchHandler(block, error) {
        if (error) {
            this.notify(block, error)
            return
        }
        try {
            const newBlock = parseBlock(block, this.getWithBody())
            this.processBlock(newBlock)
        } catch (e) {
            this.notify(block, e)
        }
    }

    notify(block, error) {
        Object.values(this.callbackInfos).forEach((item) => {
            if (!item.withBody) {
                item.callback({header: block.header}, error)
            } else {
                item.callback(block, error)
            }
        })
    }

    /**
     * 检查收到的块是否连续，并通知出去
     */
    checkAndNotifyBlocks() {
        while (this.pendingBlocks.length && this.lastBlockHeight + 1 === this.pendingBlocks[0].header.height) { // 判断最新收到的块与上一个块是否连续
            const notifiedblock = this.pendingBlocks.shift()
            this.lastBlockHeight++
            this.notify(notifiedblock)
        }
    }

    /**
     * 找到缓冲数组与最新拉取的缺失块的顺序，并往缓冲数组插入缺失的块
     */
    insert(result) {
        this.pendingBlocks.push(result)
        this.pendingBlocks.sort((a, b) => a.header.height - b.header.height)
    }

    /**
     * 判断是否出现已存在的块
     */
    isExistBlock(block) {
        return this.lastBlockHeight === block.header.height || this.pendingBlocks.find(item => item.header.height === block.header.height)
    }

    /**
     * 检查watchBlock有无缺块
     * @param {Object} block
     */
    processBlock(block) {
        // 存在于pendingBlocks中或高度与lastBlockHeight相等
        if (this.isExistBlock(block)) {
            return
        }
        // 初始化lastBlockHeight
        if (!this.pendingBlocks.length && this.lastBlockHeight === NO_LAST_HEIGHT) {
            this.lastBlockHeight = block.header.height - 1
        }
        if (block.header.height < this.lastBlockHeight) { // 新块变小抛异常
            throw new Error(errors.InvalidWatchBlockHeight(this.lastBlockHeight, block.header.height))
        }

        // insert前先获取最新块高度
        const nextHeight = this.getLatestBlockHeight() + 1
        this.insert(block)
        this.checkAndNotifyBlocks()
        if (nextHeight < block.header.height) {
            // 出现了新的漏块情况。排队拉取，回包会进入watchHandler
            this.fetcher.addFetchTasks(nextHeight, block.header.height - 1, !!this.getWithBody())
        }
    }
}

export default BlockWatcher
