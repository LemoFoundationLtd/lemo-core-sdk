import BigNumber from 'bignumber.js'

const bigNum = '0x111111111111111111111111111111111111111111111111111111111111'
const bigString = '888888888888888888888888888888888888888888888888888888888888'
const bigData = '0x4949494949494949'

export const testPrivate = '0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb'
export const testAddr = 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'
export const currentHeight = 2
export const chainID = 200
export const HxGasPriceAdvice = '0x5f5e100'
export const nodeVersion = '1.0.0'
export const isMining = false
export const peersCount = '0'
export const infos = {
    nodeName: 'Lemo',
    nodeVersion: '1.0.0',
    os: 'windows-amd64',
    port: '7001',
    runtime: 'go1.9.2',
}

export const emptyAccount = {
    balance: '0x0',
    codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    records: {},
    root: '0x0000000000000000000000000000000000000000000000000000000000000000',
}

export const miner = {
    address: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
    balance: '1599999999999999999999999900',
    codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    records: {
        1: {
            height: '1',
            version: '3',
        },
    },
    root: '0x0000000000000000000000000000000000000000000000000000000000000000',
    txCount: '0',
    candidate: {
        profile: {
            host: '127.0.0.1',
            isCandidate: 'true',
            minerAddress: 'Lemobw',
            nodeID:
                '5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
            port: '7001',
        },
        votes: '1599999000000000000000000000',
    },
    voteFor: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
}
export const formatedMiner = {
    ...miner,
    balance: new BigNumber('1599999999999999999999999900'),
    records: {
        BalanceLog: {
            height: 1,
            version: 3,
        },
    },
    candidate: {
        profile: {
            ...miner.candidate.profile,
            isCandidate: true,
            port: 7001,
        },
        votes: '1599999000',
    },
    txCount: 0,
}
export const formattedSpecialLemoBase = {
    ...emptyAccount,
    address: '0x015780F8456F9c1532645087a19DcF9a7e0c7F97',
    balance: new BigNumber('0'),
    txCount: 0,
}
export const formattedNotExistLemoBase = {
    ...emptyAccount,
    address: '0x1234567890123456789012345678901234567890',
    balance: new BigNumber('0'),
    txCount: 0,
}

// empty tx
export const emptyTxInfo = {
    txConfig: {
        chainID,
        expirationTime: 1544584596,
    },
    rlp: '0xd8800181c8808084b2d05e00831e84808080845c107d948080',
    hash: '0x13dd44355f872cda26cf08d42084793f9b6b6c2129e8d70a73c1c8fa62cf7f05',
    rlpAfterSign:
        '0xf85a800181c8808084b2d05e00831e84808080845c107d9480b84101f642fbc4588fbab945a6db57381fb756221607c96f5519c5f5092ca212b454e7529b1c78da1927bc99d07f0b0f3e18442b6d911ce71a45a6f0da101e84b88e3c',
    hashAfterSign: '0x6a8bdc73a46dd8cff224ffd7bbf1f237c7721b81f923edd5864f38bedecd2787',
}

// normal tx
export const txInfo = {
    txConfig: {
        chainID,
        version: 1,
        type: 0,
        to: '0x000000000000000000000001',
        toName: 'aa',
        gasPrice: 2,
        gasLimit: 100,
        amount: 1,
        data: '0x0c',
        expirationTime: 1544584596,
        message: 'aaa',
    },
    rlp: '0xea800181c89400000000000000000000000000000000000000018261610264010c845c107d948361616180',
    hash: '0x07bbd852209e19dc477b37fcf54d77c1cccfc65af67cd1b9203d18bc19f08024',
    rlpAfterSign:
        '0xf86c800181c89400000000000000000000000000000000000000018261610264010c845c107d9483616161b841018c0499083cb3d27bead4f21994aeebf8e75fa11df6bfe01c71cad583fc9a3c70778a437607d072540719a866adb630001fabbfb6b032d1a8dfbffac7daed8f02',
    hashAfterSign: '0xaa117a8ce6e605be5186d6fb1b83e6119ce035200a55c3437d0be2cd1fe27f90',
}

