<template>
  <div>
    <h1 class="title is-1">Vuex Benchmark</h1>
    <table-meter :state="data" :config="config" class="mb-4" />
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
import { onBeforeUnmount, computed } from "vue";
import { useStore } from "vuex";
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
    const store = useStore();

    const data = computed(() => store.state.data);
    const running = computed(() => store.state.running);

    let timer;

    const start = () => {
      if (running.value) return;
      store.commit("clear");
      store.commit("start");

      timer = setInterval(() => {
        for (let i = 0; i < config.callsPerInterval; i += 1) {
          store.dispatch("increment", {
            row: randomInt(0, config.totalRows),
            column: randomInt(0, config.totalColumns),
            amount: randomInt(0, 5),
          });
        }
      }, config.interval);

      setTimeout(() => {
        clearInterval(timer);
        store.commit("stop");
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
