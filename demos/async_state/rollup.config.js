/* eslint node/no-unsupported-features/es-syntax: ["error", { ignores: ["modules"] }] */
/* eslint-disable node/no-unpublished-import */

import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import ts from '@rollup/plugin-typescript'
import vue from 'rollup-plugin-vue'
import styles from 'rollup-plugin-styles'
import html from '@rollup/plugin-html'
import replace from '@rollup/plugin-replace'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

const watch = Boolean(process.env.ROLLUP_WATCH) || Boolean(process.env.LIVERELOAD)
const extensions = ['.ts', '.mjs', '.js', '.json', '.vue']

export default {
  input: 'src/main.ts',
  output: { file: 'dist/index.js', format: 'iife', name: 'app', sourcemap: true },
  plugins: [
    replace({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
    resolve({ preferBuiltins: true, extensions }),
    commonjs(),
    vue({
      compilerOptions: { sourceMap: false },
      postcssOptions: { sourceMap: false },
      preprocessOptions: { needMap: false, sourceMap: false },
    }),
    styles(),
    ts(),
    html(),
    watch && serve({ contentBase: 'dist', historyApiFallback: true, port: 5000 }),
    watch && livereload({ watch: 'dist' }),
  ],
}
