import { h, watchEffect, onMounted } from "vue"
import { useState } from "../src";
import { mount } from "@vue/test-utils";

describe("Test nested state", () => {    
    it("WatchEffect should run indepedently for nested states", () => {
        mount({
            name: 'Test',
            setup() {
                const state = useState({ a: 1, b: 2 });

                /** WatchEffect runs one time and then tracks its dependencies
                 *  So the fact that b changes 
                 */

                watchEffect(() => {
                    console.log('side effect for state.a', state.a.value)
                });

                watchEffect(() => {
                    console.log('side effect for state.b', state.b.value)
                });

                onMounted(() => {
                    state.a.set(p => p +1)
                })
            },
            render() {
                return h("h1", {}, "Hello world");
            }
        })
    });
});
