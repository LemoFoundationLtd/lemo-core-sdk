import {assert} from 'chai'
import Api from '../lib/api'
import errors from '../lib/errors';
import Signer from '../lib/tx/signer';

describe('Api_new', () => {
    const testRequester = {
        send: () => {
        },
    }

    it('correct config', () => {
        new Api({name: 'func', method: 'func'}, testRequester)
    })
    it('empty config', () => {
        assert.throws(() => {
            new Api(undefined, testRequester)
        }, errors.InvalidAPIDefinition(undefined))
    })
    it('no name', () => {
        assert.throws(() => {
            new Api({}, testRequester)
        }, errors.InvalidAPIDefinition({}))
    })
    it('both call and method', () => {
        const apiConfig = {
            name: 'func',
            method: 'func',
            call: () => 1,
        }
        assert.throws(() => {
            new Api(apiConfig, testRequester)
        }, errors.InvalidAPIMethod(apiConfig))
    })
})

describe('Api_attachTo', () => {
    const REQUESTER_RESULT = 1122
    let sendRecord = null
    const testRequester = {
        send(...args) {
            sendRecord = args
            return Promise.resolve(REQUESTER_RESULT)
        },
    }
    const testSigner = new Signer(1)
    const apiHolder = {}

    it('correct attach', async () => {
        const apiConfig = {
            name: 'func',
            method: 'func',
        }
        new Api(apiConfig, testRequester).attachTo(apiHolder)
        const result = await apiHolder.func(100, {a: 'input'})

        assert.deepEqual(sendRecord, [apiConfig.method, [100, {a: 'input'}]])
        assert.equal(result, REQUESTER_RESULT)
    })

    it('correct attach with formatter', async () => {
        const apiConfig = {
            name: 'funcWithFormatter',
            method: 'funcWithFormatter',
            inputFormatter: (num, obj) => {
                assert.equal(num, 100)
                assert.deepEqual(obj, {a: 'input'})
                return [101, {a: 'formatted input'}]
            },
            outputFormatter: (result) => {
                assert.equal(result, REQUESTER_RESULT)
                return {a: 'formatted output'}
            },
        }
        new Api(apiConfig, testRequester).attachTo(apiHolder)
        const result = await apiHolder.funcWithFormatter(100, {a: 'input'})

        assert.deepEqual(sendRecord, [apiConfig.method, [101, {a: 'formatted input'}]])
        assert.deepEqual(result, {a: 'formatted output'})
    })

    it('custom call', async () => {
        const apiConfig = {
            name: 'callMyFunc',
            call(...args) {
                assert.equal(this, api)
                assert.deepEqual(args, [123, {a: '8293'}])
                return 100
            },
        }
        const api = new Api(apiConfig, testRequester, testSigner)
        api.attachTo(apiHolder)
        const result = apiHolder.callMyFunc(123, {a: '8293'})
        assert.equal(result, 100)
    })

    it('custom async call', async () => {
        const apiConfig = {
            name: 'callMyFuncAsync',
            call: () => Promise.resolve(200),
        }
        new Api(apiConfig, testRequester, testSigner).attachTo(apiHolder)
        const result = await apiHolder.callMyFuncAsync()
        assert.equal(result, 200)
    })

    it('attach twice', async () => {
        const apiConfig = {
            name: 'callTwice',
            call: () => Promise.resolve(200),
        }
        new Api(apiConfig, testRequester, testSigner).attachTo(apiHolder)
        assert.throws(() => {
            new Api(apiConfig, testRequester, testSigner).attachTo(apiHolder)
        }, errors.UnavailableAPIName('callTwice'))
    })
})
