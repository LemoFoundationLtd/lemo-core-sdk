import {assert} from 'chai'
import LemoClient from '../../lib/index'
import {txInfos, chainID, testPrivate, bigTxInfoWithLemoAddr, formattedTxRes1, formattedTxListRes, tx4, txInfo, testAddr} from '../datas'
import '../mock'
import {toBuffer} from '../../lib/utils'
import errors from '../../lib/errors'
import {TxType} from '../../lib/const'
import Tx from '../../lib/tx/tx'
import {DEFAULT_POLL_DURATION} from '../../lib/config'
import {encodeAddress} from '../../lib/crypto';

describe('module_tx_getTx', () => {
    it('getTx', async () => {
        const lemo = new LemoClient({chainID})
        const result = await lemo.tx.getTx('0x649d498473cccc6c42f8932c40095da05558411252136bfebf343d7c6ac263c5')
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
        const lemo = new LemoClient({chainID, httpTimeOut: 1000})
        lemo.tx.sendTx(testPrivate, tx4, true).catch(e => {
            return assert.equal(e.message, errors.InvalidPollTxTimeOut())
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
        const json = await lemo.tx.sign(testPrivate, bigTxInfoWithLemoAddr.txConfig)
        const result = await lemo.tx.send(json)
        assert.equal(result, bigTxInfoWithLemoAddr.hashAfterSign)
    })
    it('sign_without_chainID', async () => {
        const lemo = new LemoClient({chainID})
        const txConfigCopy = {...txInfos[1].txConfig}
        delete txConfigCopy.chainID
        let json = await lemo.tx.sign(testPrivate, txConfigCopy)
        json = JSON.parse(json)
        assert.equal(json.chainID, chainID)
        assert.equal(new Tx(json).hash(), txInfos[1].hashAfterSign)
    })
})

describe('module_tx_vote', () => {
    it('sign_vote', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const lemo = new LemoClient({chainID})
                let json = lemo.tx.signVote(testPrivate, test.txConfig)
                json = JSON.parse(json)
                assert.equal(json.type, TxType.VOTE, `index=${i}`)
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
                assert.equal(json.type, TxType.CANDIDATE, `index=${i}`)
                const result = JSON.stringify({...candidateInfo, isCandidate: String(candidateInfo.isCandidate)})
                assert.equal(toBuffer(json.data).toString(), result, `index=${i}`)
                assert.equal(json.to, undefined, `index=${i}`)
                assert.equal(json.toName, undefined, `index=${i}`)
                assert.equal(json.amount, 0, `index=${i}`)
            }),
        )
    })
})

describe('module_tx_create_asset', () => {
    it('sign_create_asset', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const lemo = new LemoClient({chainID})
                const createAssetInfo = {
                    category: 1,
                    decimal: 18,
                    isReplenishable: true,
                    isDivisible: true,
                    profile: {
                        name: 'Demo Asset',
                        symbol: 'DT',
                        description: 'demo asset',
                        suggestedGasLimit: '60000',
                    },
                }
                let json = lemo.tx.signCreateAsset(testPrivate, test.txConfig, createAssetInfo)
                json = JSON.parse(json)
                assert.equal(json.type, TxType.CREATE_ASSET, `index=${i}`)
                const result = JSON.stringify({...createAssetInfo, profile: {...createAssetInfo.profile, freeze: 'false'}})
                assert.equal(toBuffer(json.data).toString(), result, `index=${i}`)
                assert.equal(json.to, undefined, `index=${i}`)
                assert.equal(json.toName, undefined, `index=${i}`)
                assert.equal(json.amount, 0, `index=${i}`)
            }),
        )
    })
})

describe('module_tx_issue_asset', () => {
    it('sign_issue_asset', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const txConfig = {...test.txConfig}
                if (!txConfig.to) {
                    txConfig.to = '0x0000000000000000000000000000000000000001'
                }
                const lemo = new LemoClient({chainID})
                const issueAssetInfo = {
                    assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
                    metaData: 'issue asset metaData',
                    supplyAmount: '100000',
                }
                let json = lemo.tx.signIssueAsset(testPrivate, txConfig, issueAssetInfo)
                json = JSON.parse(json)
                assert.equal(json.type, TxType.ISSUE_ASSET, `index=${i}`)
                const result = JSON.stringify({...issueAssetInfo})
                assert.equal(toBuffer(json.data).toString(), result, `index=${i}`)
                assert.equal(json.toName, txConfig.toName, `index=${i}`)
                assert.equal(json.amount, 0, `index=${i}`)
            }),
        )
    })
})

