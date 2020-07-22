<template>
  <div>
    <p>{{ test }}</p>
    <p v-if="demoState.promised">Loading</p>
    <p v-else-if="demoState.error">Error</p>
    <p v-else>Loaded: {{ !demoState.promised ? 'loaded' : 'nope' }}</p>
  </div>
</template>

<script>
import { ref, watchEffect, defineComponent } from 'vue'
import { useDemoState } from './state'
export default defineComponent({
  setup() {
    const test = ref(25)
    test.value += 15
    setInterval(() => (test.value += 1), 5000)

    const demoState = useDemoState()
    watchEffect(() => console.log(demoState.promised, demoState.error))

    return { demoState, test }
  },
})
</script>

<style></style>
