export default {
    InvalidNumberOfSolidityArgs: () => 'Invalid number of arguments to Solidity function',
    InvalidNumberOfRPCParams: () => 'Invalid number of input parameters to RPC method',
    InvalidRPCMethod: (params) => `JSONRPC method should be specified for params: "${JSON.stringify(params)}"`,
    InvalidConnection: host => `CONNECTION ERROR: Couldn't connect to node ${host}`,
    InvalidProvider: () => 'Provider not set or invalid',
    InvalidResponse: (result) => {
        return !!result && !!result.error && !!result.error.message ? result.error.message : `Invalid JSON RPC response: ${JSON.stringify(result)}`
    },
    ConnectionTimeout: (ms) => `CONNECTION TIMEOUT: timeout of ${ms} ms achived`,
}
