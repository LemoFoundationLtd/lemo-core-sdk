import {Buffer} from 'safe-buffer'
import {TxType} from '../../const'
import Tx from '../tx'
import {verifyCandidateInfo} from '../tx_helper'

export default class CandidateTx extends Tx {
    /**
     * Create a unsigned special transaction register or edit candidate information
     * @param {object} txConfig
     * @param {number?} txConfig.type The type of transaction. 0: normal
     * @param {number?} txConfig.version The version of transaction protocol
     * @param {number} txConfig.chainID The LemoChain id
     * @param {number|string?} txConfig.gasPrice Gas price for smart contract. Unit is mo/gas
     * @param {number|string?} txConfig.gasLimit Max gas limit for smart contract. Unit is gas
     * @param {Buffer|string?} txConfig.data Extra data or smart contract calling parameters
     * @param {number|string?} txConfig.expirationTime Default value is half hour from now
     * @param {string?} txConfig.message Extra value data
     * @param {Buffer|string?} txConfig.sig Signature data
     * @param {object} candidateInfo Candidate information
     * @param {boolean?} candidateInfo.isCandidate Set this account to be or not to be a candidate
     * @param {string} candidateInfo.minerAddress The address of miner account who receive miner benefit
     * @param {string} candidateInfo.nodeID The public key of the keypair which used to sign block
     * @param {string} candidateInfo.host Ip or domain of the candidate node server
     * @param {number|string} candidateInfo.port Port of the candidate node server
     */
    constructor(txConfig, candidateInfo) {
        verifyCandidateInfo(candidateInfo)
        const newCandidateInfo = {
            isCandidate: typeof candidateInfo.isCandidate === 'undefined' ? 'true' : String(candidateInfo.isCandidate),
            minerAddress: candidateInfo.minerAddress,
            nodeID: candidateInfo.nodeID,
            host: candidateInfo.host,
            port: candidateInfo.port,
        }

        const newTxConfig = {
            ...txConfig,
            type: TxType.CANDIDATE,
            data: Buffer.from(JSON.stringify(newCandidateInfo)),
        }
        delete newTxConfig.to
        delete newTxConfig.toName
        delete newTxConfig.amount
        super(newTxConfig)
    }
}
