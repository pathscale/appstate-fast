import { mount } from "@vue/test-utils";
import { useState, self, State } from "../src";
import { h, nextTick } from "vue";

test("array: should rerender used", async () => {
    let renderTimes = 0;

    let result: State<number[]> = {} as any;
    const wrapper = mount({
        setup() {
            result = useState([0, 5]);

            return () => {
                ++renderTimes;
                return h(
                    "div",
                    result.map((x) => x.value)
                );
            };
        },
    });

    expect(wrapper.html()).toBe(`<div>05</div>`);
    expect(renderTimes).toBe(1);

    expect(result[self].get()[0]).toStrictEqual(0);
    result[0][self].set((p) => p + 1);
    await nextTick();

    expect(renderTimes).toStrictEqual(2);
    expect(result[self].get()[0]).toStrictEqual(1);
    expect(result[self].get()[1]).toStrictEqual(5);
    expect(result.length).toEqual(2);
    expect(result[self].get().length).toEqual(2);
    expect(Object.keys(result)).toEqual(["0", "1"]);
    expect(Object.keys(result[self].get())).toEqual(["0", "1"]);
});

test("array: should rerender used (length)", async () => {
    let renderTimes = 0;
    let result: State<number[]> = {} as any;
    const wrapper = mount({
        setup() {
            result = useState([0, 5]);

            return () => {
                ++renderTimes;
                return h(
                    "div",
                    result.map((x) => x.value)
                );
            };
        },
    });

    expect(result.length).toStrictEqual(2);

    result[self].set([1, 5]);
    await nextTick();
    expect(renderTimes).toStrictEqual(2);
    expect(result[self].get()[0]).toStrictEqual(1);
    expect(result[self].get()[1]).toStrictEqual(5);
    expect(result.length).toEqual(2);
    expect(result[self].get().length).toEqual(2);
    expect(Object.keys(result)).toEqual(["0", "1"]);
    expect(Object.keys(result[self].get())).toEqual(["0", "1"]);
});

test("array: should rerender used (iterated)", async () => {
    let renderTimes = 0;
    let result: State<number[]> = {} as any;
    const wrapper = mount({
        setup() {
            result = useState([0, 5]);

            return () => {
                ++renderTimes;
                return h(
                    "div",
                    result.map((x) => x.value)
                );
            };
        },
    });
    expect(result.find((i) => false)).toStrictEqual(undefined);

    result[0][self].set(2);
    await nextTick();
    expect(renderTimes).toStrictEqual(2);

    result[2][self].set(4);
    await nextTick();
    expect(renderTimes).toStrictEqual(3);
    expect(result[self].get()[0]).toStrictEqual(2);
    expect(result[self].get()[2]).toStrictEqual(4);
    expect(result[self].get()[1]).toStrictEqual(5);
    expect(result.length).toEqual(3);
    expect(result[self].get().length).toEqual(3);
});

test("array: should not rerender used length unchanged", async () => {
    let renderTimes = 0;
    let result: State<number[]> = {} as any;
    const wrapper = mount({
        setup() {
            result = useState([0, 5]);

            return () => {
                ++renderTimes;
                return h(
                    "div",
                    result.map((x) => x.value)
                );
            };
        },
    });

    expect(result[self].get().length).toStrictEqual(2);

    result[0][self].set((p) => p + 1);
    await nextTick();
    expect(renderTimes).toStrictEqual(2);
    expect(result[self].get()[0]).toStrictEqual(1);
    expect(result[self].get()[1]).toStrictEqual(5);
    expect(result.length).toEqual(2);
    expect(result[self].get().length).toEqual(2);
    expect(Object.keys(result)).toEqual(["0", "1"]);
    expect(Object.keys(result[self].get())).toEqual(["0", "1"]);
});

