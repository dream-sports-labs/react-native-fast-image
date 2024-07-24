const resolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('@rollup/plugin-typescript')
const { terser } = require('rollup-plugin-terser')
const json = require('@rollup/plugin-json')
const pkg = require('./package.json')

module.exports = {
    input: 'src/index.tsx', // Entry point of your library
    output: [
        {
            file: pkg.main, // CommonJS format
            format: 'cjs',
        },
        {
            file: pkg.module, // ES module format
            format: 'esm',
        },
    ],
    external: ['react', 'react-native'], // Exclude peer dependencies
    plugins: [
        resolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'] }), // Resolves node modules
        commonjs(), // Converts CommonJS modules to ES6
        typescript({
            tsconfig: './tsconfig.json',
        }), // Transpiles TypeScript to JavaScript
        terser(), // Minifies the code for production
        json(), // Allows Rollup to import JSON files
    ],
}
