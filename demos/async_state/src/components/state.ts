// eslint-disable-next-line node/no-unpublished-import
import { createState, State } from '../../../../dist'

export interface Task {
  id: string
  name: string
  done: boolean
}

export const state: State<Task[]> = createState([
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
