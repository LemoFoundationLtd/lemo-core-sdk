import {NET_NAME} from '../const'

const apis = {
    /**
     * Get connected peers count from the lemochain node
     * @return {Promise<number>}
     */
    getConnectionsCount() {
        return this.requester.send(`${NET_NAME}_peersCount`, [])
    },
    /**
     * Get the lemochain node information
     * @return {Promise<object>}
     */
    getInfo() {
        return this.requester.send(`${NET_NAME}_info`, [])
    },
}

export default {
    moduleName: NET_NAME,
    apis,
}
