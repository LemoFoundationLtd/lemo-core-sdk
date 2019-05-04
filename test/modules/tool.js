import {assert} from 'chai'
import {Buffer} from 'safe-buffer'
import BigNumber from 'bignumber.js'
import LemoClient from '../../lib/index'
import {chainID} from '../datas'
import errors from '../../lib/errors'

describe('module_tool_verifyAddress', () => {
    const tests = [
        {input: 'Lemo', output: 'Invalid address checksum Lemo'},
        {input: 'Lemo8', output: 'Invalid address checksum Lemo8'},
        {input: 'LemoBW', output: ''},
        {input: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG', output: ''},
        {input: 'lemo83gn72gyh2nz8ba729z9tct7kq5fc3cr6djg', output: ''},
        {
            input: 'Lemo03GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
            output: 'Decode address LEMO03GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG fail: Non-base26 character',
        },
        {input: 'Lemo33GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG', output: 'Invalid address checksum Lemo33GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG'},
        {input: '123', output: 'Invalid LemoChain address 123'},
        {input: '0x', output: ''},
        {input: '0x1', output: ''},
        {input: '0x015780f8456f9c1532645087a19dcf9a7e0c7f97', output: ''},
        {input: '0X015780F8456F9C1532645087A19DCF9A7E0C7F97', output: ''},
        {input: '0x015780f8456f9c1532645087a19dcf9a7e0c7f97111', output: 'Invalid hex address 0x015780f8456f9c1532645087a19dcf9a7e0c7f97111'},
        {input: 0x1, output: 'Invalid type of address 1, expected \'string\' rather than \'number\''},
    ]

    tests.forEach(({input, output}, i) => {
        const lemo = new LemoClient({chainID})
        it(`address ${JSON.stringify(input)}`, async () => {
            const errMsg = await lemo.tool.verifyAddress(input)
            return assert.equal(errMsg, output, `index=${i}`)
        })
    })
})
describe('module_tool_moToLemo', () => {
    const tests = [
        {input: '0.1', output: '0.0000000000000000001'},
        {input: '1000000000000000000', output: '1'},
        {input: 0, output: '0'},
        {input: '0x1001', output: '0.000000000000004097'},
        {input: -1, output: '-0.000000000000000001'},
        {input: '', output: '', error: errors.MoneyFormatError()},
        {input: 'usuussua', output: '', error: errors.MoneyFormatError()},
    ]
    tests.forEach(test => {
        it(`when input is ${test.input}`, () => {
            const lemo = new LemoClient({chainID})
            if (test.error) {
                assert.throws(() => {
                    lemo.tool.moToLemo(test.input)
                }, test.error)
            } else {
                assert.equal(lemo.tool.moToLemo(test.input).toString(10), test.output)
            }
        })
    })
})

describe('module_tool_lemoToMo', () => {
    const tests = [
        {input: '0.0000000000000000001', output: '0.1'},
        {input: '1', output: '1000000000000000000'},
        {input: '0x10011', output: '65553000000000000000000'},
        {input: 0, output: '0'},
        {input: -0.000000000000000001, output: '-1'},
        {input: '', output: '', error: errors.MoneyFormatError()},
        {input: 'usuussua', output: '', error: errors.MoneyFormatError()},
    ]
    tests.forEach(test => {
        it(`when input is ${test.input}`, () => {
            const lemo = new LemoClient({chainID})
            if (test.error) {
                assert.throws(() => {
                    lemo.tool.lemoToMo(test.input)
                }, test.error)
            } else {
                assert.equal(lemo.tool.lemoToMo(test.input).toString(10), test.output)
            }
        })
    })
})

describe('module_tool_toBuffer', () => {
    const tests = [
        {input: '', output: ''},
        {input: '1', output: '31'},
        {input: '\'😋"}', output: '27f09f988b227d'},
        {input: '{"a":1}', output: '7b2261223a317d'},
        {input: '0x10011', output: '010011'},
        {input: 0, output: '00'},
        {input: 0.1, output: ''},
        {input: -5, output: ''},
        {input: [1, 2], output: '0102'},
        {input: Buffer.from('abc'), output: '616263'},
        {input: new BigNumber('0x01'), output: '01'},
        {input: {a: 1}, error: errors.NotSupportedType()},
    ]
    tests.forEach(test => {
        it(`when input is ${test.input}`, () => {
            const lemo = new LemoClient({chainID})
            if (test.error) {
                assert.throws(() => {
                    lemo.tool.toBuffer(test.input)
                }, test.error)
            } else {
                assert.equal(lemo.tool.toBuffer(test.input).toString('hex'), test.output)
            }
        })
    })
})
