// eslint-disable-next-line node/no-unpublished-import
import { createState, State } from '../../../../dist'

export const state = createState([
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
