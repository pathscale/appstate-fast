import { h, watchEffect, reactive } from "vue"
import { useState } from "../src"
import { mount } from "@vue/test-utils"

/** Tests the ability for watchEffect to successfully execute a callback after mutations targeted at state.a
 *  I'm testing this just for safety as subsequent tests depend deeply on the fact that watchEffect behaves correctly
 * 
 *  It also proves that vue::reactive works too
 */
describe("test watchEffect behavious with vue3 default reactive helpers", () => {
    it("checks that watchEffect runs once per update to reactive state", done => {
        mount({
            name: 'Test',
            setup() {
                const state = reactive({ a: 0 })
                const f = jest.fn()
                const n = 5

                watchEffect(() => {
                    f(state.a)
                })

                setInterval(() => {
                    if (state.a === n) {
                        expect(f).toHaveBeenCalledTimes(n+1)
                        return done()
                    }

                    state.a += 1
                }, 200)
            },
            render() {
                return h("h1", {}, "Hello world")
            }
        })
    })
})


describe("Test nested state", () => {
    it("mutation of a substate should not trigger updates for other substates", done => {
        let acc = 0;

        mount({
            name: 'Test',
            setup() {
                const state = useState({ a: 0, b: 2, c: 3 });

                watchEffect(() => {
                    console.log('side effect for state.b [should run only once]', state.b.value)
                });

                watchEffect(() => {
                    console.log('side effect for state.c [should run only once]', state.c.value)
                });

                setInterval(() => {
                    state.a.set(p => p+1)
                    acc += 1
                    acc === 3 && done()
                }, 100)

            },
            render() {
                return h("h1", {}, "Hello world");
            }
        })
    });
});


/** Tests that appstate-fast will not trigger side effects for other substates, this is good and expected behaviour.
*/
describe("Test nested state", () => {
    it("mutation of a substate should not trigger updates for other substates", done => {
        const mutations = 3
        const b = jest.fn()

        mount({
            name: 'Test',
            setup() {
                const state = useState({ a: 0, b: 'a' })

                /* Should only be called once */
                watchEffect(() => {
                    b(state.b.value)
                })
                
               /* Update the substate 10 times */ 
                setInterval(() => {
                    if (state.a.value === mutations) {
                        // because it was never mutated
                        expect(b).toHaveBeenCalledTimes(1) 
                        return done()
                    }

                    state.a.set(p => p+1)
                }, 100)
                
            },
            render() {
                return h("h1", {}, "Hello world")
            }
        })
    })
})
