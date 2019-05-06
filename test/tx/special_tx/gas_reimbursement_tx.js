import {assert} from 'chai'
import LemoClient from '../../../lib/index'
import {chainID, testAddr, testPrivate, txInfo} from '../../datas'
import GasReimbursementTx from '../../../lib/tx/special_tx/gas_reimbursement_tx'
import errors from '../../../lib/errors'

describe('GasReimbursementTx_new', () => {
    const lemo = new LemoClient(chainID)
    const noGasInfo = lemo.tx.signNoGas(testPrivate, txInfo.txConfig, testAddr)
    const info = JSON.parse(noGasInfo)
    it('normal', () => {
        const tx = new GasReimbursementTx(info, txInfo.txConfig.gasPrice, txInfo.txConfig.gasLimit)
        assert.equal(tx.gasLimit, txInfo.txConfig.gasLimit)
        assert.equal(tx.amount.toString(), info.amount)
        assert.equal(tx.payer, undefined)
    })
})
describe('other gasPrice', () => {
    const lemo = new LemoClient(chainID)
    const noGasInfo = lemo.tx.signNoGas(testPrivate, txInfo.txConfig, testAddr)
    const info = JSON.parse(noGasInfo)
    const tests = [
        {filed: 'gasPrice', configData: 1},
        {filed: 'gasPrice', configData: 0x1001},
        {filed: 'gasPrice', configData: '1001'},
        {filed: 'gasPrice', configData: '0x10011', result: '65553'},
        {filed: 'gasPrice', configData: '', error: errors.TXMustBeNumber('gasPrice', '')},
        {filed: 'gasPrice', configData: -1010, error: errors.TXNegativeError('gasPrice')},
        {filed: 'gasPrice', configData: '-1000', error: errors.TXMustBeNumber('gasPrice', '-1000')},
        {filed: 'gasPrice', configData: 'abcde', error: errors.TXMustBeNumber('gasPrice', 'abcde')},
    ]
    tests.forEach(test => {
        it(`when ${test.field} is ${test.configData}`, () => {
            if (test.error) {
                assert.throws(() => {
                    new GasReimbursementTx(info, test.configData, txInfo.txConfig.gasLimit)
                }, test.error)
            } else if (test.result) {
                const tx = new GasReimbursementTx(info, test.configData, txInfo.txConfig.gasLimit)
                assert.strictEqual(tx.gasPrice.toString(), test.result)
            } else {
                const tx = new GasReimbursementTx(info, test.configData, txInfo.txConfig.gasLimit)
                assert.strictEqual(tx.gasPrice.toString(), test.configData.toString())
            }
        })
    })
})
describe('other gasLimit', () => {
    const lemo = new LemoClient(chainID)
    const noGasInfo = lemo.tx.signNoGas(testPrivate, txInfo.txConfig, testAddr)
    const info = JSON.parse(noGasInfo)
    const tests = [
        {filed: 'gasLimit', configData: 1},
        {filed: 'gasLimit', configData: 0x1001},
        {filed: 'gasLimit', configData: '', error: errors.TXMustBeNumber('gasLimit', '')},
        {filed: 'gasLimit', configData: -1011, error: errors.TXNegativeError('gasLimit', 'abcde')},
        {filed: 'gasLimit', configData: '-1001', error: errors.TXMustBeNumber('gasLimit', '-1001')},
        {filed: 'gasLimit', configData: 'abcde', error: errors.TXMustBeNumber('gasLimit', 'abcde')},
    ]
    tests.forEach(test => {
        it(`when ${test.field} is ${test.configData}`, () => {
            if (test.error) {
                assert.throws(() => {
                    new GasReimbursementTx(info, txInfo.txConfig.gasPrice, test.configData)
                }, test.error)
            } else if (test.result) {
                const tx = new GasReimbursementTx(info, txInfo.txConfig.gasPrice, test.configData)
                console.log(tx)
                assert.strictEqual(tx.gasLimit.toString(), test.result)
            } else {
                const tx = new GasReimbursementTx(info, txInfo.txConfig.gasPrice, test.configData)
                assert.strictEqual(tx.gasLimit.toString(), test.configData.toString())
            }
        })
    })
})
