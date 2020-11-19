import { mount } from "@vue/test-utils";
import { useState, self, State } from "../src";
import { h, nextTick } from "vue";

test('nested: changes should not propage to other properties', async () => {
    let fatherRenderCount = 0;
    let childRenderCount = 0;

    let _state: State<{ name: string, color: string }[]> = {} as any;

    /* component whose render function depends on state.name */
    const child = {
        setup() {
            return () => {
                ++childRenderCount
                return h(
                    "div",
                    {},
                    _state[0][self].get().name
                )
            }
        }
    }

    /*  component whose render function depends on state.color */
    const father = {
        setup() {
            _state = useState([{
                name: 'oscar',
                color: 'blue'
            }]);

            return () => {
                ++fatherRenderCount;
                return h(
                    "div",
                    {
                        disabled: _state[0][self].get().color
                    },
                );
            };
        },
    }

    // we mount them
    mount(father)
    mount(child)

    // both should have rendered once
    expect(fatherRenderCount).toStrictEqual(1);
    expect(childRenderCount).toStrictEqual(1);

    // we update state.color
    _state[0].color[self].set(p => "red");

    await nextTick();

    // father depends on state.color, thus it should have re-rendered
    expect(fatherRenderCount).toStrictEqual(2);

    // son does not depend on state.color, so it should not have re-rendered
    expect(childRenderCount).toStrictEqual(1);
})
