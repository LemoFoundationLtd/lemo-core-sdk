import {assert} from 'chai'
import BigNumber from 'bignumber.js'
import utils from '../lib/utils'

describe('formatMoney', () => {
    const tests = {
        0: '0 mo',
        1: '1 mo',
        100: '100 mo',
        1000: '1K mo',
        1001: '1001 mo',
        10010000: '10010K mo',
        10000000: '10M mo',
        1000000000: '1G mo',
        100000000000: '100G mo',
        1000000000000: '0.000001 LEMO',
        11000000000000: '0.000011 LEMO',
        11111000000000000: '0.011111 LEMO',
        11110001000000000000: '11.110001 LEMO',
        111110001000000000000: '111.110001 LEMO',
        1000000000000000000: '1 LEMO',
        100000000000000000000: '100 LEMO',
    }
    Object.entries(tests).forEach(([input, output]) => {
        it(`number ${input}`, () => {
            assert.equal(utils.formatMoney(input), output)
        })
    })
    Object.entries(tests).forEach(([input, output]) => {
        it(`string ${input}`, () => {
            assert.equal(utils.formatMoney(`${input}`), output)
        })
    })
    Object.entries(tests).forEach(([input, output]) => {
        it(`BigNumber ${input}`, () => {
            assert.equal(utils.formatMoney(new BigNumber(input)), output)
        })
    })
})
