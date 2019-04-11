import {parseBlock} from '../network/data_parser'
import {CHAIN_NAME} from '../const'

/**
 * 用于监听最新区块，并使得多次调用watchBlock只发一次请求
 */
export default class {
    constructor(requester) {
        this.lastBlockHeight = -1 // 收到已通知出去的最新的块的高度
        this.pendingBlocks = [] // 收到未通知出去的块的缓冲数组
        this.callbackInfos = {} // 多次subscribe所请求的回调函数对象集合
        this.requester = requester // requester
        this.idGenerator = 1 // 生成返回Id，记录每次调用watchBlock
        this.watchId = 0 // requester.watch's Id，用于停止定时器
    }

    /**
     *  监听最新区块
     * @param {boolean} withBody
     * @param {Function} callback
     * @return {number}  记录每次调用watchBlock的Id
     */
    subscribe(withBody, callback) {
        const subscribeId = this.idGenerator++
        const oldWithBody = this.getWidthBody()
        this.callbackInfos[subscribeId] = {withBody, callback}
        if (Object.keys(this.callbackInfos).length === 1) {
            this.watchId = this.requester.watch(`${CHAIN_NAME}_currentBlock`, [!!this.getWidthBody()], this.watchHandler.bind(this))
        } else if (withBody && !oldWithBody) {
            this.requester.stopWatch(this.watchId)
            this.watchId = this.requester.watch(`${CHAIN_NAME}_currentBlock`, [!!this.getWidthBody()], this.watchHandler.bind(this))
        }
        return subscribeId
    }

    /**
     *  取消监听最新区块
     * @param {string} watchId  subscribe返回的Id
     */
    unsubscribe(watchId) {
        if (!this.requester) {
            throw new Error('can not use stopWatchBlock before using watchBlock')
        }
        if (!watchId) {
            throw new Error('stopWatchBlock needs a parameter id')
        }
        delete this.callbackInfos[watchId]
        if (!Object.keys(this.callbackInfos).length) {
            this.requester.stopWatch(this.watchId)
            delete this.watchId
        }
    }

    getWidthBody() {
        return Object.values(this.callbackInfos).some(item => {
            return item.withBody
        })
    }

    getLatestBlockHeight() {
        return this.pendingBlocks.length ? this.pendingBlocks[this.pendingBlocks.length - 1].header.height : this.lastBlockHeight
    }

    /**
     *  根据高度拉块
     * @param {number} height
     */
    fetchBlock(height) {
        return this.requester.send(`${CHAIN_NAME}_chain_getBlockByHeight`, [height, !!this.getWidthBody()]).then(result => {
            return parseBlock(this.chainID, result, this.getWidthBody())
        })
    }

    /**
     *  requester's watch  callback
     * @param {Object} block
     */
    watchHandler(block, error) {
        if (error) {
            this.notify(block, error)
            return
        }
        const newBlock = parseBlock(this.chainID, block, this.getWidthBody())
        this.processBlock(this.fetchBlock, newBlock)
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

    updateBlockInfo() {
        const notifiedblock = this.pendingBlocks.shift()
        this.lastBlockHeight = notifiedblock.header.height
        return notifiedblock
    }

    /**
     *  检查收到的块是否连续，并通知出去
     */
    checkNotifiedBlock() {
        if (this.lastBlockHeight === -1) {
            const notifiedblock = this.updateBlockInfo()
            this.notify(notifiedblock)
            return
        }
        while (this.pendingBlocks.length && this.lastBlockHeight + 1 === this.pendingBlocks[0].header.height) { // 判断最新收到的块与上一个块是否连续
            const notifiedblock = this.updateBlockInfo()
            this.notify(notifiedblock)
        }
    }

    /**
     *  找到缓冲数组与最新拉取的缺失块的顺序，并往缓冲数组插入缺失的块
     */
    insert(result) {
        for (let i = 0; i < this.pendingBlocks.length; i++) {
            if (result.header.height + 1 === this.pendingBlocks[i].header.height) {
                this.pendingBlocks.splice(i, 0, result)
                break
            }
        }
    }

    /**
     *  判断是否出现已存在的块
     *
     */
    isExistBlock(block) {
        if (this.lastBlockHeight === -1 || !this.pendingBlocks.find(item => item.header.height === block.header.height)
            && this.lastBlockHeight !== block.header.height) {
            return false
        }
        return true
    }

    /**
     *  检查watchBlock有无缺块
     *
     * @param {Function} fetchBlock
     * @param {Object} block
     */
    processBlock(fetchBlock, block) {
        if (this.isExistBlock(block)) {
            return
        }
        const nextHeight = this.getLatestBlockHeight() + 1
        if (block.header.height < this.lastBlockHeight) { // 新块变小抛异常
            throw new Error('block height must be bigger than the height of current block')
        } else if (block.header.height < nextHeight) {
            this.insert(block)
            this.checkNotifiedBlock()
        } else { // 出现块不连续情况
            if (nextHeight === 0) {
                this.pendingBlocks.push(block)
                this.checkNotifiedBlock()
                return
            }
            this.pendingBlocks.push(block)
            for (let i = nextHeight; i < block.header.height; i++) {
                const newBlockPromise = fetchBlock(i)
                newBlockPromise.then(result => {
                    this.insert(result)
                    this.checkNotifiedBlock()
                })
            }
        }
    }
}


