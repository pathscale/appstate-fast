<template>
  <div>
    <p v-for="task in tasks" :key="task.id">{{ task.id }} - {{ task.name }} - {{ task.done }}</p>
    <button @click="setState">Set State</button>
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

export default {
  setup() {
    const tasksState = useState(state)

    function setState() {
      tasksState.set([{ id: 1, name: 'test', done: true }])
      console.log(tasksState.state.value)
    }

    return { tasks: tasksState.state, setState }
  },
}
</script>

<style></style>
