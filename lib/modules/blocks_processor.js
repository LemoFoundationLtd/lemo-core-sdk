import {parseBlock} from '../network/data_parser'

const MODULE_NAME = 'chain'


let lastBlockHeight = -1
const pendingBlocks = []

const notify = (callback, block) => {
    while (block.header.height === pendingBlocks[0].header.height) {
        callback(block)
        pendingBlocks.shift()
        lastBlockHeight = block.header.height
    }
}
const insert = (value, callback) => {
    for (let i = 0; i < pendingBlocks.length; i++) {
        if (value.header.height === pendingBlocks[i].header.height + 1) {
            pendingBlocks.splice(i + 1, 0, value)
            notify(callback, value)
            check()
            break
        }
    }
}

export default function check (requester, signer, block, withBody, callback) {
    const maxHeight = pendingBlocks.length ? pendingBlocks[pendingBlocks.length - 1].header.height : lastBlockHeight
    if (maxHeight + 1 > block.header.height) { // 新块变小抛异常
        throw new Error()
    }
    if (maxHeight + 1 !== block.header.height) {
        pendingBlocks.push(block)
        for (let i = maxHeight + 1; i < block.header.height; i++) {
            const newBlockPromise = requester.send(`${MODULE_NAME}_getBlockByHeight`, [i, !!withBody])

            newBlockPromise.then(value => {
                value = parseBlock(signer, value, withBody)
                insert(value, callback)
            })
        }
        return
    }
    pendingBlocks.push(block)
    notify(callback, block)
}


