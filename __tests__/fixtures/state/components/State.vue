<template>
  <div>
    <button @click="setState">Set State</button>
    <p v-for="task in tasksState" :key="task.id">{{ task.id }} - {{ task.name }} - {{ task.done }}</p>
  </div>
</template>

<script>
import { ref, watchEffect, computed } from 'vue'
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

export default {
  setup() {
    const { value: tasksState } = useState(state)

    function setState() {
      tasksState.value = [...tasksState.value, { id: 1, name: 'test', done: true }]
      console.log(tasksState.value)
    }

    return { tasksState, setState }
  },
}
</script>

<style></style>
