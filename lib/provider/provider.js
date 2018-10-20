class Provider {
    async send(...args) {
        console.log('send by abstract Provider class', ...args)
        return Promise.resolve()
    }
}

export default Provider
