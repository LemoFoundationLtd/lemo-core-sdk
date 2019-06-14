import {assert} from 'chai'
import errors from '../../../lib/errors'
import {chainID, from} from '../../datas'
import ContractCreationTx from '../../../lib/tx/special_tx/contract_creation_tx'

describe('Contract_creation_tx', () => {
    const testCode = [
        {field: 'code', input: '0x000000100000100', output: '0x000000100000100'},
        {field: 'code', input: '0xc27e68963c219c3240c7767105e1b03c001c02eb42feb116ecbf4', output: '0xc27e68963c219c3240c7767105e1b03c001c02eb42feb116ecbf4'},
        {field: 'code', input: 0x2300000010a, output: [], error: errors.TXInvalidType('code', 0x2300000010aa, ['string'])},
        {field: 'code', input: 123342545, output: [], error: errors.TXInvalidType('code', 123342545, ['string'])},
    ]
    testCode.forEach(test => {
        it(`the ${test.field} is ${test.input}`, () => {
            const code = test.input
            const constructorArgs = '0x000000001'
            if (test.error) {
                assert.throws(() => {
                    new ContractCreationTx({chainID, from}, code, constructorArgs)
                }, test.error)
            } else {
                const result = new ContractCreationTx({chainID, from}, code, constructorArgs)
                assert.deepEqual(result.data.slice(0, code.length), test.output)
            }
        })
    })
    const testConstructorArgs = [
        {field: 'constructorArgs', input: '0x000000100000100', output: '0x000000100000100'},
        {field: 'constructorArgs', input: '0xc27e68963c219c3240c7767105e1b03c001c02eb42feb116ecbf4', output: '0xc27e68963c219c3240c7767105e1b03c001c02eb42feb116ecbf4'},
        {field: 'constructorArgs', input: 0xa2135932fd, output: [], error: errors.TXInvalidType('constructorArgs', 0xa2135932fd, ['string'])},
        {field: 'constructorArgs', input: 245547200000001, output: [], error: errors.TXInvalidType('constructorArgs', 245547200000001, ['string'])},
    ]
    testConstructorArgs.forEach(test => {
        it(`the ${test.field} is ${test.input}`, () => {
            const code = '0x000000001'
            const constructorArgs = test.input
            if (test.error) {
                assert.throws(() => {
                    new ContractCreationTx({chainID, from}, code, constructorArgs)
                }, test.error)
            } else {
                const result = new ContractCreationTx({chainID, from}, code, constructorArgs)
                assert.deepEqual(result.data.slice(code.length, result.data.length), test.output.slice(2))
            }
        })
    })
})
