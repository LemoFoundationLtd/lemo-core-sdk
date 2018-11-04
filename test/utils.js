import {assert} from 'chai'
import BigNumber from 'bignumber.js'
import utils from '../lib/utils'

describe('formatMoney', () => {
    const tests = {
        0: '0Mo',
        1: '1Mo',
        100: '100Mo',
        1000: '1KMo',
        1001: '1001Mo',
        10010000: '10010KMo',
        10000000: '10MMo',
        1000000000: '1GMo',
        100000000000: '100GMo',
        1000000000000: '0.000001LEMO',
        11000000000000: '0.000011LEMO',
        11111000000000000: '0.011111LEMO',
        11110001000000000000: '11.110001LEMO',
        111110001000000000000: '111.110001LEMO',
        1000000000000000000: '1LEMO',
        100000000000000000000: '100LEMO',
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
