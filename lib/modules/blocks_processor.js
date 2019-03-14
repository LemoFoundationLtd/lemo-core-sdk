
let lastBlockHeight = -1
let pendingBlocks = []

const notify = (callback) => {
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
const insert = (result) => {
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

export const clearHistory = () => {
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

export const processBlock = (fetchBlock, block, callback) => {
    const nextHeight = (pendingBlocks.length ? pendingBlocks[pendingBlocks.length - 1].header.height : lastBlockHeight) + 1
    if (block.header.height < lastBlockHeight) { // 新块变小抛异常
        throw new Error('block height must be bigger than the height of current block')
    } else if (block.header.height < nextHeight) {
        insert(block)
        notify(callback)
    } else { // 出现块不连续情况
        if (nextHeight === 0) {
            pendingBlocks.push(block)
            notify(callback)
            return
        }
        pendingBlocks.push(block)
        for (let i = nextHeight; i < block.header.height; i++) {
            const newBlockPromise = fetchBlock(i)
            newBlockPromise.then(result => {
                insert(result)
                notify(callback)
            })
        }
    }
}


