import {Buffer} from 'safe-buffer'
import BigNumber from 'bignumber.js'
import {TxType} from '../../const'
import Tx from '../tx'
import {verifyTradingAssetInfo} from '../tx_helper'

export default class TradingAsset extends Tx {
    /**
     * 交易资产的交易
     * @param {object} txConfig
     * @param {number?} txConfig.type The type of transaction
     * @param {string?} txConfig.to The transaction recipient address
     * @param {number?} txConfig.version The version of transaction protocol
     * @param {number} txConfig.chainID The LemoChain id
     * @param {number|string?} txConfig.gasPrice Gas price for smart contract. Unit is mo/gas
     * @param {number|string?} txConfig.gasLimit Max gas limit for smart contract. Unit is gas
     * @param {Buffer|string?} txConfig.data Extra data or smart contract calling parameters
     * @param {number|string?} txConfig.expirationTime Default value is half hour from now
     * @param {string?} txConfig.message Extra value data
     * @param {Buffer|string?} txConfig.sig Signature data
     * @param {object} tradingAssetInfo TradingAsset information
     * @param {number} tradingAssetInfo.value 交易数量,值为bigNumber
     * @param {string} tradingAssetInfo.input 执行智能合约的数据
     */
    constructor(txConfig, tradingAssetInfo) {
        verifyTradingAssetInfo(tradingAssetInfo)
        const newTradingAsset = {
            metaData: tradingAssetInfo.metaData,
            amount: new BigNumber(tradingAssetInfo.amount),
        }

        const newTxConfig = {
            ...txConfig,
            type: TxType.TRADING_ASSET,
            data: Buffer.from(JSON.stringify(newTradingAsset)),
        }
        delete newTxConfig.toName
        delete newTxConfig.amount
        super(newTxConfig)
    }
}
