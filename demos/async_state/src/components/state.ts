// eslint-disable-next-line node/no-unpublished-import
import { createState, useState, State } from '../../../../dist'
import { Ref } from 'vue'

export interface Task {
  id: string
  name: string
  done: boolean
}

const state: State<Task[]> = createState([
  {
    id: '1',
    name: 'Discover Hookstate',
    done: true,
  },
  {
    id: '2',
    name: 'Replace Redux by Hookstate',
    done: false,
  },
  {
    id: '3',
    name: 'Enjoy simpler code and faster application',
    done: false,
  },
])

export function useDemoState(): Ref<Task[]> {
  // This function exposes the state directly.
  // i.e. the state is accessible directly outside of this module.
  // The state for settings in SettingsState.ts wraps the state by an interface.
  // Both options are valid and you need to use one or another,
  // depending on your circumstances. Apply your engineering judgement
  // to choose the best option. If unsure, exposing the state directly
  // like it is done below is a safe bet.
  return useState(state)
}

// for example purposes, let's update the state outside of a React component
setTimeout(() => {
  state.update(s => {
    s.push({
      id: '100',
      name: 'Spread few words about Hookstate',
      done: false,
    })
  })
  console.log('updated!')
}, 3000)
