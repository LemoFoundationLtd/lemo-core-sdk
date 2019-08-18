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
    TXInvalidChainID: (expect, actual) => `The chainID ${actual} from transaction is different with ${expect} from SDK`,
    InvalidTxSigs: () => 'Can\'t send an unsigned transaction',
    InvalidPollTxTimeOut: () => 'Error: transaction query timeout',
}
