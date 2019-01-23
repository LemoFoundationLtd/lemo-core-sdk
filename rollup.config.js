<<<<<<< HEAD
import replace from 'rollup-plugin-replace'
import pkg from './package.json'
import babel from 'rollup-plugin-babel'
=======
import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';
>>>>>>> b1f2a6c5b02fc2306ca1c43879a0879a1f0c7c71

export default [
    {
        input: 'lib/index.js',
        external: ['bignumber.js', 'axios', 'safe-buffer', 'elliptic', 'keccak', 'base-x'],
        output: [
            {file: pkg.main, format: 'cjs'}, // CommonJS (for Node) build
        ],
        plugins: [replace({'process.env.SDK_VERSION': JSON.stringify(pkg.version)})],
    },
    {
        input: 'lib/index.js',
        external: ['bignumber.js', 'axios', 'safe-buffer', 'elliptic', 'keccak', 'base-x'],
        output: [
            {file: pkg.browser, format: 'cjs'}, // CommonJS (for Node) build
        ],
        plugins: [
            replace({
                'process.browser': 'true',
                'process.env.SDK_VERSION': JSON.stringify(pkg.version),
            }),
            babel({
                exclude: 'node_modules/**',
<<<<<<< HEAD
                runtimeHelpers: true,
            }),
        ],
    },
=======
                runtimeHelpers: true
            }),
        ]
    }
>>>>>>> b1f2a6c5b02fc2306ca1c43879a0879a1f0c7c71
]
