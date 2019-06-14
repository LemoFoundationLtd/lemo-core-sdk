import {assert} from 'chai'
import errors from '../../../lib/errors'
import {chainID, from} from '../../datas'
import ContractCreationTx from '../../../lib/tx/special_tx/contract_creation_tx'

describe('Contract_creation_tx', () => {
    const testCode = [
        {field: 'codeHex', input: '0x000000100000100', output: '0x000000100000100'},
        {field: 'codeHex', input: '0xc27e68963c219c3240c7767105e1b03c001c02eb42feb116ecbf4', output: '0xc27e68963c219c3240c7767105e1b03c001c02eb42feb116ecbf4'},
        {field: 'codeHex', input: 0x2300000010a, output: [], error: errors.TXInvalidType('codeHex', 0x2300000010aa, ['string'])},
        {field: 'codeHex', input: 123342545, output: [], error: errors.TXInvalidType('codeHex', 123342545, ['string'])},
    ]
    testCode.forEach(test => {
        it(`the ${test.field} is ${test.input}`, () => {
            const codeHex = test.input
            const constructorArgsHex = '0x000000001'
            if (test.error) {
                assert.throws(() => {
                    new ContractCreationTx({chainID, from}, codeHex, constructorArgsHex)
                }, test.error)
            } else {
                const result = new ContractCreationTx({chainID, from}, codeHex, constructorArgsHex)
                assert.deepEqual(result.data.slice(0, codeHex.length), test.output)
            }
        })
    })
    const testConstructorArgs = [
        {field: 'constructorArgsHex', input: '0x000000100000100', output: '0x000000100000100'},
        {field: 'constructorArgsHex', input: '0xc27e68963c219c3240c7767105e1b03c001c02eb42feb116ecbf4', output: '0xc27e68963c219c3240c7767105e1b03c001c02eb42feb116ecbf4'},
        {field: 'constructorArgsHex', input: 0xa2135932fd, output: [], error: errors.TXInvalidType('constructorArgsHex', 0xa2135932fd, ['string'])},
        {field: 'constructorArgsHex', input: 245547200000001, output: [], error: errors.TXInvalidType('constructorArgsHex', 245547200000001, ['string'])},
    ]
    testConstructorArgs.forEach(test => {
        it(`the ${test.field} is ${test.input}`, () => {
            const codeHex = '0x000000001'
            const constructorArgsHex = test.input
            if (test.error) {
                assert.throws(() => {
                    new ContractCreationTx({chainID, from}, codeHex, constructorArgsHex)
                }, test.error)
            } else {
                const result = new ContractCreationTx({chainID, from}, codeHex, constructorArgsHex)
                assert.deepEqual(result.data.slice(codeHex.length, result.data.length), test.output.slice(2))
            }
        })
    })
})
