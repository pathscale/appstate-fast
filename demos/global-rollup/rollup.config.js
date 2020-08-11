// import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import html, { makeHtmlAttributes } from '@rollup/plugin-html'
import babel from '@rollup/plugin-babel'
import vue from '@pathscale/rollup-plugin-vue3'
import styles from 'rollup-plugin-styles'
// import { terser } from 'rollup-plugin-terser'

const watch = Boolean(process.env.ROLLUP_WATCH) || Boolean(process.env.LIVERELOAD)

const template = async ({ attributes, files, meta, publicPath, title }) => {
  const scripts = (files.js || [])
    .map(({ fileName }) => {
      const attrs = makeHtmlAttributes(attributes.script)
      return `<script src="${publicPath}${fileName}"${attrs}></script>`
    })
    .join('\n')

  const links = (files.css || [])
    .map(({ fileName }) => {
      const attrs = makeHtmlAttributes(attributes.link)
      return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`
    })
    .join('\n')

  const metas = meta
    .map(input => {
      const attrs = makeHtmlAttributes(input)
      return `<meta${attrs}>`
    })
    .join('\n')

  return `
<!doctype html>
<html${makeHtmlAttributes(attributes.html)}>
  <head>
    ${metas}
    <title>${title}</title>
    ${links}
  </head>
  <body>
    <div id="app"></div>
    ${scripts}
  </body>
</html>`
}

export default {
  input: 'src/main.js',
  output: { file: 'dist/index.js', format: 'iife' },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
    }),

    alias({
      entries: {
        /* vue: 'vue/dist/vue.cjs.js' */
      },
    }),

    resolve({ preferBuiltins: true }),
    // commonjs(),

    vue(),
    styles({ mode: 'extract' }),
    babel({ babelHelpers: 'bundled' }),
    // terser(),

    html({ template }),
    watch && serve({ contentBase: 'dist', port: 8080 }),
    watch && livereload({ watch: 'dist' }),
  ],
}
