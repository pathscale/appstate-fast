<template>
  <div style="display: flex; justify-content: space-evenly; margin-bottom: 30px;">
    <div
      v-if="settingsState.isHighlightUpdateEnabled"
      style="width: 10px; marginright: 15px;"
    ></div>
    <p v-if="tasksState.promised">Loading</p>
    <p v-else-if="tasksState.error">Error</p>
    <div v-else style="display: flex; justify-content: space-evenly; flex-grow: 2;">
      <div>Loaded: {{ !tasksState.promised ? 'loaded' : 'nope' }}</div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'
import { useTasksState } from './TasksState'
import { useSettingsState } from './SettingsState'

export default defineComponent({
  name: 'TasksTotal',
  setup() {
    // Use both global stores in the same component.
    // Note: in fact, it it could be even one state object
    // with functions accessing different nested segments of the state data.
    // It would perform equally well.
    const settingsState = useSettingsState()
    const tasksState = useTasksState()

    // This is the trick to obtain different color on every run of this function
    const colors = ['#ff0000', '#00ff00', '#0000ff']
    const color = ref(0)
    color.value += 1
    const nextColor = colors[color.value % colors.length]

    return { tasksState, settingsState, nextColor }
  },
})
</script>

<style></style>
