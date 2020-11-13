import { createState, useState } from '@pathscale/appstate-fast'
export const settingStorage = createState({isEditableInline: true,isScopedUpdateEnabled: true,isHighlightUpdatesEnabled: true})
export const taskStorage = createState([
    {
        id: 1,
        name: "Discover Hookstate",
        done: true
    },
    {
        id: 2,
        name: "Replace Redux by Hookstate",
        done: true
    },
    {
        id: 3,
        name: "Enjoy simpler code and faster application",
        done: false
    }
])
// export const taskStorage = createState(
//     new Promise(resolve => {
//         setTimeout(() => {
//             resolve([
//                 {
//                     id: "1",
//                     name: "Discover Hookstate",
//                     done: true
//                 },
//                 {
//                     id: "2",
//                     name: "Replace Redux by Hookstate",
//                     done: false
//                 },
//                 {
//                     id: "3",
//                     name: "Enjoy simpler code and faster application",
//                     done: false
//                 }
//             ])
//         }, 3000)
//     })
// )

const addTask = () => {
    const task = useState(taskStorage)
    const findMax = Math.max.apply(Math, task.value.map(function(o) { return o.id; }))
    const newTask = {
        id: findMax + 1,
        name: 'Spread few words about Hookstate',
        done: false
    }
    task.value = [...task.value, newTask]
}

setTimeout(addTask, 3000)