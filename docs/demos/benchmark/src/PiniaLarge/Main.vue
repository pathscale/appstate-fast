<template>
  <div>
    <h1 class="title is-1">Pinia Large state / Large forms Benchmark</h1>
    <Dump :state="state" class="mb-4" />
    <div class="mb-4 table-container">
        <row v-for="(s, i) in data" :value="s" :index="i" :key="i" @change="changeRow" />
    </div>
<!--    <button class="button is-info" @click="start" :disabled="running.get()">-->
<!--      Start-->
<!--    </button>-->
  </div>
</template>

<script>
import { computed, reactive } from "vue";
import { useStore } from "./store";
import Dump from "./Dump.vue";
import row from "./Row.vue";
import config from "../config";

export default {
  components: {
      row,
      Dump,
  },

  setup() {
      const store = useStore()
      console.log(store)
      const data = computed(() => store.data);
      const state = computed(() => store.largeState);
      store.largeIncrement( Array.from(Array(config.largeTotalRows).keys()).map((i) => `Field #${i + 1} value`))
    const changeRow = (v, i) => {
        store.incrementRow( {
            i, v
        })
    }


    return {
      data,
        state,
      config,
        changeRow
    };
  },
};
</script>
