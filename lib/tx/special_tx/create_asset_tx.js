import {Buffer} from 'safe-buffer'
import {TxType} from '../../const'
import Tx from '../tx'

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
     * @param {number} createAssetInfo.category 资产类型
     * @param {string} createAssetInfo.assetCode 资产的唯一标识
     * @param {number} createAssetInfo.decimals 发行资产的小数位
     * @param {number} createAssetInfo.totalSupply 当前发行资产的总数量
     * @param {boolean} createAssetInfo.isReplenishable 是否可增发
     * @param {boolean} createAssetInfo.isDivisible  是否为可分割资产
     * @param {string} createAssetInfo.issuer 发行者地址
     * @param {object} createAssetInfo.profile 资产信息
     * @param {string} createAssetInfo.profile.name 资产名字
     * @param {string} createAssetInfo.profile.symbol 资产标识
     * @param {string} createAssetInfo.profile.description 资产基本信息
     * @param {string} createAssetInfo.profile.stop 是否冻结此资产
     * @param {string} createAssetInfo.profile.suggestedGasLimit 建议的gasLimit
     */
    constructor(txConfig, createAssetInfo) {
        const newCreateAsset = {
            category: createAssetInfo.category,
            assetCode: createAssetInfo.assetCode,
            decimals: createAssetInfo.decimals,
            totalSupply: createAssetInfo.totalSupply,
            isReplenishable: createAssetInfo.isReplenishable,
            isDivisible: createAssetInfo.isDivisible,
            issuer: createAssetInfo.issuer,
            profile: {
                name: createAssetInfo.profile.name,
                symbol: createAssetInfo.profile.symbol,
                description: createAssetInfo.profile.description,
                stop: createAssetInfo.profile.stop,
                suggestedGasLimit: createAssetInfo.profile.suggestedGasLimit,
            },
        }

        const newTxConfig = {
            ...txConfig,
            type: TxType.CREATEASSET,
            data: Buffer.from(JSON.stringify(newCreateAsset)),
        }
        delete newTxConfig.to
        delete newTxConfig.toName
        delete newTxConfig.amount
        super(newTxConfig)
    }
}
