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
    console.log(Object.keys(result))
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


// it.todo("object: should not rerender unused after merge update");
// it.todo("array: should rerender used after merge update");
// it.todo("array: should rerender used after merge insert");
// it.todo("array: should rerender used after merge concat");
// it.todo("array: should rerender used after merge concat (scoped)");
// it.todo("array: should rerender used after merge delete");
// it.todo("array: should rerender used after merge complex");
// it.todo("array: should not rerender unused after merge update");
