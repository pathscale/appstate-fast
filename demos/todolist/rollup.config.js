/* eslint node/no-unsupported-features/es-syntax: ["error", { ignores: ["modules"] }] */
/* eslint-disable node/no-unpublished-import */

import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import ts from '@rollup/plugin-typescript'
import vue from 'rollup-plugin-vue'
import styles from 'rollup-plugin-styles'
import html from '@rollup/plugin-html'
import replace from '@rollup/plugin-replace'

const extensions = ['.ts', '.mjs', '.js', '.json', '.vue']

export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/index.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL ?? '/'),
    }),
    resolve({ preferBuiltins: true, extensions }),
    commonjs(),
    vue(),
    styles(),
    ts(),
    html(),
  ],
}
