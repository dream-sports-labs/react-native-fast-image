import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json' assert { type: 'json' };

export default {
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
          outputToFilesystem: true,
          declaration: true,
          declarationDir: './dist',
          rootDir: './src'
        }), // Transpiles TypeScript to JavaScript
        terser(), // Minifies the code for production
    ],
}
