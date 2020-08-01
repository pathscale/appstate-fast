<template>
  <div>
    <button @click="logState">Log State</button>
    <button @click="updateState">Update State</button>

    <p v-for="task in tasksState" :key="task.id">{{ task.id }} - {{ task.name }} - {{ task.done }}</p>
  </div>
</template>

<script>
import { state } from './state'
import { useState } from '../../../../dist'

export default {
  setup() {
    const tasksState = useState(state)

    function logState() {
      console.log(tasksState.value)
    }

    function updateState() {
      tasksState.value = [...tasksState.value, { id: '500', name: 'test', done: true }]
      logState()
    }

    return { tasksState, logState, updateState }
  },
}
</script>

<style></style>
