import {assert} from 'chai'
import LemoClient from '../../lib/index'
import {txInfos, chainID, testPrivate, bigTxInfoWithLemoAddr, formattedTxRes1, formattedTxListRes, tx4} from '../datas'
import '../mock'
import {toBuffer} from '../../lib/utils'
import errors from '../../lib/errors'

describe('module_tx_getTx', () => {
    it('getTx', async () => {
        const lemo = new LemoClient({chainID})
        const result = await lemo.tx.getTx('0xcf9980d6f08763686d30d05afa50ac696397de5e41ae41c890ec8cd3426ed157')
        assert.deepEqual(result, formattedTxRes1)
    })
    it('getTx not exist', async () => {
        const lemo = new LemoClient({chainID})
        const result = await lemo.tx.getTx('0x28ee2b4622946e35c3e761e826d18d95c319452efe23ce6844f14de3ece95b5e')
        assert.equal(result, null)
    })
})

describe('module_tx_getTxListByAddress', () => {
    it('got 3 txs', async () => {
        const lemo = new LemoClient({chainID})
        const result = await lemo.tx.getTxListByAddress('Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', 0, 10)
        assert.deepEqual(result, formattedTxListRes)
    })
    it('got 1 tx', async () => {
        const lemo = new LemoClient({chainID})
        const result = await lemo.tx.getTxListByAddress('Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', 0, 1)
        assert.equal(result.txList.length, 1)
    })
    it('got 0 tx', async () => {
        const lemo = new LemoClient({chainID})
        const result = await lemo.tx.getTxListByAddress('Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', 0, 0)
        assert.equal(result.txList.length, 0)
    })
    it('get from empty account', async () => {
        const lemo = new LemoClient({chainID})
        const result = await lemo.tx.getTxListByAddress('Lemobw', 0, 10)
        assert.equal(result.txList.length, 0)
    })
})

describe('module_tx_sendTx', () => {
    it('sendTx_with_hex_address_without_waitConfirm', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const lemo = new LemoClient({chainID})
                const result = await lemo.tx.sendTx(testPrivate, test.txConfig, false)
                return assert.equal(result, test.hashAfterSign, `index=${i}`)
            }),
        )
    })
    it('sendTx_with_hex_address_waitConfirm', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const lemo = new LemoClient({chainID})
                const result = await lemo.tx.sendTx(testPrivate, test.txConfig, true)
                return assert.equal(result, test.hashAfterSign, `index=${i}`)
            }),
        )
    })
    it('sendTx_with_hex_address_timeOut', () => {
        const lemo = new LemoClient({chainID})
        lemo.tx.sendTx(testPrivate, tx4.txConfig, true).catch(e => {
            return assert.equal(e, errors.InvalidPollTxTimeOut())
        })
    })
    it('sendTx_with_lemo_address_without_waitConfirm', async () => {
        const lemo = new LemoClient({chainID})
        const result = await lemo.tx.sendTx(testPrivate, bigTxInfoWithLemoAddr.txConfig, false)
        assert.equal(result, bigTxInfoWithLemoAddr.hashAfterSign)
    })
})

describe('module_tx_sign_send', () => {
    it('sign_send_with_hex_address', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const lemo = new LemoClient({chainID})
                const json = await lemo.tx.sign(testPrivate, test.txConfig)
                const result = await lemo.tx.send(json)
                assert.equal(result, test.hashAfterSign, `index=${i}`)
            }),
        )
    })
    it('sign_send_with_lemo_address', async () => {
        const lemo = new LemoClient({chainID})
        const json = await lemo.tx.sign(testPrivate, bigTxInfoWithLemoAddr.txConfig, false)
        const result = await lemo.tx.send(json)
        assert.equal(result, bigTxInfoWithLemoAddr.hashAfterSign)
    })
})

describe('module_tx_vote', () => {
    it('sign_vote', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const lemo = new LemoClient({chainID})
                let json = lemo.tx.signVote(testPrivate, test.txConfig)
                json = JSON.parse(json)
                assert.equal(parseInt(json.v, 16) & 0x1000000, 0x1000000, `index=${i}`)
                assert.equal(json.amount, 0, `index=${i}`)
                assert.equal(json.data, undefined, `index=${i}`)
            }),
        )
    })
})

describe('module_tx_candidate', () => {
    it('sign_candidate', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const lemo = new LemoClient({chainID})
                const candidateInfo = {
                    isCandidate: true,
                    minerAddress: 'Lemobw',
                    nodeID:
                        '5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
                    host: '127.0.0.1',
                    port: '7001',
                }
                let json = lemo.tx.signCandidate(testPrivate, test.txConfig, candidateInfo)
                json = JSON.parse(json)
                assert.equal(parseInt(json.v, 16) & 0x2000000, 0x2000000, `index=${i}`)
                const result = JSON.stringify({...candidateInfo, isCandidate: String(candidateInfo.isCandidate)})
                assert.equal(toBuffer(json.data).toString(), result, `index=${i}`)
                assert.equal(json.to, undefined, `index=${i}`)
                assert.equal(json.toName, undefined, `index=${i}`)
                assert.equal(json.amount, 0, `index=${i}`)
            }),
        )
    })
})