// big tx
export const bigTxInfo = {
    txConfig: {
        chainID,
        version: 1,
        type: 0,
        to: '0x1000000000000000000000000000000000000000',
        toName: bigString,
        gasPrice: bigNum,
        gasLimit: 100,
        amount: bigNum,
        data: bigData,
        expirationTime: 1544584596,
        message: bigString,
    },
    rlp:
        '0xf8e3800181c8941000000000000000000000000000000000000000b83c3838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838389e111111111111111111111111111111111111111111111111111111111111649e111111111111111111111111111111111111111111111111111111111111884949494949494949845c107d94b83c38383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383880',
    hash: '0xd05f809ba0047eeefb19ee0c56dc5277aef919a0001b419f5829c826986e88a7',
    rlpAfterSign:
        '0xf90125800181c8941000000000000000000000000000000000000000b83c3838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838389e111111111111111111111111111111111111111111111111111111111111649e111111111111111111111111111111111111111111111111111111111111884949494949494949845c107d94b83c383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838b84101acba6ce994874d7b856d663a7f1d04bc7bf65278d33afb0a7fd8da69f626292a01e6badf976c360673b71c54ff363bbcb521ae545fec47cb0bf83eb4c83332b6',
    hashAfterSign: '0x39f0e0ed036bd27031a0c629d8695bf0042e2ce956d8b3868924d5ec89e575d2',
}

export const bigTxInfoWithLemoAddr = {
    txConfig: {
        ...bigTxInfo.txConfig,
        to: testAddr,
    },
    rlp:
        '0xf8e4941000000000000000000000000000000000000000b83c3838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838389e111111111111111111111111111111111111111111111111111111111111649e111111111111111111111111111111111111111111111111111111111111884949494949494949845c107d94b83c383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838830200c88080',
    hash: '0x3ca241c27e83d4a3f963870c9f85f28aea38ccaf54038d7807e49bd3326da4ab',
    rlpAfterSign:
        '0xf90124941000000000000000000000000000000000000000b83c3838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838389e111111111111111111111111111111111111111111111111111111111111649e111111111111111111111111111111111111111111111111111111111111884949494949494949845c107d94b83c383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838383838830300c8a0acba6ce994874d7b856d663a7f1d04bc7bf65278d33afb0a7fd8da69f626292aa001e6badf976c360673b71c54ff363bbcb521ae545fec47cb0bf83eb4c83332b6',
    hashAfterSign: '0xb78113d57e979fff3ef33e3faba2ce2a0c472484313e5d68a5b4f33f39de77aa',
}

//  currentBlock
export const currentBlock = {
    changeLogs: null,
    confirms: null,
    deputyNodes: null,
    events: null,
    header: {
        changeLogRoot: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
        deputyRoot: '0x',
        eventBloom:
            '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        eventRoot: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
        extraData: '0x',
        gasLimit: '104795055',
        gasUsed: '0',
        hash: '0xba07c7cbdcfc86b18600f019b2da2b69873292e7ed84e3cf9e23065114d5d1df',
        height: '2',
        lemoBase: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
        parentHash: '0x47a9fa99e6132d330449b563fcd50fe6680082ddba6f7cc7c7586b393e52a8d8',
        signData:
            '0x96b5d799eb886dbb945e62249e0452df40c2b8b22c88642c38e6f8849dbb46f078dcc074a75c1b82cf1227aa57a71e5374b1e6ddff1ce60fb0994c88fe2ce0bc01',
        timestamp: 1541642355,
        transactionRoot: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
        versionRoot: '0x8117e9b6e78c6182a504aee2141e44dccd93fa0e8a0defbf77237b3c7fc79536',
    },
    transactions: [
        {
            chainID: '1',
            version: '1',
            type: '0',
            from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
            to: 'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY',
            toName: 'aa',
            gasPrice: '3000000000',
            gasLimit: '2000000',
            amount: '101',
            data: '0x0c',
            expirationTime: '1541649536',
            message: 'aaa',
            sig: '0x01d9a9f9f41ea020185a6480fe6938d776f0a675d89057c071fc890e09742a4dd96edb9d48c9978c2f12fbde0d0445f2ff5f08a448b91469511c663567d0b015f6',
            hash: '0x314f1b9c8585e53446983e68fdbf6642e00e5b58cfde9165fdec051cfb21d157',
        },
    ],
}
export const formattedCurrentBlock = {
    ...currentBlock,
    changeLogs: [],
    header: {
        ...currentBlock.header,
        height: 2,
        gasLimit: 104795055,
        gasUsed: 0,
        timestamp: 1541642355,
    },
    transactions: [
        {
            ...currentBlock.transactions[0],
            gasPrice: new BigNumber('3000000000'),
            gasLimit: 2000000,
            amount: new BigNumber('101'),
            expirationTime: 1541649536,
            type: 0,
            typeText: 'ORDINARY',
            version: 1,
        },
    ],
}