describe('module_tx_replenish_asset', () => {
    it('sign_replenish_asset', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const lemo = new LemoClient({chainID})
                const replenishAssetInfo = {
                    assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
                    assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
                    replenishAmount: '100000',
                }
                let json = lemo.tx.signReplenishAsset(testPrivate, test.txConfig, replenishAssetInfo)
                json = JSON.parse(json)
                assert.equal(json.type, TxType.REPLENISH_ASSET, `index=${i}`)
                const result = JSON.stringify({...replenishAssetInfo})
                assert.equal(toBuffer(json.data).toString(), result, `index=${i}`)
                assert.equal(json.toName, test.txConfig.toName, `index=${i}`)
            }),
        )
    })
})

describe('module_tx_modify_asset', () => {
    it('sign_modify_asset', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const lemo = new LemoClient({chainID})
                const ModifyAssetInfo = {
                    assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
                    info: {
                        name: 'Demo Asset',
                        symbol: 'DT',
                        description: 'demo asset',
                    },
                }
                let json = lemo.tx.signModifyAsset(testPrivate, test.txConfig, ModifyAssetInfo)
                json = JSON.parse(json)
                assert.equal(json.type, TxType.MODIFY_ASSET, `index=${i}`)
                const result = JSON.stringify({...ModifyAssetInfo})
                assert.equal(toBuffer(json.data).toString(), result, `index=${i}`)
            }),
        )
    })
})

describe('module_tx_transfer_asset', () => {
    it('sign_transfer_asset', () => {
        const tests = [
            {...txInfos[0].txConfig, amount: 0},
            {...txInfos[1].txConfig, to: 'Lemobw'},
            {...txInfos[2].txConfig, amount: '117789804318558955305553166716194567721832259791707930541440413419507985'},
        ]
        return Promise.all(
            tests.map(async (test, i) => {
                const lemo = new LemoClient({chainID})
                const transferAsset = {
                    assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
                    transferAmount: '110000',
                }
                let json = lemo.tx.signTransferAsset(testPrivate, test, transferAsset)
                json = JSON.parse(json)
                assert.equal(json.type, TxType.TRANSFER_ASSET, `index=${i}`)
                const result = JSON.stringify({...transferAsset})
                assert.equal(toBuffer(json.data).toString(), result, `index=${i}`)
                assert.equal(json.to, test.to ? encodeAddress(test.to) : undefined, `index=${i}`)
                assert.equal(json.toName, test.toName, `index=${i}`)
            }),
        )
    })
})

describe('module_tx_watchTx', () => {
    it('watchTx', function itFunc(done) {
        this.timeout(DEFAULT_POLL_DURATION + 1000)
        const lemo = new LemoClient({chainID})
        const testConfig = {
            type: 0,
            version: 1,
            to: 'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY',
            toName: 'aa',
            message: 'aaa',
        }
        const watchTxId = lemo.tx.watchTx(testConfig, () => {
            lemo.tx.stopWatchTx(watchTxId)
            done()
        })
    })
})

describe('module_tx_signNoGas', () => {
    it('signNoGas_normal', () => {
        const lemo = new LemoClient({chainID})
        const txConfig = {
            ...txInfo.txConfig,
        }
        const noGasInfo = lemo.tx.signNoGas(testPrivate, txConfig, testAddr)
        assert.equal(JSON.parse(noGasInfo).type, txConfig.type)
        assert.equal(JSON.parse(noGasInfo).payer, testAddr)
        assert.equal(JSON.parse(noGasInfo).toName, txConfig.toName)
    })
})

describe('module_tx_signReimbursement', () => {
    it('signReimbursement_normal', () => {
        const lemo = new LemoClient({chainID})
        const noGasInfo = lemo.tx.signNoGas(testPrivate, txInfo.txConfig, testAddr)
        const result = lemo.tx.signReimbursement(testPrivate, noGasInfo, txInfo.txConfig.gasPrice, txInfo.txConfig.gasLimit)
        assert.equal(JSON.parse(result).gasPayerSig, txInfo.gasAfterSign)
        assert.equal(JSON.parse(result).gasLimit, txInfo.txConfig.gasLimit)
        assert.equal(JSON.parse(result).gasPrice, txInfo.txConfig.gasPrice)
    })
    it('signReimbursement_payer_error', () => {
        const lemo = new LemoClient({chainID})
        const payer = 'Lemo839J9N2H8QWS4JSSPCZZ4DTGGA9C8PC49YB8'
        const noGasInfo = lemo.tx.signNoGas(testPrivate, txInfo.txConfig, payer)
        assert.throws(() => {
            lemo.tx.signReimbursement(testPrivate, noGasInfo, txInfo.txConfig.gasPrice, txInfo.txConfig.gasLimit)
        }, errors.InvalidAddressConflict(payer))
    })
})
