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
import { useState, self, State, Downgraded } from "@pathscale/appstate-fast";

const PerformanceViewPluginID = Symbol("PerformanceViewPlugin");

export default {
  props: {
    state: Array,
  },
  setup(props) {
    const stats = {
      startTime: new Date().getTime(),
      totalSum: 0,
      totalCalls: 0,
      elapsed: 0,
      rate: 0,
    };

    props.state[self].attach(() => ({
      id: PerformanceViewPluginID,
      init: () => ({
        onSet: (p) => {
          if (p.path.length === 2) {
            // new value can be only number in this example
            // and path can contain only 2 elements: row and column indexes
            stats.totalSum += p.value - p.previous;
          }
          stats.totalCalls += 1;

          const elapsedMs = new Date().getTime() - stats.startTime;
          stats.elapsed = Math.floor(elapsedMs / 1000);
          stats.rate = Math.floor((stats.totalCalls / elapsedMs) * 1000);
        },
      }),
    }));
    const scopedState = useState(props.state);

    // mark the value of the whole matrix as 'used' by this component
    scopedState[self].attach(Downgraded);
    const markUsed = computed(() => {
      scopedState[self].get();
      return 0;
    });

    return {
      stats,
      markUsed,
    };
  },
};
</script>
