import errors from '../errors'

let messageId = 0

/**
 * Create jsonrpc payload object
 *
 * @param {string} method the method name of jsonrpc call
 * @param {Array?} params an array of method params
 * @returns {object} valid jsonrpc payload object
 */
function toPayload(method, params) {
    if (!method) {
        throw new Error(errors.InvalidRPCMethod(params))
    }

    // advance message ID
    messageId++

    return {
        jsonrpc: '2.0',
        id: messageId,
        method,
        params: params || [],
    }
}

/**
 * Check if jsonrpc response is valid
 *
 * @param {object|Array} response
 * @param {string} response.error
 * @param {string} response.jsonrpc
 * @param {string|number} response.id
 * @param {*} response.result
 * @returns {Boolean} true if response is valid, otherwise false
 */
function isValidResponse(response) {
    return Array.isArray(response) ? response.every(validateSingleMessage) : validateSingleMessage(response)
}

function validateSingleMessage(message) {
    return (
        !!message
        && !message.error
        && message.jsonrpc === '2.0'
        && (typeof message.id === 'number' || typeof message.id === 'string')
        && message.result !== undefined
    ) // undefined is not valid json object
}

/**
 * Create jsonrpc batch payload object
 *
 * @param {Array} messages an array of objects to create jsonrpc payload object method
 * @param {string} messages.method the method name of jsonrpc call
 * @param {Array?} messages.params an array of method params
 * @returns {Array} batch payload
 */
function toBatchPayload(messages) {
    return messages.map(message => toPayload(message.method, message.params))
}

/**
 * This is for test
 */
export function resetRPC() {
    messageId = 0
}

export default {
    toPayload,
    isValidResponse,
    toBatchPayload,
}
