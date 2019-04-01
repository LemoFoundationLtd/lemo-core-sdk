(() => {
    const testPrivate = '0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb'
    const assert = chai.should()
    const chainID = 200
    const emptyTxInfo = {
        txConfig: {
            chainID,
            expirationTime: 1544584596,
        },
        rlp: '0xd8800181c8808084b2d05e00831e84808080845c107d948080',
        hash: '0x13dd44355f872cda26cf08d42084793f9b6b6c2129e8d70a73c1c8fa62cf7f05',
        rlpAfterSign:
        '0xf85a800181c8808084b2d05e00831e84808080845c107d9480b841f642fbc4588fbab945a6db57381fb756221607c96f5519c5f5092ca212b454e7529b1c78da1927bc99d07f0b0f3e18442b6d911ce71a45a6f0da101e84b88e3c01',
        hashAfterSign: '0x37e2548baa166815431afc470fc65dfc5a399959fb179d3d33ebc8d561697ae6',
    }

    const responses = {jsonrpc: '2.0', id: 1, result: emptyTxInfo.hashAfterSign}
    const conn = {
        async send() {
            return responses
        },
    }

    describe('module_tx_sign_send', () => {
        it('sign_send_with_hex_address', async () => {
            const lemo = new LemoClient(conn)
            const json = await lemo.tx.sign(testPrivate, emptyTxInfo.txConfig)
            const result = await lemo.tx.send(json)
            assert.equal(result, '0x6a8bdc73a46dd8cff224ffd7bbf1f237c7721b81f923edd5864f38bedecd2787')
        })
        it('sign_without_chainID', async () => {
            const lemo = new LemoClient(conn)
            const txConfigCopy = {...emptyTxInfo.txConfig}
            delete txConfigCopy.chainID
            let json = await lemo.tx.sign(testPrivate, txConfigCopy)
            json = JSON.parse(json)
            assert.equal(json.chainID, '1')
        })
    })
})()
