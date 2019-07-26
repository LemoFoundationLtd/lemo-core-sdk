import {assert} from 'chai'
import LemoCore from '../../lib/index'
import {
    txInfos,
    chainID,
    testPrivate,
    bigTxInfoWithLemoAddr,
    formattedTxRes1,
    formattedTxListRes,
    tx4,
    txInfo,
    testAddr,
    emptyTxInfo,
    bigTxInfo,
} from '../datas'
import '../mock'
import {decodeUtf8Hex, toBuffer} from '../../lib/utils'
import errors from '../../lib/errors'
import {TxType} from '../../lib/const'
import Tx from '../../lib/tx/tx'
import {DEFAULT_POLL_DURATION} from '../../lib/config'
import {encodeAddress, decodeAddress} from '../../lib/crypto'

function parseHexObject(hex) {
    return JSON.parse(decodeUtf8Hex(hex))
}


describe('module_tx_sendTx', () => {
    it('sendTx_with_hex_address_waitConfirm', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const lemo = new LemoCore({chainID})
                const result = await lemo.tx.sendTx(testPrivate, test.txConfig)
                return assert.equal(result, test.hashAfterSign, `index=${i}`)
            }),
        )
    })
    it('sendTx_with_hex_address_timeOut', () => {
        const lemo = new LemoCore({chainID, httpTimeOut: 1000})
        lemo.tx.sendTx(testPrivate, tx4, true).catch(e => {
            return assert.equal(e.message, errors.InvalidPollTxTimeOut())
        })
    })
    it('sendTx_with_lemo_address_without_waitConfirm', async () => {
        const lemo = new LemoCore({chainID})
        const result = await lemo.tx.sendTx(testPrivate, bigTxInfoWithLemoAddr.txConfig)
        assert.equal(result, bigTxInfoWithLemoAddr.hashAfterSign)
    })
})

describe('module_tx_sign_send', () => {
    it('sign_send_with_hex_address', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const lemo = new LemoCore({chainID})
                const json = await lemo.tx.sign(testPrivate, test.txConfig)
                const result = await lemo.tx.send(json)
                assert.equal(result, test.hashAfterSign, `index=${i}`)
            }),
        )
    })
    it('sign_send_with_lemo_address', async () => {
        const lemo = new LemoCore({chainID})
        const json = await lemo.tx.sign(testPrivate, bigTxInfoWithLemoAddr.txConfig)
        const result = await lemo.tx.send(json)
        assert.equal(result, bigTxInfoWithLemoAddr.hashAfterSign)
    })
    it('sign_without_chainID', async () => {
        const lemo = new LemoCore({chainID})
        const txConfigCopy = {...txInfos[1].txConfig}
        delete txConfigCopy.chainID
        let json = await lemo.tx.sign(testPrivate, txConfigCopy)
        json = JSON.parse(json)
        assert.equal(json.chainID, chainID)
        assert.equal(new Tx(json).hash(), txInfos[1].hashAfterSign)
    })
})

describe('module_tx_waitConfirm', () => {
    it('sign_send_with_waitConfirm_narmal', async () => {
        const lemo = new LemoCore({chainID})
        const json = lemo.tx.sign(testPrivate, txInfo.txConfig)
        const txHash = await lemo.tx.send(json)
        const result = await lemo.tx.waitConfirm(txHash)
        assert.equal(result.data, txInfo.data)
    })
})


describe('module_tx_vote', () => {
    it('sign_vote', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const lemo = new LemoCore({chainID})
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
                const lemo = new LemoCore({chainID})
                const candidateInfo = {
                    isCandidate: true,
                    minerAddress: 'Lemobw',
                    nodeID:
                        '5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
                    host: '127.0.0.1',
                    port: '7001',
                    introduction: 'abcde',
                }
                let json = lemo.tx.signCandidate(testPrivate, test.txConfig, candidateInfo)
                json = JSON.parse(json)
                assert.equal(json.type, TxType.CANDIDATE, `index=${i}`)
                const result = JSON.stringify({...candidateInfo, isCandidate: String(candidateInfo.isCandidate)})
                assert.equal(toBuffer(json.data).toString(), result, `index=${i}`)
                assert.equal(json.to, undefined, `index=${i}`)
                assert.equal(json.toName, undefined, `index=${i}`)
            }),
        )
    })
})

