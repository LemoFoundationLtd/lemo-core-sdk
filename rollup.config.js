import replace from 'rollup-plugin-replace';
import pkg from './package.json';
import json from "rollup-plugin-json";

export default [
    {
        input: 'lib/main.js',
        external: ['bignumber.js', 'axios'],
        output: [
            {file: pkg.main, format: 'cjs'}, // CommonJS (for Node) build
        ],
        plugins: [
            json(),
        ]
    },
    {
        input: 'lib/main.js',
        external: ['bignumber.js', 'axios'],
        output: [
            {file: pkg.browser, format: 'cjs'}, // CommonJS (for Node) build
        ],
        plugins: [
            replace({'process.browser': true}),
            json(),
        ]
    }
]
