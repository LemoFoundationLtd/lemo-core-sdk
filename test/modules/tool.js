import {assert} from 'chai'
import LemoClient from '../../lib/index'
import {chainID} from '../datas'

describe('module_tool_verifyAddress', () => {
    const tests = [
        {input: 'Lemo', output: 'Invalid address checksum Lemo'},
        {input: 'Lemo8', output: 'Invalid address checksum Lemo8'},
        {input: 'LemoBW', output: ''},
        {input: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG', output: ''},
        {input: 'lemo83gn72gyh2nz8ba729z9tct7kq5fc3cr6djg', output: ''},
        {input: 'Lemo03GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG', output: 'Decode address LEMO03GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG fail: Non-base26 character'},
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

describe('moToLemo', () => {
    it('is_float', function() {
        const lemo = new LemoClient({chainID})
        const mo = '0.1'
        const result = lemo.tool.moToLemo(mo)
        assert.equal(result.toString(10), '0.0000000000000000001')
    })
    it('bignumber', function() {
        const lemo = new LemoClient({chainID})
        const mo = '1000000000000000000'
        const result = lemo.tool.moToLemo(mo)
        assert.equal(result.toString(10), '1')
    })
    it('zero_number', function() {
        const lemo = new LemoClient({chainID})
        const mo = '0'
        const result = lemo.tool.moToLemo(mo)
        assert.equal(result.toString(10), '0')
    })
})

describe('lemoToMo', () => {
    it('is_float', function() {
        const lemo = new LemoClient({chainID})
        const ether = '0.1'
        const result = lemo.tool.lemoToMo(ether)
        assert.equal(result.toString(10), '100000000000000000')
    })
    it('bignumber', function() {
        const lemo = new LemoClient({chainID})
        const ether = '1'
        const result = lemo.tool.lemoToMo(ether)
        assert.equal(result.toString(10), '1000000000000000000')
    })
    it('zero_number', function() {
        const lemo = new LemoClient({chainID})
        const ether = '0'
        const result = lemo.tool.lemoToMo(ether)
        assert.equal(result.toString(10), '0')
    })
})
