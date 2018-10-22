import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import {eslint} from 'rollup-plugin-eslint';
import formatter from 'eslint-friendly-formatter';
import babel from 'rollup-plugin-babel';
import {uglify} from 'rollup-plugin-uglify';
import pkg from './package.json';

function umdConfig(name) {
    return {
        input: 'lib/main.js',
        output: {
            name: 'LemoClient',
            file: `dist/${name}`,
            format: 'umd',
        },
        plugins: [
            replace({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                'process.env.SDK_VERSION': JSON.stringify(pkg.version),
            }),
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

function umdLightConfig(name) {
    const config = umdConfig(name)
    config.external = ['bignumber.js']
    config.output.globals = {
        'bignumber.js': 'BigNumber'
    }
    return config
}

const umdVersion = umdConfig('lemo-client.js')
// eslint should before babel
umdVersion.plugins.unshift(eslint({formatter}))

const umdMinVersion = umdConfig('lemo-client.min.js')
umdMinVersion.output.sourcemap = true
umdMinVersion.plugins.push(uglify({sourcemap: true}))

const lightVersion = umdLightConfig('lemo-client-light.js')

const lightMinVersion = umdLightConfig('lemo-client-light.min.js')
lightMinVersion.output.sourcemap = true
lightMinVersion.plugins.push(uglify({sourcemap: true}))

export default [
    umdVersion,
    umdMinVersion,
    lightVersion,
    lightMinVersion,
]
