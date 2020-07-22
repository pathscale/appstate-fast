// eslint-disable-next-line node/no-unpublished-import
import { createState, useState } from '../../../../dist'

export const useSettingsState = createState({
  isEditableInline: true,
  isScopedUpdateEnabled: true,
  isHighlightUpdateEnabled: true,
}).batch(s => () => {
  const state = useState(s)

  // This function wraps the state by an interface,
  // i.e. the state link is not accessible directly outside of this module.
  // The state for tasks in TasksState.ts exposes the state directly.
  // Both options are valid and you need to use one or another,
  // depending on your circumstances. Apply your engineering judgement
  // to choose the best option. If unsure, exposing the state directly
  // like it is done in the TasksState.ts is a safe bet.
  return {
    get isEditableInline() {
      return state.isEditableInline.get()
    },

    toggleEditableInline() {
      state.isEditableInline.set(p => !p)
      console.log(state.isEditableInline.get())
    },

    get isScopedUpdateEnabled() {
      return state.isScopedUpdateEnabled.get()
    },

    toggleScopedUpdate() {
      state.isScopedUpdateEnabled.set(p => !p)
      console.log(state.isScopedUpdateEnabled.get())
    },

    get isHighlightUpdateEnabled() {
      return state.isHighlightUpdateEnabled.get()
    },

    toggleHighlightUpdate() {
      state.isHighlightUpdateEnabled.set(p => !p)
      console.log(state.isHighlightUpdateEnabled.get())
    },
  }
})
