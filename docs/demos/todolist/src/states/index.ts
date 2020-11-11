import { createState } from '@pathscale/appstate-fast'
export const settingStorage = createState({isEditableInline: true,isScopedUpdateEnabled: true,isHighlightUpdatesEnabled: true})
export const taskStorage = createState([
    {
        id: "1",
        name: "Discover Hookstate",
        done: true
    },
    {
        id: "2",
        name: "Replace Redux by Hookstate",
        done: false
    },
    {
        id: "3",
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