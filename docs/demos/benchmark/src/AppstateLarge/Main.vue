<template>
  <div>
    <h1 class="title is-1">Appstate Large state / Large forms Benchmark</h1>
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
import { computed } from "vue";
import { useHookstate } from "@hookstate/core";
import Dump from "./Dump.vue";
import row from "./Row.vue";
import config from "../config";
import { randomInt } from "../utils";

export default {
  components: {
      row,
      Dump,
  },

  setup() {
    const data = useHookstate(
      Array.from(Array(config.largeTotalRows).keys()).map((i) => `Field #${i + 1} value`)
    );
    const state = computed(() => {
        return data.slice(0, 10)
    })
    const changeRow = (v, i) => {
        console.log(v, i)
        data[i].set(() => v)
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
