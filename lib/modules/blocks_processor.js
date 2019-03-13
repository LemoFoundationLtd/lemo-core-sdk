import {parseBlock} from '../network/data_parser'

async function send(requester, params, withBody) {
    return requester.send('chain_getBlockByHeight', [params, !!withBody])
}

let lastBlockHeight = -1
const pendingBlocks = []

const notify = (callback) => {
    if (lastBlockHeight !== -1) {
        while (lastBlockHeight  === pendingBlocks[0].header.height) {
            lastBlockHeight = pendingBlocks[0].header.height
            callback(pendingBlocks.shift())
        }
        return
    }
    lastBlockHeight = pendingBlocks[0].header.height
    callback(pendingBlocks.shift())
}
const insert = (result) => {
    for (let i = 0; i < pendingBlocks.length; i++) {
        if (result.header.height === pendingBlocks[i].header.height + 1) {
            pendingBlocks.splice(i + 1, 0, result)
            break
        }
    }
}

export default function processBlock(requester, signer, block, withBody, callback) {
    const nextHeight = (pendingBlocks.length ? pendingBlocks[pendingBlocks.length - 1].header.height  : lastBlockHeight) + 1
    if (block.header.height > lastBlockHeight) { // 新块变小抛异常
        throw new Error('block height must be bigger than the height of current block')
    } else if (block.header.height < nextHeight) {
        insert(block)
        notify(callback)
    } else {
        if (nextHeight !== -1) {
            pendingBlocks.push(block)
            for (let i = nextHeight; i < block.header.height; i++) {
                const newBlockPromise = send(requester, i, withBody)
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
}


