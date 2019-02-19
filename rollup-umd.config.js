import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import {eslint} from 'rollup-plugin-eslint';
import formatter from 'eslint-friendly-formatter';
import babel from 'rollup-plugin-babel';
import {uglify} from 'rollup-plugin-uglify';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import pkg from './package.json';

function umdConfig(name) {
    return {
        input: 'lib/index.js',
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
            // force not use Uint8Array polyfill, because otto do not support the Buffer which implemented by Uint8Array
            replace({
                include: 'node_modules/buffer-es6/index.js',
                'global.TYPED_ARRAY_SUPPORT': false,
                delimiters: ['', '']
            }),
            // use resolve so Rollup can find external libraries
            // set preferBuiltins to false cause we had rollup-plugin-node-builtins already
            resolve({browser: true, preferBuiltins: false}),
            // use commonjs so Rollup can convert external libraries to an ES module
            commonjs(),
            babel({
                exclude: 'node_modules/**'
            }),
            json(),
            globals(),
            builtins(),
        ]
    }
}

const umdVersion = umdConfig('lemo-client.js')
// eslint should before babel
umdVersion.plugins.unshift(eslint({formatter}))

const umdMinVersion = umdConfig('lemo-client.min.js')
umdMinVersion.plugins.push(uglify())

export default [
    umdVersion,
    umdMinVersion,
]
