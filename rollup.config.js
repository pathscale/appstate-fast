/* eslint node/no-unsupported-features/es-syntax: ["error", { ignores: ["modules"] }] */

import commonjs from '@rollup/plugin-commonjs'
import externals from 'rollup-plugin-node-externals'
import resolve from '@rollup/plugin-node-resolve'
import ts from '@wessberg/rollup-plugin-ts'
import url from '@rollup/plugin-url'

import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [externals({ deps: true }), url(), resolve({ preferBuiltins: true }), commonjs(), ts()],
}
