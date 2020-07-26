<template>
  <div>
    <p style="display: none;">{{ tick }}</p>
    <p v-for="task in tasks" :key="task.id">{{ task.id }} - {{ task.name }} - {{ task.done }}</p>
  </div>
</template>

<script>
import { ref, watchEffect, defineComponent } from 'vue'
import { useDemoState } from './state'
export default defineComponent({
  setup() {
    const tick = ref(0)
    setInterval(() => tick.value++, 1000)

    const tasks = useDemoState()
    watchEffect(() => console.log(tasks.value))
    return { tasks, tick }
  },
})
</script>

<style></style>
