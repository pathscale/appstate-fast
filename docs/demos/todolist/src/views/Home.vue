<template>
  <div>
    {{state}}
    <!-- <button @click="increment">
      Count is: {{ state.count }}, double is: {{ state.double }}
    </button> -->
  </div>
</template>

<script>
import { reactive, computed, ref, onMounted, onCreated } from 'vue'
import { createState, useState } from "@hookstate/vue";

export default {
  setup() {
    onMounted(() => {
      console.log('component is mounted!')
    })
    const state = useState(createState(50));
    return {
      state
    }
  }
}
</script>