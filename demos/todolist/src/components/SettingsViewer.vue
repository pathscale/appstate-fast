<template>
  <div
    style="
      border: solid;
      border-width: 1px;
      border-color: #09d3ac;
      margin-bottom: 30px;
      font-size: 0.8em;
      display: flex;
    "
  >
    <div style="flex-grow: 2; display: flex;">
      <div>
        <input
          style="transform: scale(1.6); margin-left: 20px;"
          type="checkbox"
          :checked="settingsState.isEditableInline"
          @change="settingsState.toggleEditableInline"
        />
      </div>
      <div style="padding-left: 10px; padding-bottom: 10px;">edit inline</div>
    </div>
    <div style="flex-grow: 2; display: flex;">
      <div>
        <input
          style="transform: scale(1.6); margin-left: 20px;"
          type="checkbox"
          :checked="settingsState.isScopedUpdateEnabled"
          @change="settingsState.toggleScopedUpdate"
        />
      </div>
      <div style="padding-left: 10px; padding-bottom: 10px;">use scoped state</div>
    </div>
    <div style="flex-grow: 2; display: flex;">
      <div>
        <input
          style="transform: scale(1.6); margin-left: 20px;"
          type="checkbox"
          :checked="settingsState.isHighlightUpdateEnabled"
          @change="settingsState.toggleHighlightUpdate"
        />
      </div>
      <div style="padding-left: 10px; padding-bottom: 10px; padding-right: 10px;">
        highlight updates
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useSettingsState } from './settings-state'

export default defineComponent({
  name: 'SettingsViewer',
  setup() {
    const settingsState = useSettingsState()
    return { settingsState }
  },
})
</script>

<style></style>
