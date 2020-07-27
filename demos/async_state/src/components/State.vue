<template>
  <div>
    <p v-for="task in tasks" :key="task.id">{{ task.id }} - {{ task.name }} - {{ task.done }}</p>
  </div>
</template>

<script>
import { ref, watchEffect, defineComponent, computed } from 'vue'
import { state } from './state'
import { useState } from '../../../../dist'

// for example purposes, let's update the state outside of a component
setTimeout(() => {
  console.log('pre-updated!')
  console.log(state)
  state.update(s => {
    const newS = s.concat({
      id: '100',
      name: 'Spread few words about Hookstate',
      done: false,
    })

    return newS
  })
  console.log('updated!')
  console.log(state)
}, 4000)

export default defineComponent({
  setup() {
    const tasksState = useState(state)
    const tasks = computed(() => tasksState.get())
    return { tasks }
  },
})
</script>

<style></style>
