import {assert} from 'chai'
import Api from '../lib/api'
import HttpConn from '../lib/network/conn/http_conn'
import {resetRPC} from '../lib/network/jsonrpc'

function createTestRequester() {
    let sendRecord = null
    const requester = {
        send(...args) {
            sendRecord = args
            return Promise.resolve(123)
        }
    }
    return [requester, () => sendRecord]
}

describe('Api_new', () => {
    it('correct config', () => {
        const [testRequester] = createTestRequester()
        new Api({name: 'func', method: 'func'}, testRequester)
    })
    it('empty config', () => {
        const [testRequester] = createTestRequester()
        assert.throws(() => {
            new Api(undefined, testRequester)
        })
    })
    it('no name', () => {
        const [testRequester] = createTestRequester()
        assert.throws(() => {
            new Api({}, testRequester)
        })
    })
    it('both call and method', () => {
        const [testRequester] = createTestRequester()
        assert.throws(() => {
            new Api({
                name: 'func',
                method: 'func',
                call: () => 1,
            }, testRequester)
        })
    })
})

describe('Api_attachTo', () => {
    it('config contains call and method', () => {
        const [testRequester] = createTestRequester()
        const api = new Api({
            name: 'func',
            method: 'func',
        }, testRequester)
    })
})
