import axios from 'axios'
import errors from '../errors'
import Provider from './provider';

class HttpProvider extends Provider {
    constructor(host, timeout, username, password, headers) {
        super()
        this.host = host || 'http://127.0.0.1:8001'
        this.timeout = timeout || 0

        const config = {
            baseURL: this.host,
            timeout: this.timeout,
            headers: {'Content-Type': 'application/json'},
            withCredentials: true
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
            console.error(error)
            throw new Error(errors.InvalidConnection(this.host))
        }

        return response.data
        // errors.ConnectionTimeout(this.timeout)
    }
}

export default HttpProvider
