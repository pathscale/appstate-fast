<template>
  <tr>
    <table-cell v-for="(s, i) in statee" :key="i" :state="s" />
  </tr>
</template>

<script>
import { useState } from '@pathscale/appstate-fast'
import TableCell from './Big_TableCell.vue'

export default {
  name: 'BigTableRow',
  components: {
    TableCell
  },
  props: {
    state: Array
  },
  setup(props) {
    const statee = useState(props.state)

    return {
      statee
    }
  }
}
</script>
