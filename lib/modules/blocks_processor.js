import {parseBlock} from '../network/data_parser'

const MODULE_NAME = 'chain'


let lastBlockHeight = -1
const pendingBlocks = []

const notify = (callback) => {
    if (pendingBlocks.length > 1) {
        while (lastBlockHeight  === pendingBlocks[0].header.height) {
            lastBlockHeight = pendingBlocks[0].header.height + 1
            callback(pendingBlocks.shift())
        }
        return
    }
    lastBlockHeight = pendingBlocks[0].header.height
}
const insert = (result) => {
    for (let i = 0; i < pendingBlocks.length; i++) {
        if (result.header.height === pendingBlocks[i].header.height + 1) {
            pendingBlocks.splice(i + 1, 0, result)
            break
        }
    }
}

export default function check(requester, signer, block, withBody, callback) {
    const nextHeight = (pendingBlocks.length ? pendingBlocks[pendingBlocks.length - 1].header.height  : lastBlockHeight) + 1
    if (lastBlockHeight > block.header.height) { // 新块变小抛异常
        throw new Error('block height must be bigger than the height of current block')
    } else if (nextHeight  > block.header.height) {
        insert(block)
        notify(callback)
    }

    if (nextHeight  < block.header.height && nextHeight !== -1) {
        pendingBlocks.push(block)
        for (let i = nextHeight; i < block.header.height; i++) {
            const newBlockPromise = requester.send(`${MODULE_NAME}_getBlockByHeight`, [i, !!withBody])
            newBlockPromise.then(result => {
                result = parseBlock(signer, result, withBody)
                insert(result)
                notify(callback)
            })
        }
        return
    }
    pendingBlocks.push(block)
    notify(callback)
}


