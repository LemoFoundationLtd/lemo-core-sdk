import {assert} from 'chai'
import BigNumber from 'bignumber.js'
import utils from '../lib/utils'

describe('formatMoney', () => {
    const tests = {
        0: '0 LEMO',
        1: '1 mo',
        100: '100 mo',
        1000: '1K mo',
        1001: '1001 mo',
        10010000: '10010K mo',
        10000000: '10M mo',
        1000000000: '1G mo',
        100000000000: '100G mo',
        1000000000000: '0.000001 LEMO',
        1000000000001: '0.000001000000000001 LEMO',
        11000000000000: '0.000011 LEMO',
        11111000000000000: '0.011111 LEMO',
        11110001000000000000: '11.110001 LEMO',
        11110001001000000000: '11.110001001 LEMO',
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

describe('moToLemo', () => {
    const test = {
        0: '0',
        1000000000000: '0.000001',
        1000000000001: '0.000001000000000001',
        11000000000000: '0.000011',
        11111000000000000: '0.011111',
        11110001000000000000: '11.110001',
        11110001001000000000: '11.110001001',
        111110001000000000000: '111.110001',
        1000000000000000000: '1',
        100000000000000000000: '100',
    }
    Object.entries(test).forEach(([input, output]) => {
        it(`number ${input}`, () => {
            assert.equal(utils.moToLemo(input), output)
        })
    })
})

describe('lemoToMo', () => {
    const test = {
        0: '0',
        0.000000000000000001: '1',
        0.000001: '1000000000000',
        0.000001000000000001: '1000000000001',
        0.000011: '11000000000000',
        0.011111: '11111000000000000',
        11.110001: '11110001000000000000',
        11.110001001: '11110001001000000000',
        111.110001: '111110001000000000000',
        1: '1000000000000000000',
        100: '100000000000000000000',
    }
    Object.entries(test).forEach(([input, output]) => {
        it(`number ${input}`, () => {
            assert.equal(utils.lemoToMo(input), output)
        })
    })
})
