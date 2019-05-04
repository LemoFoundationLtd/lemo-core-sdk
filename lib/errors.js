export default {
    InvalidAPIDefinition: config => `invalid api config ${JSON.stringify(config)}`,
    InvalidAPIMethod: config => `should set only one property of 'value' or 'call' in api config: ${JSON.stringify(config)}`,
    InvalidAPIName: methodName => `invalid api method name ${JSON.stringify(methodName)}`,
    UnavailableAPIModule: moduleName => `can not create api into module: ${moduleName}, because this property is exist`,
    UnavailableAPIName: name => `can not create api with name: ${name}, because this property is exist`,
    InvalidRPCMethod: params => `JSONRPC api name should be specified but only found params: "${JSON.stringify(params)}"`,
    InvalidConnection: host => `CONNECTION ERROR: Couldn't connect to node ${host}`,
    InvalidConn: () => 'Conn not set or invalid',
    invalidConnConfig: config => `unknown conn config: ${JSON.stringify(config)}`,
    InvalidHTTPHost: () => 'Http host not set or invalid',
    InvalidResponse: result => {
        return !!result && !!result.error && !!result.error.message ? result.error.message : `Invalid JSON RPC response: ${JSON.stringify(result)}`
    },
    InvalidAddress: address => `Invalid LemoChain address ${address}`,
    InvalidAddressConflict: address => `Private key is not match with the payer address ${address}`,
    InvalidAddressLength: address => `Invalid length of LemoChain address ${address}`,
    InvalidAddressType: address => `Invalid type of address ${address}, expected 'string' rather than '${typeof address}'`,
    InvalidHexAddress: address => `Invalid hex address ${address}`,
    InvalidAddressCheckSum: address => `Invalid address checksum ${address}`,
    DecodeAddressError: (address, errMsg) => `Decode address ${address} fail: ${errMsg}`,

    TXFieldToLong: (fieldName, length) => `The field ${fieldName} must less than ${length} bytes`,
    TXMustBeNumber: (key, value) => `'${key}' ${value} should be a number or hex`,
    TXInvalidChainID: () => '\'chainID\' should not be empty',
    TXInvalidType: (key, value, types) => {
        // Get class name if any type is class
        types = types.map(item => item.name || item)
        const typePhrase = types.length === 1 ? types[0] : `one of [${types}]`
        return `The type of '${key}' should be '${typePhrase}', rather than '${typeof value}'`
    },
    TXCanNotTestRange: (key, value) => `The type of '${key}' ${value} is invalid: ${typeof value}`,
    TXInvalidRange: (key, value, from, to) => `'${key}' ${value} is not in range [0x${from.toString(16)}, 0x${to.toString(16)}]`,
    TXInvalidLength: (key, value, length) => `The length of '${key}' ${value} should be ${length}, not ${value.length}]`,
    TXInvalidMaxLength: (key, value, length) => `The length of '${key}' ${value} should be less than ${length}, but now it is ${value.length}]`,
    TXInvalidMaxBytes: (key, value, length, currentLength) => `The length of '${key}' ${value} should be less than ${length} bytes, but now it is ${currentLength}]`,
    InvalidPollTxTimeOut: () => 'Error: transaction query timeout',
    TXCanNotChangeFrom: () => 'Change of account address is not allowed',
    TXParamMissingError: param => `The ${param} in transaction can not be missing`,
    TXIsNotDecimalError: param => `The ${param} in transaction should be a decimal number`,
    TXNegativeError: param => `The ${param} in transaction should be positive`,
    TXInfoError: () => 'Edit information cannot be empty',
    TxInvalidSymbol: parm => `Wrong character, '${parm}' must be true or false`,
    MoneyFormatError: () => 'The value entered is in the wrong format',
    NotSupportedType: () => 'The type of input value is not supported',
}
