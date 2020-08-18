import {assert} from 'chai'
import LemoCore from '../../lib/index'
import '../mock'
import {deputyNodes} from '../datas'

describe('module_net_getConnectionsCount', () => {
    it('getConnectionsCount', async () => {
        const lemo = new LemoCore()
        const result = await lemo.net.getConnectionsCount()
        assert.strictEqual(result, '0')
    })
})

describe('module_net_getInfo', () => {
    it('getInfo', async () => {
        const lemo = new LemoCore()
        const result = await lemo.net.getInfo()
        assert.deepEqual(result, {
            nodeName: 'Lemo',
            nodeVersion: '1.0.0',
            os: 'windows-amd64',
            port: '7001',
            runtime: 'go1.9.2',
        })
    })
})

describe('module_net_getNodeID', () => {
    it('getInfo', async () => {
        const lemo = new LemoCore()
        const result = await lemo.net.getNodeID()
        assert.deepEqual(result, deputyNodes[0].nodeID)
    })
})
