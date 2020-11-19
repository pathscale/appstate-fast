import { mount } from "@vue/test-utils";
import { useState, State } from "../src";
import { h, nextTick, reactive } from "vue";


// vue3 composition api based
test('composition api: changes should not propage to other properties', async () => {
    let fatherRenderCount = 0;
    let childRenderCount = 0;

    let _state: any;

    /* component whose render function depends on state.foo */
    const child = {
        setup() {
            return () => {
                // console.log("rendering child")
                ++childRenderCount
                return h(
                    "div",
                    _state.foo
                )
            }
        }
    }

    /*  component whose render function depends on state.bar */
    const father = {
        setup() {
            _state = reactive({
                foo: 1,
                bar: 2
            });

            return () => {
                // console.log("rendering father")
                ++fatherRenderCount;
                return h(
                    "div",
                    {
                        disabled: _state.bar
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

    // we update state.bar
    _state.bar = 4;

    await nextTick();

    // father depends on state.bar, thus it should have re-rendered
    expect(fatherRenderCount).toStrictEqual(2);

    // child does not depend on state.bar, so it should not have re-rendered
    expect(childRenderCount).toStrictEqual(1);
})

// appstate-fast based
test('appstate: changes should not propage to other properties', async () => {
    let fatherRenderCount = 0;
    let childRenderCount = 0;

    let _state: State<{ name: string, color: string }> = {} as any;

    /* component whose render function depends on state.name */
    const child = {
        setup() {
            return () => {
                console.log("rendering child")
                ++childRenderCount
                return h(
                    "div",
                    {},
                    _state.name.get()
                )
            }
        }
    }

    /*  component whose render function depends on state.color */
    const father = {
        setup() {
            _state = useState({
                name: 'oscar',
                color: 'blue'
            });

            return () => {
                console.log("rendering father")
                ++fatherRenderCount;
                return h(
                    "div",
                    {
                        disabled: _state.color.get()
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
    _state.color.set(p => "red");

    await nextTick();

    // father depends on state.color, thus it should have re-rendered
    expect(fatherRenderCount).toStrictEqual(2);

    // son does not depend on state.color, so it should not have re-rendered
    expect(childRenderCount).toStrictEqual(1);
})
