<template>
  <td>{{ statee.value.toString(16) }}</td>
</template>

<script lang="ts">
import { useState } from '@pathscale/appstate-fast'

export default {
  name: 'BigTableCell',
  props: {
    state: Object
  },
  setup(props) {
    const statee = useState(props.state)

    return {
      statee
    }
  }
}
</script>