export const block1 = {
    header: {
        parentHash: '0x425f4ca99da879aa97bd6feaef0d491096ff3437934a139f423fecf06f9fd5ab',
        miner: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
        versionRoot: '0x8117e9b6e78c6182a504aee2141e44dccd93fa0e8a0defbf77237b3c7fc79536',
        transactionRoot: '0x94ad0a9869cb6418f6a67df76d1293b557adb567ca3d29bfc8d8ff0d5f4ac2de',
        changeLogRoot: '0x28f0c4c240375ff1c4cd4e8d6a47a351df4f2aca7447d7c836b15e7808383fe2',
        eventRoot: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
        eventBloom:
            '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        height: '1',
        gasLimit: '104897462',
        gasUsed: '21000',
        timestamp: '1541642352',
        signData:
            '0x3086eaf0bb4823423d99bda2f7ded2eeeb3287f6521931ff154b30840ed91ca35371b661e37fe20067c39dfa9ce6042c82b90c46b1418961922bc7e79affa3d800',
        deputyRoot: '0x',
        extraData: '0x',
        hash: '0x47a9fa99e6132d330449b563fcd50fe6680082ddba6f7cc7c7586b393e52a8d8',
    },
    transactions: [
        {
            chainID: '1',
            version: '1',
            type: '0',
            from: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
            to: 'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY',
            toName: '',
            gasPrice: '3000000000',
            gasLimit: '2000000',
            amount: '100',
            data: '0x',
            expirationTime: '1541649535',
            message: '',
            sig: '0x01800be6a0cf31ab9e86d547fb8cf964339276233a2b260ad8a4b4c93b39a48d6b1761e125f601bc6953e30eaad3e698c12add332a5740f1618915c12432dc6106',
            hash: '0x94ad0a9869cb6418f6a67df76d1293b557adb567ca3d29bfc8d8ff0d5f4ac2de',
        },
    ],
    changeLogs: [
        {
            type: '1',
            address: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
            version: '2',
            newValue: '0x8c052b7d2dcc8093e1eb610f9c',
            extra: '',
        },
        {
            type: '1',
            address: 'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY',
            version: '1',
            newValue: '0x64',
            extra: '',
        },
        {
            type: '1',
            address: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
            version: '3',
            newValue: '0x8c052b7d2dcc80cd2e3fffff9c',
            extra: '',
        },
    ],
    events: [],
    confirms: [],
    deputyNodes: [],
}

export const formattedBlock1 = {
    ...block1,
    header: {
        ...block1.header,
        height: 1,
        gasLimit: 104897462,
        gasUsed: 21000,
        timestamp: 1541642352,
    },
    transactions: [
        {
            ...block1.transactions[0],
            gasPrice: new BigNumber('3000000000'),
            gasLimit: 2000000,
            amount: new BigNumber('100'),
            expirationTime: 1541649535,
            type: 0,
            typeText: 'ORDINARY',
            version: 1,
        },
    ],
    changeLogs: [
        {
            ...block1.changeLogs[0],
            type: 'BalanceLog',
            version: 2,
        },
        {
            ...block1.changeLogs[1],
            type: 'BalanceLog',
            version: 1,
        },
        {
            ...block1.changeLogs[2],
            type: 'BalanceLog',
            version: 3,
        },
    ],
}
export const block0 = {
    header: {
        parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        miner: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
        versionRoot: '0x1e78c4779248d3d8d3cd9b77bf7b67b4c759ec87d45d52a3e79c928290773f4c',
        transactionRoot: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
        changeLogRoot: '0x93273cebb4f0728991811d5d7c57ae8f88a83524eedb0af48b3061ed2e8017b8',
        eventRoot: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
        eventBloom:
            '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        height: '0',
        gasLimit: '105000000',
        gasUsed: '0',
        timestamp: '1535630400',
        signData: '0x',
        deputyRoot: '0xd448943c5cf120118a5b2337b661ff1bc578d6bd89400287fbb82de62ae13933',
        extraData: '0x',
        hash: '0x425f4ca99da879aa97bd6feaef0d491096ff3437934a139f423fecf06f9fd5ab',
    },
    transactions: null,
    changeLogs: null,
    events: null,
    confirms: null,
    deputyNodes: null,
}

