import {GLOBAL_NAME} from '../const'


const apis = {
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


export default {
    moduleName: GLOBAL_NAME,
    apis,
}
