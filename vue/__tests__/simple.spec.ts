import { h, watchEffect, reactive } from "vue"
import { useState } from "../src";
import { mount } from "@vue/test-utils";

describe("watchEffect works correctly without browser [oscar claims it does not]", () => {
    it("watchEffect runs once per update", done => {
        mount({
            name: 'Test',
            setup() {
                const state = reactive({ a: 0 });

                watchEffect(() => {
                    console.log('side effect for a [should run 3 times]', state.a)
                });

                setInterval(() => {
                    state.a += 1;
                    state.a === 3 && done()
                }, 200)
            },
            render() {
                return h("h1", {}, "Hello world");
            }
        })
    });
});


describe("Test nested state", () => {    
    it("mutation of a substate should not trigger updates for other substates", done => {

        let acc = 0;

        mount({
            name: 'Test',
            setup() {
                const state = useState({ a: 0, b: 2 });

                watchEffect(() => {
                    // should run only once
                    console.log('side effect for state.b [should run only once]', state.b.value)
                });

                // watchEffect(() => {
                //     console.log('side effect for state.a [should run many times]', state.a.value)
                // })

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
