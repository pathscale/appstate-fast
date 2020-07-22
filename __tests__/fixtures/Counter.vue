<template>
  <div>
    <h1>Count: {{ counter }}</h1>
    <button @click="increment">Increment</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue'
export default defineComponent({
  setup() {
    const counter = ref(0)

    const increment = () => {
      counter.value += 1
    }

    return { counter, increment }
  },
})
</script>
