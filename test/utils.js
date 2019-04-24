import {assert} from 'chai'
import BigNumber from 'bignumber.js'
import utils from '../lib/utils'
import errors from '../lib/errors'

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
    const tests = [
        {input: 0, output: '0'},
        {input: 1111, output: '0.000000000000001111'},
        {input: 1000000000000, output: '0.000001'},
        {input: 1000000000001, output: '0.000001000000000001'},
        {input: 11000000000000, output: '0.000011'},
        {input: 11111000000000000, output: '0.011111'},
        {input: 11110001000000000000, output: '11.110001'},
        {input: 11110001001000000000, output: '11.110001001'},
        {input: 111110001000000000000, output: '111.110001'},
        {input: 1000000000000000000, output: '1'},
        {input: 100000000000000000000, output: '100'},
        {input: '0x11111', output: '0.000000000000069905'},
        {input: -1, output: '-0.000000000000000001'},
        {input: '-0x11111', output: '-0.000000000000069905'},
        {input: '-1000000', output: '-0.000000000001'},
        {input: '-0.2200000', output: '-0.00000000000000000022'},
        {input: '', output: '', error: errors.MoneyFormatError()},
        {input: 'usuussua', output: '', error: errors.MoneyFormatError()},
        {input: '-idndfsda', output: '', error: errors.MoneyFormatError()},
    ]
    tests.forEach((test) => {
        it(`The value entered by moToLemo is ${test.input}`, () => {
            if (test.error) {
                assert.throws(() => {
                    utils.moToLemo(test.input)
                }, test.error)
            } else {
                assert.equal(utils.moToLemo(test.input).toString(10), test.output)
            }
        })
    })
})

describe('lemoToMo', () => {
    const tests = [
        {input: 0, output: '0'},
        {input: 0.000000000000000001, output: '1'},
        {input: 0.000001, output: '1000000000000'},
        {input: 0.000001000000000001, output: '1000000000001'},
        {input: 0.000011, output: '11000000000000'},
        {input: 0.011111, output: '11111000000000000'},
        {input: 11.110001, output: '11110001000000000000'},
        {input: 11.110001001, output: '11110001001000000000'},
        {input: 111.110001, output: '111110001000000000000'},
        {input: 1, output: '1000000000000000000'},
        {input: 100, output: '100000000000000000000'},
        {input: '0x11111', output: '69905000000000000000000'},
        {input: -1, output: '-1000000000000000000'},
        {input: '-0x11111', output: '-69905000000000000000000'},
        {input: '-1000000', output: '-1000000000000000000000000'},
        {input: '-0.2200000', output: '-220000000000000000'},
        {input: '', output: '', error: errors.MoneyFormatError()},
        {input: 'usuussua', output: '', error: errors.MoneyFormatError()},
        {input: '-idndfsda', output: '', error: errors.MoneyFormatError()},
    ]
    tests.forEach((test) => {
        it(`The value entered by lemoToMo is ${test.input}`, () => {
            if (test.error) {
                assert.throws(() => {
                    utils.lemoToMo(test.input)
                }, test.error)
            } else {
                assert.equal(utils.lemoToMo(test.input).toString(10), test.output)
            }
        })
    })
})
