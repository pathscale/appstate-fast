import { useState, self, State } from "../src";
import { mount } from "@vue/test-utils";
import { h } from "vue";

// test('error: should not allow set to another state value', async () => {})

// it.todo('error: should not allow create state from another state value')

// it.todo('error: should not allow create state from another state value (nested)')

test('error: should not allow serialization of statelink', async () => {
    let state1: State<{ prop1: number[] }> = {} as any;

    const wrapper = mount({
        setup(){
            state1 = useState({ prop1: [0, 0] });
            return { state1 }
        }        
    });

    // const wrapper = mount({
    //     setup() {
    //         state1 = useState({ prop1: [0, 0] });

    //         return () => {
    //             return h(
    //                 'div',
    //                 state1
    //             );
    //         };
    //     },
    // });

    expect(JSON.stringify(state1.prop1))
        // tslint:disable-next-line: max-line-length
        .toEqual('Error: HOOKSTATE-109 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-109')
});
