import {TxType, GLOBAL_NAME} from '../const'


const apis = {
    /**
     * The version of sdk
     * @return {string}
     */
    SDK_VERSION: getSdkVersion(),
    /**
     * The type enum of transaction
     * @return {object}
     */
    TxType,
    /**
     * Stop all watching
     */
    stopWatch() {
        return this.requester.stopWatch()
    },
    /**
     * Return true if watching new data
     * @return {boolean}
     */
    isWatching() {
        return this.requester.isWatching()
    },
}

function getSdkVersion() {
    // SDK_VERSION will be replaced by rollup
    if (!process.env.SDK_VERSION) {
        // These codes for test case. And the these codes will be removed by rollup tree shaking
        // eslint-disable-next-line global-require
        const packageJson = require('../../package.json')
        return packageJson.version
    }
    return process.env.SDK_VERSION
}

export default {
    moduleName: GLOBAL_NAME,
    apis,
}
