<template>
  <div>
    <h1 class="title is-1">Composition API Benchmark</h1>
    <table-meter :stats="stats" class="mb-4" />
    <div class="mb-4 table-container">
      <table>
        <tbody>
          <table-row v-for="(s, i) in data" :key="i" :state="s" />
        </tbody>
      </table>
    </div>
    <button class="button is-info" @click="start" :disabled="running">
      Start
    </button>
  </div>
</template>

<script>
import { onBeforeUnmount, reactive, ref } from "vue";
import TableMeter from "./Metrics.vue";
import config from "../config";
import TableRow from "./Row.vue";
import { randomInt } from "../utils";

export default {
  components: {
    TableRow,
    TableMeter,
  },

  setup() {
    const data = reactive(
      Array.from(Array(config.totalRows).keys()).map((i) =>
        Array.from(Array(config.totalColumns).keys()).map((j) => 0)
      )
    );

    const running = ref(false);

    const stats = reactive({
      startTime: new Date().getTime(),
      totalSum: 0,
      totalCalls: 0,
      elapsed: 0,
      rate: 0,
    });

    let timer;

    const start = () => {
      if (running.value) return;
      running.value = true;

      stats.startTime = new Date().getTime()
      stats.totalSum = 0
      stats.totalCalls = 0
      stats.elapsed = 0
      stats.rate = 0

      timer = setInterval(() => {
        for (let i = 0; i < config.callsPerInterval; i += 1) {
          const amount = randomInt(0, 5)
          data[randomInt(0, config.totalRows)][
            randomInt(0, config.totalColumns)
          ] += amount;

          // update stats, as a cell has been updated
          const elapsedMs = new Date().getTime() - stats.startTime
          stats.totalSum += amount
          stats.totalCalls += 1
          stats.elapsed = Math.floor(elapsedMs / 1000),
          stats.rate = Math.floor((stats.totalCalls / elapsedMs) * 1000)
        }
      }, config.interval);

      setTimeout(() => {
        clearInterval(timer);
        running.value = false;
      }, config.MAX_TIME);
    };

    onBeforeUnmount(() => {
      clearInterval(timer);
    });

    return {
      data,
      config,
      start,
      running,
      stats
    };
  },
};
</script>
