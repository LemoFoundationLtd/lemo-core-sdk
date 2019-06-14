import {assert} from 'chai'
import {testAddr, txInfo, formattedSpecialLemoBase, miner} from '../../datas'
import GasTx from '../../../lib/tx/special_tx/gas_tx'

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
        const tx = new GasTx(txConfig, payer)
        assert.equal(tx.gasPayer, miner.address)
    })
})
