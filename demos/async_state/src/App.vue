<template>
  <div class="wrapper">
    <h2>Appstate - Async State</h2>
    <State />
  </div>
</template>

<script>
import { onMounted, defineComponent } from 'vue'
import { useState } from '../../../dist'
import State from './components/State.vue'

export default defineComponent({
  components: { State },
  setup() {
    onMounted(() => console.log('component is mounted!'))
  },
})
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  background-color: black;
  color: white;
}
</style>
