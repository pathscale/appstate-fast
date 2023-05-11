<template>
  <div :attr="markUsed">
    <p>
      <span>TIME_ELAPSED: {{ stats.elapsed }}s</span>
    </p>
    <p>
      <span>TOTAL_SUM: {{ stats.totalSum }}</span>
    </p>
    <p>
      <span>CELL_UPDATES {{ stats.totalCalls }}</span>
    </p>
    <p>
      <span>AVERAGE_UPDATE_RATE: {{ stats.rate }}cells/s</span>
    </p>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "./store";

export default {
  props: {
    state: Array,
    config: Object,
  },
  setup(props) {
    const store = useStore();
    const stats = computed(() => store.metrics);
    return { stats };
  },
};
</script>