export const formattedBlock0 = {
    ...block0,
    header: {
        ...block0.header,
        height: 0,
        gasLimit: 105000000,
        gasUsed: 0,
        timestamp: 1535630400,
    },
}
export const oneChangeLogBlock = {
    header: {
        parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        miner: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
        versionRoot: '0x1e78c4779248d3d8d3cd9b77bf7b67b4c759ec87d45d52a3e79c928290773f4c',
        transactionRoot: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
        changeLogRoot: '0x93273cebb4f0728991811d5d7c57ae8f88a83524eedb0af48b3061ed2e8017b8',
        eventRoot: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
        eventBloom:
            '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        height: '0',
        gasLimit: '105000000',
        gasUsed: '0',
        timestamp: '1535630400',
        signData: '0x',
        deputyRoot: '0xd448943c5cf120118a5b2337b661ff1bc578d6bd89400287fbb82de62ae13933',
        extraData: '0x',
        hash: '0x425f4ca99da879aa97bd6feaef0d491096ff3437934a139f423fecf06f9fd5ab',
    },
    transactions: [],
    changeLogs: [
        {
            type: '1',
            address: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
            version: '2',
            newValue: '0x8c052b7d2dcc8093e1eb610f9c',
            extra: '',
        },
    ],
    events: [],
    confirms: [],
    deputyNodes: [
        {
            miner: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
            nodeID:
                '5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
            ip: '127.0.0.1',
            port: '7001',
            rank: '0',
            votes: '50000',
        },
    ],
}
export const formattedOneChangeLogBlock = {
    ...oneChangeLogBlock,
    header: {
        ...oneChangeLogBlock.header,
        height: 0,
        gasLimit: 105000000,
        gasUsed: 0,
        timestamp: 1535630400,
    },
    changeLogs: [
        {
            ...oneChangeLogBlock.changeLogs[0],
            type: 'BalanceLog',
            version: 2,
        },
    ],
}

export const txInfos = [emptyTxInfo, txInfo, bigTxInfo]

const tx1 = {
    ...emptyTxInfo.txConfig,
    version: '1',
    type: '0',
    toName: '',
    gasPrice: '3000000000',
    gasLimit: '2000000',
    amount: '0',
    data: '0x',
    expirationTime: '1544584596',
    message: '',
    sig: '0x01f642fbc4588fbab945a6db57381fb756221607c96f5519c5f5092ca212b454e7529b1c78da1927bc99d07f0b0f3e18442b6d911ce71a45a6f0da101e84b88e3c',
}

const formattedTx1 = {
    ...tx1,
    from: testAddr,
    gasPrice: new BigNumber('3000000000'),
    gasLimit: 2000000,
    expirationTime: 1544584596,
    amount: new BigNumber('0'),
    type: 0,
    typeText: 'ORDINARY',
    version: 1,
}

const tx2 = {
    ...txInfo.txConfig,
    version: '1',
    type: '0',
    gasPrice: '2',
    gasLimit: '100',
    amount: '1',
    expirationTime: '1544584596',
    sig: '0x018c0499083cb3d27bead4f21994aeebf8e75fa11df6bfe01c71cad583fc9a3c70778a437607d072540719a866adb630001fabbfb6b032d1a8dfbffac7daed8f02',
}

const formattedTx2 = {
    ...tx2,
    from: testAddr,
    gasPrice: new BigNumber('2'),
    gasLimit: 100,
    expirationTime: 1544584596,
    amount: new BigNumber('1'),
    type: 0,
    typeText: 'ORDINARY',
    version: 1,
}

