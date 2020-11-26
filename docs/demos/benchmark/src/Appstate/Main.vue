<template>
  <div>
    <h1 class="title is-1">Appstate Benchmark</h1>
    <table-meter :state="data" :config="config" class="mb-4" />
    <div class="mb-4 table-container">
      <table>
        <tbody>
          <table-row v-for="(s, i) in data" :key="i" :state="s" />
        </tbody>
      </table>
    </div>
    <button class="button is-info" @click="start" :disabled="running.get()">
      Start
    </button>
  </div>
</template>

<script>
import { onBeforeUnmount } from "vue";
import { useState } from "@pathscale/appstate-fast";
import TableMeter from "./Metrics.vue";
import TableRow from "./Row.vue";
import config from "../config";
import { randomInt } from "../utils";

export default {
  components: {
    TableRow,
    TableMeter,
  },

  setup() {
    const data = useState(
      Array.from(Array(config.totalRows).keys()).map((i) =>
        Array.from(Array(config.totalColumns).keys()).map((j) => 0)
      )
    );

    const running = useState(false);

    let timer;

    const start = () => {
      if (running.get()) return;

      running.set(true);
      timer = setInterval(() => {
        for (let i = 0; i < config.callsPerInterval; i += 1) {
          data[randomInt(0, config.totalRows)][
            randomInt(0, config.totalColumns)
          ].set((p) => p + randomInt(0, 5));
        }
      }, config.interval);

      setTimeout(() => {
        clearInterval(timer);
        running.set(false);
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
    };
  },
};
</script>
