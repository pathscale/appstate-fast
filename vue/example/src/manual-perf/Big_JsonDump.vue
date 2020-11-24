<template>
  <p>
    JSON dump Last render at: {{ new Date().toISOString() }}

    (<b>JSON dump of the first 3 fields</b>) :<br />
    {{ JSON.stringify(statee.slice(0, 3), undefined, 4) }}
  </p>
</template>

<script>
import { useState, self } from '@pathscale/appstate-fast'

export default {
  name: 'BigJsonDump',
  props: {
    state: Array
  },
  setup(props) {
    const statee = useState(props.state)

    return {
      statee,
      self
    }
  }
}
</script>
