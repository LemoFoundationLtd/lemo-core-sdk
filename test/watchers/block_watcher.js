import {assert} from 'chai'
import BlockWatcher from '../../lib/watchers/block_watcher'

const blockWatcher = new BlockWatcher()
describe('watchers', () => {
    it('processBlock', () => {
        const testArr = [1, 1, 3, 4, 4, 6, 8].map((item) => {
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
            blockWatcher.processBlock(testFetch, item, (block) => {
                lastBlockHeight++
                assert.deepEqual(lastBlockHeight, block.header.height)
            })
        })
    })
})

