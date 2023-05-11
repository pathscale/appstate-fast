<template>
  <div>
    <h1 class="title is-1">Pinia Benchmark</h1>
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
import TableMeter from "./Metrics.vue";
import TableRow from "./Row.vue";
import config from "../config";
import { randomInt } from "../utils";
import {useStore} from './store'

export default {
  components: {
    TableRow,
    TableMeter,
  },

  setup() {
    const store = useStore();

    const data = computed(() => store.data);
    const running = computed(() => store.running);

    const loop = () => {
        if (store.metrics.elapsed >= config.MAX_TIME/1000) {
            store.stop()
            return
        }
        for (let i = 0; i < config.callsPerInterval; i += 1) {
            store.increment({
                row: randomInt(0, config.totalRows),
                column: randomInt(0, config.totalColumns),
                amount: randomInt(0, 5),
            })
        }
        window.requestAnimationFrame(loop)
    }

    const start = () => {
      if (running.value) return;
      store.clear();
      store.start();
      window.requestAnimationFrame(loop)
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
