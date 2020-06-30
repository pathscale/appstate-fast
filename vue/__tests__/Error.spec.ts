import { useState, self, State } from "../src";
import { mount } from "@vue/test-utils";
import { h } from "vue";

test("error: should not allow set to another state value", async () => {
    let state1: State<{ prop1: [number, number] }> = {} as any;
    const wrapper = mount({
        setup() {
            state1 = useState({
                prop1: [0, 0],
            });
            return () => {
                return h(
                    "div",
                    Object.keys(state1).map((x) => x)
                );
            };
        },
    });

    let state2: State<{ prop2: [number, number] }> = {} as any;
    const wrapper2 = mount({
        setup() {
            state2 = useState({
                prop2: [0, 0],
            });
            return () => {
                return h(
                    "div",
                    Object.keys(state1).map((x) => x)
                );
            };
        },
    });

    expect(() => {
        state2.prop2[self].set((p) => state1[self].get().prop1);
        // tslint:disable-next-line: max-line-length
    }).toThrow(
        `Error: APPSTATE-FAST-102 [path: /prop2]. See https://vue3.dev/docs/exceptions#appastate-fast-102`
    );
});

test.skip("error: should not allow create state from another state value", async () => {
    // let state1: State<{ prop1: [number, number] }> = {} as any;
    // const wrapper = mount({
    //     setup() {
    //         state1 = useState({
    //             prop1: [0, 0],
    //         });
    //         return () => {
    //             return h(
    //                 "div",
    //                 Object.keys(state1).map((x) => x)
    //             );
    //         };
    //     },
    // });
    // let state2: any = {};
    // const wrapper2 = mount({
    //     setup() {
    //         state2 = useState(state1[self].get().prop1);
    //         return () => {
    //             return h(
    //                 "div",
    //                 Object.keys(state1).map((x) => x)
    //             );
    //         };
    //     },
    // });
    // state2.result = {};
    // state2.result.error = {};
    // expect(state2.result.error.message)
    //     // tslint:disable-next-line: max-line-length
    //     .toEqual(
    //         `Error: HOOKSTATE-101 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-101`
    //     );
});

test.skip("error: should not allow create state from another state value (nested)", async () =>{});

test.skip("error: should not allow serialization of statelink", async () => {
    console.log(
        "need to do: Error: should not allow serialization of statelink"
    );
    // let state1: State<{ prop1: [number, number] }> = {} as any;
    // const wrapper = mount({
    //     setup() {
    //         state1 = useState({
    //             prop1: [0, 0],
    //         });
    //         return () => {
    //             return h(
    //                 "div",
    //                 Object.keys(state1).map((x) => x)
    //             );
    //         };
    //     },
    // });
    // expect(() => JSON.stringify(state1)).toThrow(
    //     "Error: HOOKSTATE-109 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-109"
    // );
});
