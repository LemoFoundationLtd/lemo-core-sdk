import { assert } from 'chai'
import LemoClient from '../../lib/index'
import { testTx } from '../datas'

describe('getCurrentBlock', () => {

    it('currentBlock', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getCurrentBlock(true)
        assert.deepEqual(result, {
            ChangeLogs: [{
                address: "0x015780f8456f9c1532645087a19dcf9a7e0c7f97",
                extra: "",
                newValue: "0x8c052b7d2dcc80cd2e40000000",
                type: 1,
                version: 1
            }],
            ConfirmPackage: [],
            Events: [],
            Header: {
                changeLogRoot: "0x93273cebb4f0728991811d5d7c57ae8f88a83524eedb0af48b3061ed2e8017b8",
                eventRoot: "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
                extraData: "0x",
                gasLimit: "0x6422c40",
                gasUsed: "0x0",
                hash: "0x2f08cf8e56b14d6f1bcb92357942067fa738b54a2edaf89d731f2f50637a8841",
                height: 0,
                logsBloom: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                miner: "0x015780f8456f9c1532645087a19dcf9a7e0c7f97",
                parentHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
                signData: "0x",
                timestamp: "0x5b87dc40",
                transactionsRoot: "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
                versionRoot: "0x1e78c4779248d3d8d3cd9b77bf7b67b4c759ec87d45d52a3e79c928290773f4c"
            },
            Txs: []
        })
    })
    it('latestStableBlock', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getCurrentBlock(false)
        assert.deepEqual(result, {
            ChangeLogs: [{
                address: "0x015780f8456f9c1532645087a19dcf9a7e0c7f97",
                extra: "",
                newValue: "0x8c052b7d2dcc80cd2e40000000",
                type: 1,
                version: 1
            }],
            ConfirmPackage: [],
            Events: [],
            Header: {
                changeLogRoot: "0x93273cebb4f0728991811d5d7c57ae8f88a83524eedb0af48b3061ed2e8017b8",
                eventRoot: "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
                extraData: "0x",
                gasLimit: "0x6422c40",
                gasUsed: "0x0",
                hash: "0x2f08cf8e56b14d6f1bcb92357942067fa738b54a2edaf89d731f2f50637a8841",
                height: 0,
                logsBloom: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                miner: "0x015780f8456f9c1532645087a19dcf9a7e0c7f97",
                parentHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
                signData: "0x",
                timestamp: "0x5b87dc40",
                transactionsRoot: "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
                versionRoot: "0x1e78c4779248d3d8d3cd9b77bf7b67b4c759ec87d45d52a3e79c928290773f4c"
            },
            Txs: []
        })
    })

})

describe('getBlock', () => {
    it('getBlockByHash', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getBlock(testTx.hash)
        assert.equal(result, null)
    })
    it('getBlockByHeight', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getBlock(1)
        assert.equal(result, null)
    })
})

describe('getCurrentHeight', () => {
    it('currentHeight', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getCurrentHeight(true)
        assert.equal(result, 0)
    })
    it('latestStableHeight', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getCurrentHeight(false)
        assert.equal(result, 0)
    })
})

describe('getGenesis', () => {
    it('getGenesis', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getGenesis()
        assert.deepEqual(result, {
            ChangeLogs: [{
                address: "0x015780f8456f9c1532645087a19dcf9a7e0c7f97",
                extra: "",
                newValue: "0x8c052b7d2dcc80cd2e40000000",
                type: 1,
                version: 1
            }],
            ConfirmPackage: [],
            Events: [],
            Header: {
                changeLogRoot: "0x93273cebb4f0728991811d5d7c57ae8f88a83524eedb0af48b3061ed2e8017b8",
                eventRoot: "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
                extraData: "0x",
                gasLimit: "0x6422c40",
                gasUsed: "0x0",
                hash: "0x2f08cf8e56b14d6f1bcb92357942067fa738b54a2edaf89d731f2f50637a8841",
                height: 0,
                logsBloom: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                miner: "0x015780f8456f9c1532645087a19dcf9a7e0c7f97",
                parentHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
                signData: "0x",
                timestamp: "0x5b87dc40",
                transactionsRoot: "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
                versionRoot: "0x1e78c4779248d3d8d3cd9b77bf7b67b4c759ec87d45d52a3e79c928290773f4c"
            },
            Txs: []
        })
    })

})

describe('getChainID', () => {
    it('getChainID', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getChainID()
        assert.equal(result, '1')
    })
})

describe('getGasPriceAdvice', () => {
    it('getGasPriceAdvice', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getGasPriceAdvice()
        assert.equal(result, 100000000)
    })
})

describe('getNodeVersion', () => {
    it('getNodeVersion', async () => {
        const lemo = new LemoClient()
        const result = await lemo.getNodeVersion()
        assert.equal(result, '1.0')
    })
})

// describe('getSdkVersion', () => {
//     it('getSdkVersion', async () => {
//         const lemo = new LemoClient()
//         const result = await lemo.getSdkVersion()
//         console.log(result)
//         assert.equal(result, '0.9.0') // value is  undefined
//     })
// })

describe('watchBlock', () => {
    it('watchBlock false', async () => {
        const lemo = new LemoClient()
        const result = await lemo.watchBlock(false)
        assert.equal(result, 0)
    })
    it('watchBlock true', async () => {
        const lemo = new LemoClient()
        const result = await lemo.watchBlock(true)
        assert.equal(result, 0)
    })
})