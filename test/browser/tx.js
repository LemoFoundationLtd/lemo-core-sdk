
(() => {
    const testPrivate = '0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb'
    const assert = chai.should()
    const chainID = 200
    const txInfo = {
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
        '0xf86c800181c89400000000000000000000000000000000000000018261610264010c845c107d9483616161b8418c0499083cb3d27bead4f21994aeebf8e75fa11df6bfe01c71cad583fc9a3c70778a437607d072540719a866adb630001fabbfb6b032d1a8dfbffac7daed8f0201',
        hashAfterSign: '0xe50395127cdf65b131eb39de393deb2d61f8f6645e4bee3496ab4a743b520496',
    }

    const responses = {jsonrpc: '2.0', id: 1, result: txInfo.hashAfterSign}
    const conn = {
        chainID,
        async send() {
            return responses
        },
    }

    describe('module_tx_sendTx', () => {
        it('sendTx_with_hex_address_without_waitConfirm', async () => {
            const lemo = new LemoClient(conn)
            const result = await lemo.tx.sendTx(testPrivate, txInfo.txConfig, false)
            return assert.equal(result,  txInfo.hashAfterSign)
        })
        it('sendTx_with_hex_address_waitConfirm', async () => {
            const lemo = new LemoClient(conn)
            const result = await lemo.tx.sendTx(testPrivate, txInfo.txConfig, true)
            return assert.equal(result,  txInfo.hashAfterSign)
        })
    })
})()
