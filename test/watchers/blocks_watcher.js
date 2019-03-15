import {assert} from 'chai'
import Watcher from '../../lib/watchers/blocks_watcher'

const watcher = new Watcher()
describe('watchers_processor', () => {
    it('processBlock', () => {
        watcher.clearHistory()
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
            watcher.processBlock(testFetch, item, (block) => {
                lastBlockHeight++
                assert.deepEqual(lastBlockHeight, block.header.height)
            })
        })
    })
})
