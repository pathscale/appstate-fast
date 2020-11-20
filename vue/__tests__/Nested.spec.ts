import { mount } from "@vue/test-utils"
import { useState, State } from "../src"
import { h, nextTick, reactive, watch, watchEffect } from "vue"


// vue3 composition api based
// test('composition api: changes should not propagate to other properties', async () => {
//     let fatherRenderCount = 0
//     let childRenderCount = 0

//     let _state: any

//     /* component whose render function depends on state.foo */
//     const child = {
//         setup() {
//             watchEffect(() => {
//                 console.log('[composition-api] child watchEffect callback [foo changed]: ', _state.foo)
//             }, {
//                 onTrigger: e => {
//                     debugger
//                     console.log("[composition-api] child watchEffect, will trigger: ", e)
//                 },
//                 onTrack: e => {
//                     console.log("[composition-api] child watchEffect, tracked: ", e)
//                 }
//             })

//             return () => {
//                 console.log("[composition-api] child rendered")

//                 ++childRenderCount
//                 return h(
//                     "div",
//                     _state.foo
//                 )
//             }
//         }
//     }

//     /*  component whose render function depends on state.bar */
//     const father = {
//         setup() {
//             _state = reactive({
//                 foo: 1,
//                 bar: 2
//             })

//             return () => {
//                 console.log("[composition-api] father rendered")

//                 ++fatherRenderCount
//                 return h(
//                     "div",
//                     {
//                         disabled: _state.bar
//                     },
//                 )
//             }
//         },
//     }

//     // we mount them
//     console.log("mounting father")
//     mount(father)
//     console.log("mounting child")
//     mount(child)

//     // both should have rendered once
//     expect(fatherRenderCount).toStrictEqual(1)
//     expect(childRenderCount).toStrictEqual(1)

//     // we update state.bar
//     console.log("updating _state.bar")
//     _state.bar = 4

//     await nextTick()

//     // father depends on state.bar, thus it should have re-rendered
//     expect(fatherRenderCount).toStrictEqual(2)

//     // child does not depend on state.bar, so it should not have re-rendered
//     expect(childRenderCount).toStrictEqual(1)
// })

// appstate-fast based
test('appstate: changes should not propagate to other properties', async () => {
    let fatherRenderCount = 0
    let childRenderCount = 0

    let _state: any

    /* component whose render function depends on state.foo */
    const child = {
        setup() {
            watchEffect(() => {
                console.log('[appstate] child watchEffect callback [foo changed]: ', _state.foo.get())
            }, {
                onTrigger: e => {
                    debugger
                    console.log("[appstate] child watchEffect, will trigger: ", e)
                },
                onTrack: e => {
                    console.log("[appstate] child watchEffect, tracked: ", e)
                }
            })

            return () => {
                console.log("[appstate] child rendered")

                ++childRenderCount
                return h(
                    "div",
                    {},
                    _state.foo.get()
                )
            }
        }
    }

    /*  component whose render function depends on state.bar */
    const father = {
        setup() {
            _state = useState({
                foo: 1,
                bar: 2
            })

            return () => {
                console.log("[appstate] father rendered")

                ++fatherRenderCount
                return h(
                    "div",
                    {
                        disabled: _state.bar.get()
                    },
                )
            }
        },
    }

    // we mount them
    console.log("mounting father")
    mount(father)

    console.log("mounting child")
    mount(child)

    // both should have rendered once
    expect(fatherRenderCount).toStrictEqual(1)
    expect(childRenderCount).toStrictEqual(1)

    // we update state.bar
    console.log("updating _state.bar")
    _state.bar.set(4)

    await nextTick()

    // father depends on state.bar, thus it should have re-rendered
    expect(fatherRenderCount).toStrictEqual(2)

    // son does not depend on state.bar, so it should not have re-rendered
    expect(childRenderCount).toStrictEqual(1)
})
