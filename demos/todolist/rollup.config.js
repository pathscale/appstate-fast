/* eslint node/no-unsupported-features/es-syntax: ["error", { ignores: ["modules"] }] */
/* eslint-disable node/no-unpublished-import */

import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import ts from '@wessberg/rollup-plugin-ts'
import vue from 'rollup-plugin-vue'
import styles from 'rollup-plugin-styles'

const extensions = ['.ts', '.mjs', '.js', '.json', '.vue']

export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/index.js',
    format: 'es',
  },
  plugins: [resolve({ preferBuiltins: true, extensions }), commonjs(), vue(), styles(), ts()],
}
