import {assert} from 'chai'
import LemoClient from '../../lib/index'
import {chainID} from '../datas'

describe('module_tool_verifyAddress', () => {
    const tests = [
        {input: 'Lemo', output: 'Invalid address checksum LEMO'},
        {input: 'Lemo8', output: 'Invalid address checksum LEMO8'},
        {input: 'LemoBW', output: ''},
        {input: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG', output: ''},
        {input: 'lemo83gn72gyh2nz8ba729z9tct7kq5fc3cr6djg', output: ''},
        {input: 'Lemo03GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG', output: 'Non-base26 character'},
        {input: 'Lemo33GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG', output: 'Invalid address checksum LEMO33GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG'},
        {input: '123', output: 'Invalid LemoChain address 123'},
        {input: '0x', output: ''},
        {input: '0x1', output: ''},
        {input: '0x015780f8456f9c1532645087a19dcf9a7e0c7f97', output: ''},
        {input: '0X015780F8456F9C1532645087A19DCF9A7E0C7F97', output: ''},
        {input: '0x015780f8456f9c1532645087a19dcf9a7e0c7f97111', output: 'Invalid hex address 0x015780f8456f9c1532645087a19dcf9a7e0c7f97111'},
        {input: 0x1, output: 'Invalid type of address 1, got number, expect string'},
    ]

    tests.forEach(({input, output}, i) => {
        const lemo = new LemoClient({chainID})
        it(`address ${i}`, async () => {
            const errMsg = await lemo.tool.verifyAddress(input)
            return assert.equal(errMsg, output, `index=${i}`)
        })
    })
})
