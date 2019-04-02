import axios from 'axios'
import errors from '../../errors'

class HttpConn {
    constructor(host, timeout, username, password, headers) {
        if (!host) {
            throw new Error(errors.InvalidHTTPHost())
        }
        this.host = host
        this.timeout = timeout || 0

        const config = {
            baseURL: this.host,
            timeout: this.timeout,
            headers: {'Content-Type': 'application/json'},
        }
        if (username && password) {
            config.auth = {username, password}
        }
        if (headers) {
            config.headers = {...config.headers, ...headers}
        }
        this.axiosInstance = axios.create(config);
    }

    async send(payload) {
        let response
        try {
            response = await this.axiosInstance.post('', payload)
        } catch (error) {
            console.warn('send fail!', error.statusCode, error.message)
            // console.warn(error)
            throw new Error(errors.InvalidConnection(this.host))
        }

        return response.data
    }
}

export default HttpConn
