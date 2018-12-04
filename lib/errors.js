export default {
    InvalidAPIDefinition: (config) => `invalid api config ${JSON.stringify(config)}`,
    InvalidAPIMethod: (config) => `should set only one property of 'method' or 'call' in api config: ${JSON.stringify(config)}`,
    UnavailableAPIModule: (moduleName) => `can not create api into module: ${moduleName}, because this property is exist`,
    UnavailableAPIName: (name) => `can not create api with name: ${name}, because this property is exist`,
    InvalidRPCMethod: (params) => `JSONRPC api name should be specified but only found params: "${JSON.stringify(params)}"`,
    InvalidConnection: host => `CONNECTION ERROR: Couldn't connect to node ${host}`,
    InvalidConn: () => 'Conn not set or invalid',
    invalidConnConfig: (config) => `unknown conn config: ${JSON.stringify(config)}`,
    InvalidResponse: (result) => {
        return !!result && !!result.error && !!result.error.message ? result.error.message : `Invalid JSON RPC response: ${JSON.stringify(result)}`
    },
    InvalidAddress: (address) => `Invalid address ${address}`,
    InvalidAddressCheckSum: (address) => `Invalid address checksum ${address}`,
    ConnectionTimeout: (ms) => `CONNECTION TIMEOUT: timeout of ${ms} ms achived`,

    TXFieldToLong: (fieldName, length) => `The field ${fieldName} must less than ${length} bytes`,
    TXVTypeConflict: (tx) => `'v' ${tx.v} and 'type' ${tx.type} cannot be set at same time`,
    TXVVersionConflict: (tx) => `'v' ${tx.v} and 'version' ${tx.version} cannot be set at same time`,
    TXMustBeNumber: (key, value) => `'${key}' ${value} should be a number`,
    TXInvalidType: (key, value, types) => {
        // Get class name if any type is class
        types = types.map(item => item.name || item)
        const typePhrase = types.length === 1 ? types[0] : `one of [${types}]`
        return `The type of '${key}' ${value} should be ${typePhrase}, but we got ${typeof value}`
    },
    TXCanNotTestRange: (key, value) => `The type of '${key}' ${value} is invalid: ${typeof value}`,
    TXInvalidRange: (key, value, from, to) => `'${key}' ${value} is not in range [0x${from.toString(16)}, 0x${to.toString(16)}]`,
}