describe('module_tx_create_asset', () => {
    it('sign_create_asset', () => {
        return Promise.all(
            txInfos.map(async (test, i) => {
                const lemo = new LemoCore({chainID})
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
                    txConfig.to = 'Lemo8888888888888888888888888888888888BW'
                }
                const lemo = new LemoCore({chainID})
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
                const lemo = new LemoCore({chainID})
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
                const lemo = new LemoCore({chainID})
                const ModifyAssetInfo = {
                    assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
                    updateProfile: {
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
                const lemo = new LemoCore({chainID})
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
        const lemo = new LemoCore({chainID})
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
        const lemo = new LemoCore({chainID})
        const txConfig = {
            ...txInfo.txConfig,
        }
        const noGasInfo = lemo.tx.signNoGas(testPrivate, txConfig, testAddr)
        assert.equal(JSON.parse(noGasInfo).type, txConfig.type)
        assert.equal(JSON.parse(noGasInfo).gasPayer, testAddr)
        assert.equal(JSON.parse(noGasInfo).toName, txConfig.toName)
    })
})

describe('module_tx_signReimbursement', () => {
    it('signReimbursement_normal', () => {
        const lemo = new LemoCore({chainID})
        const noGasInfo = lemo.tx.signNoGas(testPrivate, txInfo.txConfig, testAddr)
        const result = lemo.tx.signReimbursement(testPrivate, noGasInfo, txInfo.txConfig.gasPrice, txInfo.txConfig.gasLimit)
        assert.deepEqual(JSON.parse(result).gasPayerSigs, txInfo.gasAfterSign)
        assert.equal(JSON.parse(result).gasLimit, txInfo.txConfig.gasLimit)
        assert.equal(JSON.parse(result).gasPrice, txInfo.txConfig.gasPrice)
    })
    it('signReimbursement_payer_error', () => {
        const lemo = new LemoCore({chainID})
        const gasPayer = 'Lemo839J9N2H8QWS4JSSPCZZ4DTGGA9C8PC49YB8'
        const noGasInfo = lemo.tx.signNoGas(testPrivate, txInfo.txConfig, gasPayer)
        assert.throws(() => {
            lemo.tx.signReimbursement(testPrivate, noGasInfo, txInfo.txConfig.gasPrice, txInfo.txConfig.gasLimit)
        }, errors.InvalidAddressConflict(gasPayer))
    })
})

describe('module_tx_signCreateTempAddress', () => {
    it('signCreateTempAddress_normal', async () => {
        const lemo = new LemoCore({chainID})
        const userId = '0123456789'
        const result = await lemo.tx.signCreateTempAddress(testPrivate, txInfo.txConfig, userId)
        assert.equal(parseHexObject(JSON.parse(result).data).signers[0].address, txInfo.txConfig.from)
    })
    it('signCreateTempAddress_userID_short', async () => {
        const lemo = new LemoCore({chainID})
        const userId = '112'
        const result = await lemo.tx.signCreateTempAddress(testPrivate, txInfo.txConfig, userId)
        assert.equal(parseHexObject(JSON.parse(result).data).signers[0].address, txInfo.txConfig.from)
    })
    it('signCreateTempAddress_userID_long', () => {
        const lemo = new LemoCore({chainID})
        const userId = '100000000000000000002'
        assert.throws(() => {
            lemo.tx.signCreateTempAddress(testPrivate, txInfo.txConfig, userId)
        }, errors.TXInvalidUserIdLength())
    })
    it('signCreateTempAddress_contrast_from', async () => {
        const lemo = new LemoCore({chainID})
        const result = await lemo.tx.signCreateTempAddress(testPrivate, txInfo.txConfig, '0123456789')
        const codeAddress = decodeAddress(JSON.parse(result).to)
        const codeFrom = decodeAddress(txInfo.txConfig.from)
        assert.equal(codeAddress.slice(4, 22), codeFrom.substring(codeFrom.length - 18))
    })
})
describe('module_tx_boxTx', () => {
    it('boxTx_normal', async () => {
        const lemo = new LemoCore({chainID})
        // sign create Asset tx
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
        const createAsset = lemo.tx.signCreateAsset(testPrivate, emptyTxInfo.txConfig, createAssetInfo)
        // sign modify Asset tx
        const ModifyAssetInfo = {
            assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
            updateProfile: {
                name: 'Demo Asset',
                symbol: 'DT',
                description: 'demo asset',
            },
        }
        const modifyAsset = lemo.tx.signModifyAsset(testPrivate, bigTxInfo.txConfig, ModifyAssetInfo)
        // subTxInfo: one is string and the other is a object. Same expirationTime
        const subTxList = [createAsset, JSON.parse(modifyAsset)]
        const result = await lemo.tx.signBoxTx(testPrivate, txInfo.txConfig, subTxList)
        assert.deepEqual(JSON.parse(result).to, undefined)
        assert.deepEqual(parseHexObject(JSON.parse(result).data).subTxList[1], subTxList[1])
        assert.deepEqual(JSON.parse(result).expirationTime, subTxList[1].expirationTime)
    })
    it('boxTx_time_different', async () => {
        const lemo = new LemoCore({chainID})
        // sign replenish Asset tx
        const replenishAssetInfo = {
            assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
            assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
            replenishAmount: '100000',
        }
        const txConfig = {
            ...tx4,
            expirationTime: 1560513710327,
        }
        const replenishAsset = lemo.tx.signReplenishAsset(testPrivate, txConfig, replenishAssetInfo)
        // sign modify Asset tx
        const ModifyAssetInfo = {
            assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
            updateProfile: {
                name: 'Demo Asset',
                symbol: 'DT',
                description: 'demo asset',
            },
        }
        const modifyTxConfig = {
            ...bigTxInfo.txConfig,
            expirationTime: 1544584598,
        }
        const modifyAsset = lemo.tx.signModifyAsset(testPrivate, modifyTxConfig, ModifyAssetInfo)
        // subTxInfo: two data are object. expirationTime is different
        const subTxList = [replenishAsset, modifyAsset]
        const result = await lemo.tx.signBoxTx(testPrivate, txInfo.txConfig, subTxList)
        // Compare the size of the expirationTime within a transaction
        const time = parseHexObject(JSON.parse(result).data).subTxList.map(item => item.expirationTime)
        assert.deepEqual(JSON.parse(result).expirationTime, Math.min(...time).toString())
    })
    it('box_tx_include_box', () => {
        const lemo = new LemoCore({chainID})
        // sign temp address
        const tempAddress = lemo.tx.signCreateTempAddress(testPrivate, txInfo.txConfig, '01234567')
        // sign ordinary tx
        const ordinary = lemo.tx.sign(testPrivate, emptyTxInfo.txConfig)
        const subTxList = [tempAddress, ordinary]
        // first sign box Tx
        const boxTx = lemo.tx.signBoxTx(testPrivate, txInfo.txConfig, subTxList)
        const subTxLists = [tempAddress, ordinary, boxTx]
        assert.throws(() => {
            // two sign box Tx
            lemo.tx.signBoxTx(testPrivate, txInfo.txConfig, subTxLists)
        }, errors.InvalidBoxTransaction())
    })
})

describe('module_tx_Contract_creation', () => {
    // normal
    it('Contract_creation_normal', () => {
        const lemo = new LemoCore({chainID})
        const codeHex = '0x1003330000001'
        const constructorArgsHex = '0x000000001'
        const result = lemo.tx.signContractCreation(testPrivate, txInfo.txConfig, codeHex, constructorArgsHex)
        assert.deepEqual(JSON.parse(result).type, TxType.CREATE_CONTRACT.toString())
        assert.deepEqual(JSON.parse(result).data.slice(0, codeHex.length), codeHex)
        const data = JSON.parse(result).data
        assert.deepEqual(data.slice(codeHex.length, data.length), constructorArgsHex.slice(2))
    })
    // Code starts with 0x, but it's not hex, constructorArgsHex is the same
    it('Contract_creation_code_noHex', () => {
        const lemo = new LemoCore({chainID})
        const codeHex = '0x000gbfdfggh000001'
        const constructorArgsHex = '0x000000001'
        assert.throws(() => {
            lemo.tx.signContractCreation(testPrivate, txInfo.txConfig, codeHex, constructorArgsHex)
        }, errors.TXMustBeNumber('codeHex', '0x000gbfdfggh000001'))
    })
    // codeHex is number
    it('Contract_creation_code_number', () => {
        const lemo = new LemoCore({chainID})
        const codeHex = 23455467
        const constructorArgsHex = '0x000000001'
        assert.throws(() => {
            lemo.tx.signContractCreation(testPrivate, txInfo.txConfig, codeHex, constructorArgsHex)
        }, errors.TXInvalidType('codeHex', 23455467, ['string']))
    })
})
describe('module_tx_modify_signer', () => {
    // normal
    it('Contract_creation_normal', () => {
        const lemo = new LemoCore({chainID})
        const signers = [{
            address: testAddr,
            weight: 50,
        }, {
            address: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
            weight: 60,
        }]
        let result = lemo.tx.signModifySigners(testPrivate, txInfo.txConfig, signers)
        result = JSON.parse(result)
        const signerData = parseHexObject(result.data)
        assert.equal(result.type, TxType.MODIFY_SIGNER.toString())
        assert.deepEqual(signerData.signers, signers)
    })
    // no address
    it('Contract_creation_no_address', () => {
        const lemo = new LemoCore({chainID})
        const signers = [{
            address: testAddr,
            weight: 50,
        }, {
            address: '',
            weight: 60,
        }]
        assert.throws(() => {
            lemo.tx.signModifySigners(testPrivate, txInfo.txConfig, signers)
        }, errors.InvalidAddress(''))
    })
    // no weight
    it('Contract_creation_no_weight', () => {
        const lemo = new LemoCore({chainID})
        const signers = [{
            address: testAddr,
        }, {
            address: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
            weight: 60,
        }]
        assert.throws(() => {
            lemo.tx.signModifySigners(testPrivate, txInfo.txConfig, signers)
        }, errors.TXInvalidType('signers[0].weight', undefined, ['number']))
    })
})
