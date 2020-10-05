import {NET_NAME} from '../const'

const apis = {
    /**
     * Get connected peers count from the lemochain node
     * @return {Promise<number>}
     */
    async getConnectionsCount() {
        return this.requester.send(`${NET_NAME}_peersCount`, [])
    },
    /**
     * Get the lemochain node information
     * @return {Promise<object>}
     */
    async getInfo() {
        return this.requester.send(`${NET_NAME}_info`, [])
    },
    /**
     * get node id
     * @returns {*}
     */
    async getNodeID() {
        return this.requester.send(`${NET_NAME}_nodeID`, [])
    },
}

export default {
    moduleName: NET_NAME,
    apis,
}
