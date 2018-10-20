import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import {eslint} from 'rollup-plugin-eslint';
import formatter from 'eslint-friendly-formatter';
import babel from 'rollup-plugin-babel';
import {uglify} from 'rollup-plugin-uglify';

function umdConfig(name) {
    return {
        input: 'lib/main.js',
        output: {
            name: 'LemoClient',
            file: `dist/${name}`,
            format: 'umd',
        },
        plugins: [
            replace({'process.env.NODE_ENV': process.env.NODE_ENV}),
            resolve({browser: true}), // so Rollup can find external libraries
            commonjs(), // so Rollup can convert external libraries to an ES module
            babel({
                exclude: 'node_modules/**',
                runtimeHelpers: true
            }),
            json(),
        ]
    }
}

const umdVersion = umdConfig('lemo-client.js')
// eslint should before babel
umdVersion.plugins.unshift(eslint({formatter}))

const umdMinVersion = umdConfig('lemo-client.min.js')
umdMinVersion.output.sourcemap = true
umdMinVersion.plugins.push(uglify({sourcemap: true}))

const lightVersion = umdConfig('lemo-client-light.js')
lightVersion.external = ['bignumber.js']
lightVersion.output.globals = {
    'bignumber.js': 'BigNumber'
}

const lightMinVersion = umdConfig('lemo-client-light.min.js')
lightMinVersion.external = ['bignumber.js']
lightMinVersion.output.globals = {
    'bignumber.js': 'BigNumber'
}
lightMinVersion.output.sourcemap = true
lightMinVersion.plugins.push(uglify({sourcemap: true}))

export default [
    umdVersion,
    umdMinVersion,
    lightVersion,
    lightMinVersion,
]
