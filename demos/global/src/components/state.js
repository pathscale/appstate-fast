import { createState } from '../../../../dist'

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

// for example purposes, let's update the state outside of a component
setTimeout(() => {
  console.log('pre-updated!')
  console.log(state.value)

  state.value = [
    ...state.value,
    {
      id: '100',
      name: 'Spread few words about Hookstate',
      done: false,
    },
  ]

  console.log('updated!')
  console.log(state.value)
}, 4000)
