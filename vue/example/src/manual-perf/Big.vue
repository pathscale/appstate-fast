<template>
  <div class="bg-white h-screen">
    Parent Last render at: {{ new Date().toISOString() }}<br />

    <json-dump :state="state" />
    <field-editor v-for="(s, i) in state" :key="i" :field-state="s" />
  </div>
</template>

<script>
import { useState } from '@pathscale/appstate-fast'
import JsonDump from './Big_JsonDump.vue'
import FieldEditor from './Big_FieldEditor.vue'

export default {
  name: 'Biggy',
  components: {
    JsonDump,
    FieldEditor
  },

  setup() {
    const state = useState(
      Array.from(Array(5000).keys()).map(i => `Field #${i + 1} value`)
    )

    return {
      state
    }
  }
}
</script>
