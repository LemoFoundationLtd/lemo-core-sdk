import {assert} from 'chai'
import utils from '../lib/utils'

describe('utils_deepEqual', () => {
    const tests = [
        {input: [undefined, undefined], output: true},
        {input: [null, null], output: true},
        {input: [true, true], output: true},
        {input: [{}, {}], output: true},
        {input: [-123, -123], output: true},
        {input: [123, 123], output: true},
        {input: [[], []], output: true},
        {input: [['123', 456], ['123', 456]], output: true},
        {input: [{a: 12, b: [{c: '22"', d: true}]}, {a: 12, b: [{c: '22"', d: true}]}], output: true},
        {input: [undefined, null], output: false},
        {input: [{}, null], output: false},
        {input: [0, null], output: false},
        {input: [0, ''], output: false},
        {input: [0, NaN], output: false},
        {input: [NaN, NaN], output: false},
        {input: [[], {}], output: false},
        {input: [[12, 34], {1: 12, 2: 34}], output: false},
    ]
    tests.forEach(test => {
        it(`${JSON.stringify(test.input[0])} ${test.output ? '==' : '!='} ${JSON.stringify(test.input[1])}`, () => {
            const result = utils.deepEqual(test.input[0], test.input[1])
            assert.equal(result, test.output)
        })
    })
})