const tx3 = {
    ...bigTxInfo.txConfig,
    version: '1',
    type: '0',
    gasPrice: bigNum,
    gasLimit: '100',
    amount: bigNum,
    expirationTime: '1544584596',
    sig: '0x01acba6ce994874d7b856d663a7f1d04bc7bf65278d33afb0a7fd8da69f626292a01e6badf976c360673b71c54ff363bbcb521ae545fec47cb0bf83eb4c83332b6',
}

const formattedTx3 = {
    ...tx3,
    from: testAddr,
    gasPrice: new BigNumber(bigNum),
    gasLimit: 100,
    expirationTime: 1544584596,
    amount: new BigNumber(bigNum),
    type: 0,
    typeText: 'ORDINARY',
    version: 1,
}

export const tx4 = {
    chainID,
    expirationTime: 1544584597,
}

export const txRes1 = {
    blockHash: '0x425f4ca99da879aa97bd6feaef0d491096ff3437934a139f423fecf06f9fd5ab',
    height: '100',
    time: '1541649535',
    tx: tx1,
}

export const formattedTxRes1 = {
    ...formattedTx1,
    blockHeight: 100,
    minedTime: 1541649535,
    blockHash: '0x425f4ca99da879aa97bd6feaef0d491096ff3437934a139f423fecf06f9fd5ab',
}

export const txRes2 = {
    blockHash: '0x425f4ca99da879aa97bd6feaef0d491096ff3437934a139f423fecf06f9fd5ab',
    height: '100',
    time: '1541649535',
    tx: tx2,
}

export const formattedTxRes2 = {
    ...formattedTx2,
    blockHeight: 100,
    minedTime: 1541649535,
    blockHash: '0x425f4ca99da879aa97bd6feaef0d491096ff3437934a139f423fecf06f9fd5ab',
}
export const txRes3 = {
    blockHash: '0x425f4ca99da879aa97bd6feaef0d491096ff3437934a139f423fecf06f9fd5ab',
    height: '100',
    time: '1541649535',
    tx: tx3,
}

export const formattedTxRes3 = {
    ...formattedTx3,
    blockHeight: 100,
    minedTime: 1541649535,
    blockHash: '0x425f4ca99da879aa97bd6feaef0d491096ff3437934a139f423fecf06f9fd5ab',
}

export const txList = [
    {
        tx: tx1,
        time: '1541649535',
    },
    {
        tx: tx2,
        time: '1541649536',
    },
    {
        tx: tx3,
        time: '1541649536',
    },
]

export const formattedTxListRes = {
    txList: [
        {
            ...formattedTx1,
            minedTime: 1541649535,
        },
        {
            ...formattedTx2,
            minedTime: 1541649536,
        },
        {
            ...formattedTx3,
            minedTime: 1541649536,
        },
    ],
    total: 3,
}

const candidate1 = {
    address: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
    profile: {
        host: '127.0.0.1',
        isCandidate: 'true',
        minerAddress: 'Lemobw',
        nodeID: '5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
        port: '7001',
    },
    votes: '1599999000000000000000000001',
}

const formattedCandidate1 = {
    ...candidate1,
    profile: {
        ...candidate1.profile,
        isCandidate: true,
        port: 7001,
    },
    votes: '1599999000.000000000000000001',
}

const candidate2 = {
    address: 'Lemobw',
    profile: {
        host: 'www.lemochain.com',
        isCandidate: 'true',
        minerAddress: 'Lemobw',
        nodeID: '6e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
        port: '8080',
    },
    votes: '0',
}

const formattedCandidate2 = {
    ...candidate2,
    profile: {
        ...candidate2.profile,
        isCandidate: true,
        port: 8080,
    },
}

export const candidateList = [candidate1, candidate2]
export const formattedCandidateListRes = {
    candidateList: [formattedCandidate1, formattedCandidate2],
    total: 2,
}

export const deputyNodes = [
    '5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0@149.28.68.93:7003',
    'ddb5fc36c415799e4c0cf7046ddde04aad6de8395d777db4f46ebdf258e55ee1d698fdd6f81a950f00b78bb0ea562e4f7de38cb0adf475c5026bb885ce74afb0@149.28.68.93:7005',
]
