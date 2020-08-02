import rollup from 'rollup'
import {} from '@vue/compiler-sfc'

export default (opts: {}): rollup.Plugin => {
  const plugin: rollup.Plugin = {
    name: 'vue',
    transform(code, id) {
      return { code, id }
    },
  }

  return plugin
}
