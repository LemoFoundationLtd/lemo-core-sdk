import {assert} from 'chai'
import {testAddr, txInfo, formattedSpecialLemoBase} from '../../datas'
import GasTx from '../../../lib/tx/special_tx/gas_tx'
import errors from '../../../lib/errors'

describe('GasTx_new', () => {
    const txConfig = {
        ...txInfo.txConfig,
    }
    it('payer is LemoAddress', () => {
        const tx = new GasTx(txConfig, testAddr)
        assert.equal(tx.gasLimit, txConfig.gasLimit)
        assert.equal(tx.data, txConfig.data)
        assert.equal(tx.gasPayer, testAddr)
    })
    it('no payer', () => {
        const tx = new GasTx(txConfig)
        assert.equal(tx.gasPayer, '')
    })
    it('payer is encodeAddress', () => {
        const payer = formattedSpecialLemoBase.address
        assert.throws(() => {
            new GasTx(txConfig, payer)
        }, errors.InvalidAddress(payer))
    })
})
