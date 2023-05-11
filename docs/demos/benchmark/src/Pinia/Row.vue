<template>
  <tr>
    <table-cell v-for="(s, i) in state" :key="i" :state="s" />
  </tr>
</template>

<script>
// import { useState } from "@pathscale/appstate-fast";
import TableCell from "./Cell.vue";

export default {
  props: {
    state: Array,
  },
  components: {
    TableCell,
  },
  setup(props) {
    // const statee = useState(props.state);

    // return {
    //   statee,
    // };
  },
};
</script>

<style scoped>
tr:nth-child(even) {
  background-color: white;
}
tr:nth-child(odd) {
  background-color: black;
  color: white;
}
</style>