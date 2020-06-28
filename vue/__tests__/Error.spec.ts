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

it.todo("error: should not allow create state from another state value");

it.todo(
    "error: should not allow create state from another state value (nested)"
);

test("error: should not allow serialization of statelink", async () => {
    console.log("need to do");
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
