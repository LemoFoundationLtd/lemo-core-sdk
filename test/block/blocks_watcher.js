import {assert} from 'chai'
import {clearHistory, processBlock} from '../../lib/block/blocks_watcher'

describe('network_blocks_processor', () => {
    it('processBlock', () => {
        clearHistory()
        const testArr = [1, 3, 4, 6, 8].map((item) => {
            return {
                header: {
                    height: item,
                },
            }
        })
        const testFetch = async (i) => {
            return {
                header: {
                    height: i,
                },
            }
        }
        let lastBlockHeight = 0
        testArr.forEach((item) => {
            processBlock(testFetch, item, (block) => {
                lastBlockHeight++
                assert.deepEqual(lastBlockHeight, block.header.height)
            })
        })
    })
})
