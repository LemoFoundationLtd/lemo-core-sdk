import {Buffer} from 'safe-buffer'
import {TxType, CreateAssetType} from '../../const'
import Tx from '../tx'
import {verifyCreateAssetInfo} from '../tx_helper'

export default class CreateAssetTx extends Tx {
    /**
     * 创建资产的交易
     * @param {object} txConfig
     * @param {number?} txConfig.type The type of transaction
     * @param {number?} txConfig.version The version of transaction protocol
     * @param {number} txConfig.chainID The LemoChain id
     * @param {number|string?} txConfig.gasPrice Gas price for smart contract. Unit is mo/gas
     * @param {number|string?} txConfig.gasLimit Max gas limit for smart contract. Unit is gas
     * @param {Buffer|string?} txConfig.data Extra data or smart contract calling parameters
     * @param {number|string?} txConfig.expirationTime Default value is half hour from now
     * @param {string?} txConfig.message Extra value data
     * @param {Buffer|string?} txConfig.sig Signature data
     * @param {object} createAssetInfo CreateAsset information
     * @param {number} createAssetInfo.category 资产类型，如CreateAssetType的TokenAsset、NonFungibleAsset、CommonAsset等
     * @param {number} createAssetInfo.decimals 发行资产的小数位，默认为18位
     * @param {boolean} createAssetInfo.isReplenishable 是否可增发
     * @param {boolean} createAssetInfo.isDivisible  是否为可分割资产
     * @param {object} createAssetInfo.profile 资产信息
     * @param {string} createAssetInfo.profile.name 资产名字
     * @param {string} createAssetInfo.profile.symbol 资产标识，默认转为大写字符
     * @param {string} createAssetInfo.profile.description 资产基本信息
     * @param {string} createAssetInfo.profile.suggestedGasLimit 建议的gasLimit
     */
    constructor(txConfig, createAssetInfo) {
        verifyCreateAssetInfo(createAssetInfo)
        const newCreateAsset = {
            category: createAssetInfo.category === undefined ? CreateAssetType.TokenAsset : createAssetInfo.category,
            decimals: createAssetInfo.decimals === undefined ? 18 : createAssetInfo.decimals,
            isReplenishable: createAssetInfo.isReplenishable === undefined ? true : createAssetInfo.isReplenishable,
            isDivisible: createAssetInfo.isDivisible === undefined ? true : createAssetInfo.isDivisible,
            profile: {
                name: createAssetInfo.profile.name,
                symbol: createAssetInfo.profile.symbol.toUpperCase(),
                description: createAssetInfo.profile.description,
                suggestedGasLimit: createAssetInfo.profile.suggestedGasLimit || '60000',
                stop: 'false',
            },
        }

        const newTxConfig = {
            ...txConfig,
            type: TxType.CREATE_ASSET,
            data: Buffer.from(JSON.stringify(newCreateAsset)),
        }
        delete newTxConfig.to
        delete newTxConfig.toName
        delete newTxConfig.amount
        super(newTxConfig)
    }
}
