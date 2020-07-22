// eslint-disable-next-line node/no-unpublished-import
import { createState, useState, State } from '../../../../dist'

export interface Task {
  id: string
  name: string
  done: boolean
}

const state = createState<Task[]>(
  new Promise(resolve => {
    // Emulate asynchronous loading of the initial state data.
    // The real application would run some fetch request,
    // to get the initial data from a server.
    setTimeout(
      () =>
        resolve([
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
        ]),
      3000,
    )
  }),
)

export function useDemoState(): State<Task[]> {
  // This function exposes the state directly.
  // i.e. the state is accessible directly outside of this module.
  // The state for settings in SettingsState.ts wraps the state by an interface.
  // Both options are valid and you need to use one or another,
  // depending on your circumstances. Apply your engineering judgement
  // to choose the best option. If unsure, exposing the state directly
  // like it is done below is a safe bet.
  return useState(state)
}
