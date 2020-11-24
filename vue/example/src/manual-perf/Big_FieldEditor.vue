<template>
  <p>
    Last render at: {{ new Date().toISOString() }}

    <input :value="scopedState.get()" @input="change" />
  </p>
</template>

<script lang="ts">
import { useState, self } from '@pathscale/appstate-fast'

export default {
  name: 'BigFieldEditor',
  props: {
    fieldState: Object
  },
  setup(props) {
    const scopedState = useState(props.fieldState)

    const change = e => {
      scopedState[self].set(e.target.value)
    }

    return {
      scopedState,
      change
    }
  }
}
</script>
