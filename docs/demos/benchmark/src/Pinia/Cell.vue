<template>
  <td>{{ state.toString(16) }}</td>
</template>

<script>
// import { useState } from "@pathscale/appstate-fast";

export default {
  props: {
    state: Number,
  },
  setup(props) {
    // const statee = useState(props.state);
    // return {
    //   statee,
    // };
  },
}
</script>

<style scoped>
td {
  padding: 8px;
}
</style>