test("array: should rerender used length changed", async () => {
    let renderTimes = 0;
    let result: State<number[]> = {} as any;
    const wrapper = mount({
        setup() {
            result = useState([0, 5]);

            return () => {
                ++renderTimes;
                return h(
                    "div",
                    result.map((x) => x.value)
                );
            };
        },
    });

    expect(result[self].get().length).toStrictEqual(2);

    result[2][self].set((p) => 2);
    await nextTick();
    expect(renderTimes).toStrictEqual(2);
    expect(result[self].get()[0]).toStrictEqual(0);
    expect(result[self].get()[1]).toStrictEqual(5);
    expect(result[self].get()[2]).toStrictEqual(2);
    expect(result.length).toEqual(3);
    expect(result[self].get().length).toEqual(3);
    expect(Object.keys(result)).toEqual(["0", "1", "2"]);
    expect(Object.keys(result[self].get())).toEqual(["0", "1", "2"]);
});

test("array: should rerender when keys used", async () => {
    let renderTimes = 0;
    let result: State<number[]> = {} as any;

    const wrapper = mount({
        setup() {
            const value = [0, 1];
            // tslint:disable-next-line: no-string-literal
            value["poluted"] = 1;
            result = useState<number[]>([0, 1]);

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
    expect(result[self].keys).toEqual([0, 1]);

    result[0][self].set((p) => p);
    await nextTick();
    expect(renderTimes).toStrictEqual(2);
    expect(result[self].keys).toEqual([0, 1]);

    result[3][self].set(3);
    await nextTick();
    expect(renderTimes).toStrictEqual(3);
    expect(result[self].keys).toEqual([0, 1, 3]);
});

test("array: should not rerender used undefined properties", async () => {
    let renderTimes = 0;
    let result: State<number[]> = {} as any;
    const wrapper = mount({
        setup() {
            result = useState([0, 5]);

            return () => {
                ++renderTimes;
                return h(
                    "div",
                    result.map((x) => x.value)
                );
            };
        },
    });

    expect(result[self].get().length).toStrictEqual(2);
    // tslint:disable-next-line: no-string-literal
    expect(result["field"]).toEqual(undefined);
    // tslint:disable-next-line: no-string-literal
    expect(result[self].get()["field"]).toEqual(undefined);
    expect(result[self].get()[2]).toEqual(undefined);

    result[0][self].set(1);
    await nextTick();
    expect(renderTimes).toStrictEqual(2);
    expect(result[self].get()[0]).toStrictEqual(1);
    expect(result[self].get()[1]).toStrictEqual(5);
    expect(result[self].get()[2]).toEqual(undefined);
    expect(result.length).toEqual(2);
    expect(result[self].get().length).toEqual(2);
    expect(Object.keys(result)).toEqual(["0", "1"]);
    expect(Object.keys(result[self].get())).toEqual(["0", "1"]);
});

// tslint:disable-next-line: no-any
const TestSymbol = Symbol("TestSymbol") as any;
test("array: should not rerender used symbol properties", async () => {
    let renderTimes = 0;
    let result: State<number[]> = {} as any;
    const wrapper = mount({
        setup() {
            result = useState([0, 5]);

            return () => {
                ++renderTimes;
                return h(
                    "div",
                    result.map((x) => x.value)
                );
            };
        },
    });

    expect("length" in result[self].get()).toStrictEqual(true);
    expect(TestSymbol in result[self].get()).toEqual(false);
    expect(TestSymbol in result).toEqual(false);

    expect(result[self].get().length).toStrictEqual(2);
    expect(result[self].get()[TestSymbol]).toEqual(undefined);
    expect(result[TestSymbol]).toEqual(undefined);

    result[self].get()[TestSymbol] = 100;

    expect(() => {
        result[self].get()[0] = 100;
    }).toThrow(
        "Error: APPSTATE-FAST-202 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-202"
    );

    expect(renderTimes).toStrictEqual(1);
    expect("length" in result[self].get()).toStrictEqual(true);
    expect(TestSymbol in result[self].get()).toEqual(false);
    expect(TestSymbol in result).toEqual(false);
    expect(result[self].get()[0]).toStrictEqual(0);
    expect(result[self].get()[1]).toStrictEqual(5);
    expect(result[self].get()[2]).toEqual(undefined);
    expect(result[self].get()[TestSymbol]).toEqual(100);
    expect(result.length).toEqual(2);
    expect(result[self].get().length).toEqual(2);
    expect(Object.keys(result)).toEqual(["0", "1"]);
    expect(Object.keys(result[self].get())).toEqual(["0", "1"]);
});

test("array: should rerender used via nested", async () => {
    let renderTimes = 0;
    let result: State<number[]> = {} as any;
    const wrapper = mount({
        setup() {
            result = useState([0, 0]);

            return () => {
                ++renderTimes;
                return h(
                    "div",
                    result.map((x) => x.value)
                );
            };
        },
    });
    expect(result[0][self].get()).toStrictEqual(0);

    result[0][self].set((p) => p + 1);
    await nextTick();
    expect(renderTimes).toStrictEqual(2);
    expect(result[0][self].get()).toStrictEqual(1);
    expect(result[1][self].get()).toStrictEqual(0);
    expect(result.length).toEqual(2);
    expect(result[self].get().length).toEqual(2);
    expect(Object.keys(result)).toEqual(["0", "1"]);
    expect(Object.keys(result[self].get())).toEqual(["0", "1"]);
});

test("array: should rerender used when set to the same", async () => {
    let renderTimes = 0;
    let result: State<number[]> = {} as any;
    const wrapper = mount({
        setup() {
            result = useState([0, 5]);

            return () => {
                ++renderTimes;
                return h(
                    "div",
                    result.map((x) => x.value)
                );
            };
        },
    });

    expect(result[self].get()).toEqual([0, 5]);

    result[self].set((p) => p);
    await nextTick();
    expect(renderTimes).toStrictEqual(2);
    expect(result[self].get()).toEqual([0, 5]);
    expect(result.length).toEqual(2);
    expect(result[self].get().length).toEqual(2);
    expect(Object.keys(result)).toEqual(["0", "1"]);
    expect(Object.keys(result[self].get())).toEqual(["0", "1"]);
});

test("array: should rerender unused when new element", async () => {
    let renderTimes = 0;
    let result: State<number[]> = {} as any;
    const wrapper = mount({
        setup() {
            result = useState([0, 5]);

            return () => {
                ++renderTimes;
                return h(
                    "div",
                    result.map((x) => x.value)
                );
            };
        },
    });

    result[2][self].set(1);
    await nextTick();
    expect(renderTimes).toStrictEqual(2);
    expect(result[self].get()[0]).toStrictEqual(0);
    expect(result[self].get()[1]).toStrictEqual(5);
    expect(result[self].get()[2]).toStrictEqual(1);
    expect(result.length).toStrictEqual(3);
    expect(result[self].get().length).toStrictEqual(3);
    expect(Object.keys(result)).toEqual(["0", "1", "2"]);
    expect(Object.keys(result[self].get())).toEqual(["0", "1", "2"]);
});

test("array: should not rerender unused property", async () => {
    let renderTimes = 0;

    let result: State<number[]> = {} as any;
    const wrapper = mount({
        setup() {
            result = useState([0, 0]);

            return () => {
                ++renderTimes;
                return h(
                    "div",
                    result.map((x) => x.value)
                );
            };
        },
    });
    expect(result[self].get()[1]).toStrictEqual(0);

    result[0][self].set((p) => p + 1);
    await nextTick();
    expect(renderTimes).toStrictEqual(2);
    expect(result[self].get()[0]).toStrictEqual(1);
    expect(result.length).toEqual(2);
    expect(result[self].get().length).toEqual(2);
    expect(Object.keys(result)).toEqual(["0", "1"]);
    expect(Object.keys(result[self].get())).toEqual(["0", "1"]);
});

test("array: should not rerender unused self", async () => {
    let renderTimes = 0;

    let result: State<number[]> = {} as any;
    const wrapper = mount({
        setup() {
            result = useState([0, 0]);

            return () => {
                ++renderTimes;
                return h(
                    "div",
                    result.map((x) => x.value)
                );
            };
        },
    });

    result[0][self].set((p) => p + 1);
    await nextTick();
    expect(renderTimes).toStrictEqual(2);
    expect(result[self].get()[0]).toStrictEqual(1);
    expect(result.length).toEqual(2);
    expect(result[self].get().length).toEqual(2);
    expect(Object.keys(result)).toEqual(["0", "1"]);
    expect(Object.keys(result[self].get())).toEqual(["0", "1"]);
});
