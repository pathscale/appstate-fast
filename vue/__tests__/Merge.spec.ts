import { mount } from "@vue/test-utils";
import { useState, self, State, none } from "../src";
import { h, nextTick } from "vue";

test("primitive: should rerender used after merge update", async () => {
    let renderTimes = 0;

    let result: State<number> = {} as any;

    const wrapper = mount({
        setup() {
            result = useState(1);
            return () => {
                ++renderTimes;
                return h(
                    "div",
                    Object.keys(result).map((x) => x)
                );
            };
        },
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result[self].get()).toStrictEqual(1);

    result[self].merge((p) => p + 1);
    await nextTick();
    expect(renderTimes).toStrictEqual(2);
    expect(result[self].get()).toStrictEqual(2);
});

test("string: should rerender used after merge update", async () => {
    let renderTimes = 0;

    let result: State<string> = {} as any;

    const wrapper = mount({
        setup() {
            result = useState("str");
            return () => {
                ++renderTimes;
                return h(
                    "div",
                    Object.keys(result).map((x) => x)
                );
            };
        },
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result[self].get()).toStrictEqual("str");

    result[self].merge("str");
    await nextTick();
    expect(renderTimes).toStrictEqual(2);
    expect(result[self].get()).toStrictEqual("strstr");
});

test("object: should rerender used after merge update", async () => {
    let renderTimes = 0;

    let result: State<{
        field1: number,
        field2: number,
        field3: number,
        field4: number,
        field5: number,
        field6: number
    }> = {} as any;

    const wrapper = mount({
        setup() {
            result = useState({
                field1: 1,
                field2: 2,
                field3: 3,
                field4: 4,
                field5: 5,
                field6: 6,
            });
            return () => {
                ++renderTimes;
                return h(
                    "div",
                    Object.keys(result).map((x) => x)
                );
            };
        },
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.field1[self].get()).toStrictEqual(1);

    result[self].merge((p) => ({ field1: p.field1 + 1 }));
    await nextTick();

    expect(renderTimes).toStrictEqual(2);
    expect(result.field1[self].get()).toStrictEqual(2);
    expect(Object.keys(result)).toEqual([
        "field1",
        "field2",
        "field3",
        "field4",
        "field5",
        "field6",
    ]);
});

test("object: should rerender used after merge insert", async () => {
    let renderTimes = 0;

    //TODO THE newField PROPERTY SHOULD BE OPTIONAL BUT RESULT: STATE<> IS NOT ACCEPTING newField?: number,
    // let result: State<{
    //     field1: number,
    //     field2: number,
    //     field3: number,
    //     field4: number,
    //     field5: number,
    //     field6: number,
    //     newField?: number,
    // }> = {} as any;
    let result: any = {}

    const wrapper = mount({
        setup() {
            result = useState<Record<string, number>>({
                field1: 1,
                field2: 2,
                field3: 3,
                field4: 4,
                field5: 5,
                field6: 6,
            });
            return () => {
                ++renderTimes;
                return h(
                    "div",
                    Object.keys(result).map((x) => x)
                );
            };
        },
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.field1[self].get()).toStrictEqual(1);
    
    result[self].merge(() => ({ newField: 100 }));
    await nextTick();

    expect(renderTimes).toStrictEqual(2);
    expect(result.field1[self].get()).toStrictEqual(1);
    expect(Object.keys(result)).toEqual(
        ['field1', 'field2', 'field3', 'field4', 'field5', 'field6', 'newField']);

})

test("object: should rerender used after merge delete", async () => {
    let renderTimes = 0;

    let result: any = {} as any; // DO WE NEED TO SET UP THE TYPES HERE?

    const wrapper = mount({
        setup() {
            result = useState<Record<string, number>>({
                field1: 1,
                field2: 2,
                field3: 3,
                field4: 4,
                field5: 5,
                field6: 6,
            });
            return () => {
                ++renderTimes;
                return h(
                    "div",
                    Object.keys(result).map((x) => x)
                );
            };
        },
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.field1[self].get()).toStrictEqual(1);
    
    result[self].merge(() => ({ field6: none }));
    await nextTick();

    expect(renderTimes).toStrictEqual(2);
    expect(result.field1[self].get()).toStrictEqual(1);
    expect(Object.keys(result)).toEqual(
        ['field1', 'field2', 'field3', 'field4', 'field5']);
})

test("object: should rerender used after merge complex", async () => {
    let renderTimes = 0;

    let result: any = {} as any; // DO WE NEED TO SET UP THE TYPES HERE?

    const wrapper = mount({
        setup() {
            result = useState<Record<string, number>>({
                field1: 1,
                field2: 2,
                field3: 3,
                field4: 4,
                field5: 5,
                field6: 6,
            });
            return () => {
                ++renderTimes;
                return h(
                    "div",
                    Object.keys(result).map((x) => x)
                );
            };
        },
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.field1[self].get()).toStrictEqual(1);
    
    result[self].merge({
        field8: 200,
        field6: none,
        field2: 3,
        field4: none,
        field5: 2,
        field3: none,
        field7: 100,
    });
    await nextTick();

    expect(renderTimes).toStrictEqual(2);
    expect(result.field1[self].get()).toStrictEqual(1);
    expect(Object.keys(result)).toEqual([
        "field1",
        "field2",
        "field5",
        "field8",
        "field7",
    ]);
    expect(result[self].get()).toEqual({
        field1: 1,
        field2: 3,
        field5: 2,
        field8: 200,
        field7: 100,
    });
})

test("object: should not rerender unused after merge update", async () => {
    let renderTimes = 0;

    let result: any = {} as any; // DO WE NEED TO SET UP THE TYPES HERE?

    const wrapper = mount({
        setup() {
            result = useState<Record<string, number>>({
                field1: 1,
                field2: 2,
                field3: 3,
                field4: 4,
                field5: 5,
                field6: 6,
            });
            return () => {
                ++renderTimes;
                return h(
                    "div",
                    Object.keys(result).map((x) => x)
                );
            };
        },
    });

    expect(renderTimes).toStrictEqual(1);
    expect(result.field1[self].get()).toStrictEqual(1);

    result[self].merge(() => ({ field2: 3 }));
    await nextTick();

    expect(renderTimes).toStrictEqual(1);
    expect(result.field1[self].get()).toStrictEqual(1);
    expect(Object.keys(result)).toEqual([
        "field1",
        "field2",
        "field3",
        "field4",
        "field5",
        "field6",
    ]);
})

test("array: should rerender used after merge update", async () => {
    let renderTimes = 0;
    let result: State<number[]> = {} as any;
    const wrapper = mount({
        setup() {
            result = useState([1, 2, 3, 4, 5, 6]);

            return () => {
                ++renderTimes;
                return h(
                    "div",
                    result.map((x) => x.value)
                );
            };
        },
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result[0][self].get()).toStrictEqual(1);

    result[self].merge((p) => ({ 0: p[0] + 1 }));
    await nextTick();

    expect(renderTimes).toStrictEqual(2);
    expect(result[0][self].get()).toStrictEqual(2);
    expect(Object.keys(result)).toEqual(["0", "1", "2", "3", "4", "5"]);
});

test("array: should rerender used after merge insert", async () => {
    let renderTimes = 0;
    let result: State<number[]> = {} as any;
    const wrapper = mount({
        setup() {
            result = useState([1, 2, 3, 4, 5, 6]);

            return () => {
                ++renderTimes;
                return h(
                    "div",
                    result.map((x) => x.value)
                );
            };
        },
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result[0][self].get()).toStrictEqual(1);

    result[self].merge((p) => ({ 7: 100 }));
    await nextTick();

    expect(renderTimes).toStrictEqual(2);
    expect(result[0][self].get()).toStrictEqual(1);
    expect(result[self].get()).toEqual([
        1,
        2,
        3,
        4,
        5,
        6,
        undefined,
        100,
    ]);
});

test("array: should rerender used after merge concat", async () => {
    let renderTimes = 0;
    let result: State<number[]> = {} as any;
    const wrapper = mount({
        setup() {
            result = useState([1, 2, 3, 4, 5, 6]);

            return () => {
                ++renderTimes;
                return h(
                    "div",
                    result.map((x) => x.value)
                );
            };
        },
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result[0][self].get()).toStrictEqual(1);

    
    result[self].merge([100, 200]);
    await nextTick();

    expect(renderTimes).toStrictEqual(2);
    expect(result[0][self].get()).toStrictEqual(1);
    expect(result[self].get()).toEqual([1, 2, 3, 4, 5, 6, 100, 200]);
});

test("array: should rerender used after merge concat (scoped)", async () => {
    let renderTimes = 0;
    let renderTimesNested = 0;
    let result: State<number[]> = {} as any;
    let nested: State<number[]> = {} as any;

    const wrapper = mount({
        setup() {
            result = useState([1, 2, 3, 4, 5, 6]);
            return () => {
                ++renderTimes;
                return h(
                    "div",
                    result.map((x) => x.value)
                );
            };
        },
    });

    const wrapperNested = mount({
        setup() {
            nested = useState(result);
            return () => {
                ++renderTimesNested;
                return h(
                    "div",
                    result.map((x) => x.value)
                );
            };
        },
    });

    expect(renderTimes).toStrictEqual(1);
    expect(result[self].keys).toStrictEqual([0, 1, 2, 3, 4, 5]);
    expect(nested[0][self].get()).toStrictEqual(1);

    result[self].merge([100, 200]);
    await nextTick();

    expect(renderTimes).toStrictEqual(2);
    expect(result[0][self].get()).toStrictEqual(1);
    expect(result[self].get()).toEqual([1, 2, 3, 4, 5, 6, 100, 200]);
});

// test("array: should rerender used after merge delete", async () => {
//     let renderTimes = 0;
//     const { result } = renderHook(() => {
//         renderTimes += 1;
//         return useState([1, 2, 3, 4, 5, 6]);
//     });
//     expect(renderTimes).toStrictEqual(1);
//     expect(result.current[0][self].get()).toStrictEqual(1);

//     act(() => {
//         result.current[self].merge((p) => ({ 3: none }));
//     });
//     expect(renderTimes).toStrictEqual(2);
//     expect(result.current[0][self].get()).toStrictEqual(1);
//     expect(Object.keys(result.current)).toEqual(["0", "1", "2", "3", "4"]);
//     expect(result.current[self].get()).toEqual([1, 2, 3, 5, 6]);
// });

// test("array: should rerender used after merge complex", async () => {
//     let renderTimes = 0;
//     const { result } = renderHook(() => {
//         renderTimes += 1;
//         return useState([1, 2, 3, 4, 5, 6]);
//     });
//     expect(renderTimes).toStrictEqual(1);
//     expect(result.current[0][self].get()).toStrictEqual(1);

//     act(() => {
//         result.current[self].merge({
//             7: 200,
//             5: none,
//             1: 3,
//             3: none,
//             4: 2,
//             2: none,
//             6: 100,
//         });
//     });
//     expect(renderTimes).toStrictEqual(2);
//     expect(result.current[0][self].get()).toStrictEqual(1);
//     expect(Object.keys(result.current)).toEqual(["0", "1", "2", "3", "4"]);
//     expect(result.current[self].get()).toEqual([1, 3, 2, 100, 200]);
// });

// test("array: should not rerender unused after merge update", async () => {
//     let renderTimes = 0;
//     const { result } = renderHook(() => {
//         renderTimes += 1;
//         return useState([1, 2, 3, 4, 5, 6]);
//     });
//     expect(renderTimes).toStrictEqual(1);
//     expect(result.current[0][self].get()).toStrictEqual(1);

//     act(() => {
//         result.current[self].merge((p) => ({ 1: 3 }));
//     });
//     expect(renderTimes).toStrictEqual(1);
//     expect(result.current[0][self].get()).toStrictEqual(1);
//     expect(Object.keys(result.current)).toEqual(["0", "1", "2", "3", "4", "5"]);
// });