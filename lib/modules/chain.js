import Method from '../method'

const methods = [
    new Method({
        name: 'test1',
        module: 'chain',
        call: () => {
            console.log('111')
        },
    }),
    new Method({
        name: 'getBlockByNumber',
        module: 'chain',
        call: 'getBlockByNumber',
    }),
]

export default {
    methods,
}
