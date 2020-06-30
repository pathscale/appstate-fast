import { mount } from "@vue/test-utils";
import { useState, createState, self, State } from "../src";
import { h, nextTick, watchEffect, watch } from "vue";

test('primitive: should rerender used', async () => {
  let renderTimes = 0;

  let result: State<number> = {} as any;
  const wrapper = mount({
      setup() {
          result = useState(0);

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
  expect(result[self].get()).toStrictEqual(0);

  result[self].set((p) => p + 1);
  await nextTick();

  expect(renderTimes).toStrictEqual(2);
  expect(result[self].get()).toStrictEqual(1);
});

test('primitive: should rerender used (boolean)', async () => {
  let renderTimes = 0;
  let result: State<boolean> = new Boolean() as any;
  const wrapper = mount({
      setup() {
          result = useState<boolean>(true);
          return () => {
              ++renderTimes;
              return h(
                  "div",
                  JSON.stringify(result)
              );
          };
      },
  });

  expect(renderTimes).toStrictEqual(1);
  expect(result[self].get()).toStrictEqual(true);

  result[self].set((p:any) => !p);
  await nextTick();

  expect(renderTimes).toStrictEqual(2);
  expect(result[self].get()).toStrictEqual(false);
});

test('primitive: should rerender used (null)', async () => {
  let renderTimes = 0;
  let result: State<any> = null as any;
  const wrapper = mount({
      setup() {
          result = useState<number | null>(null);
          return () => {
              ++renderTimes;
              return h(
                  "div",
                  result[self]
              );
          };
      },
  });

  expect(renderTimes).toStrictEqual(1);
  expect(result[self].get()).toStrictEqual(null);

  result[self].set(2);
  await nextTick();

  expect(renderTimes).toStrictEqual(2);
  expect(result[self].get()).toStrictEqual(2);
});

test('primitive: should rerender used (undefined)', async () => {
  let renderTimes = 0;
  let result: State<number | undefined> = null as any;
  const wrapper = mount({
      setup() {
          result = useState<number | undefined>(undefined);
          return () => {
              ++renderTimes;
              return h(
                  "div",
                  result[self]
              );
          };
      },
  });

  expect(renderTimes).toStrictEqual(1);
  expect(result[self].get()).toStrictEqual(undefined);

  result[self].set(2);
  await nextTick();

  expect(renderTimes).toStrictEqual(2);
  expect(result[self].get()).toStrictEqual(2);
});

test('primitive: should rerender used (global null)', async () => {
  let renderTimes = 0
  const state = createState<number | null>(null)
  let result: State<number | null> = null as any;
  // let result: any = undefined as any;
  const wrapper = mount({
      setup() {
          result = useState(state)
          return () => {
              ++renderTimes;
              return h(
                  "div",
                  result[self]
              );
          };
      },
  });

  expect(renderTimes).toStrictEqual(1);
  expect(result[self].get()).toStrictEqual(null);

  result[self].set(2);
  await nextTick();

  expect(renderTimes).toStrictEqual(2);
  expect(result[self].get()).toStrictEqual(2);
});

test('primitive: should rerender used (global undefined)', async () => {
  let renderTimes = 0
  const state = createState<number | undefined>(undefined)
  let result: State<number | undefined> = undefined as any;
  const wrapper = mount({
      setup() {
          result = useState(state)
          return () => {
              ++renderTimes;
              return h(
                  "div",
                  result[self]
              );
          };
      },
  });

  
  expect(renderTimes).toStrictEqual(1);
  expect(result[self].get()).toStrictEqual(undefined);

  result[self].set(2);
  await nextTick();

  expect(renderTimes).toStrictEqual(2);
  expect(result[self].get()).toStrictEqual(2);
});

test('primitive: should rerender used when set to the same', async () => {
  let renderTimes = 0;
  let result: State<number> = {} as any;
  const wrapper = mount({
      setup() {
          result = useState(0);
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
  expect(result[self].get()).toStrictEqual(0);

  result[self].set(p => p);
  await nextTick();

  expect(renderTimes).toStrictEqual(2);
  expect(result[self].get()).toStrictEqual(0);
});

test('primitive: should rerender when keys used', async () => {
  let renderTimes = 0;
  let result: State<string> = {} as any;
  const wrapper = mount({
      setup() {
          result = useState('value');
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
  expect(result[self].keys).toEqual(undefined);

  result[self].set(p => p);
  await nextTick();

  expect(renderTimes).toStrictEqual(2);
  expect(result[self].keys).toEqual(undefined);
});

test.skip('primitive: should not rerender unused', async () => {
  let renderTimes = 0;
  let result: State<number> = {} as any;
  const wrapper = mount({
      setup() {
          result = useState(0);
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

  result[self].set(p => p + 1);
  await nextTick();
  expect(renderTimes).toStrictEqual(1);
  expect(result[self].get()).toStrictEqual(1);
  expect(() => result[self]['non-existing']).toThrow('Error: HOOKSTATE-107 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-107');
  expect(() => result[self][0]).toThrow('Error: HOOKSTATE-107 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-107');
});

test('primitive: global state', async () => {

  let renderTimes = 0
  const state = createState<number>(0)
  let result: State<number> = null as any;
  const wrapper = mount({
      setup() {
          result = useState(state)
          return () => {
              ++renderTimes;
              return h(
                  "div",
                  result[self]
              );
          };
      },
  });

  expect(result[self].get()).toStrictEqual(0);
  result[self].set(p => p + 1);
  await nextTick();

  expect(renderTimes).toStrictEqual(2);
  expect(result[self].get()).toStrictEqual(1);
});

test('primitive: global state created locally', async () => {
  let renderTimes = 0
  let result: State<number> = null as any;
  const wrapper = mount({
    setup() {
          const state = createState<number>(0)
          result = useState(state)
          return () => {
              ++renderTimes;
              return h(
                  "div",
                  result[self]
              );
          };
      },
  });

  expect(result[self].get()).toStrictEqual(0);
  
  result[self].set(p => p + 1);
  await nextTick();

  expect(renderTimes).toStrictEqual(2);
  expect(result[self].get()).toStrictEqual(1);
});

// test('primitive: stale state should auto refresh', async () => {
//   let renderTimes = 0
//   let result: State<number> = null as any;
//   const wrapper = mount({
//     setup() {
//       const r = useState(0)
//       return () => {        
//         watchEffect(async () => {
//           ++renderTimes;
//           // simulated subscription, long running process
//           const timer = setInterval(async() => {
//               // intentionally use value coming from cache
//               // which should be the latest
//               // even if the effect is not rerun on rerender              
//               r[self].set(r.get() + 1) // 1 + 1
//               await nextTick();
//           }, 100)
//           return () => clearInterval(timer)
//         })
//         result = r;
//         return h(
//             "div",
//             result[self]
//         );
//       };
//     },
//   });

//   // this also marks it as used,
//   // although it was not used during rendering
//   result[self].set(result[self].get() + 1); // 0 + 1
//   await nextTick();
  
//   expect(renderTimes).toStrictEqual(2);
//   expect(result[self].get()).toStrictEqual(1);
  
//   await new Promise(resolve => setTimeout(() => resolve(), 110));

//   expect(renderTimes).toStrictEqual(3);
//   expect(result[self].get()).toStrictEqual(2);
  
//   result[self].set(p => p + 1);
//   await nextTick();

//   expect(renderTimes).toStrictEqual(4);
//   expect(result[self].get()).toStrictEqual(3);
// });

// test('primitive: state value should be the latest', async () => {
//   let renderTimes = 0
//   const { result } = renderHook(() => {
//       renderTimes += 1;
//       const r = useState(0)
//       React.useEffect(() => {
//           act(() => {
//               r.set(r.get() + 1) // 0 + 1
//               r.set(r.get() + 1) // 1 + 1
//           })
//       }, [])
//       return r
//   });
//   expect(renderTimes).toStrictEqual(2);
//   expect(result.current.get()).toStrictEqual(2);

//   act(() => {
//       result.current.set(p => p + 1); // 2 + 1
//   });
//   expect(renderTimes).toStrictEqual(3);
//   expect(result.current.get()).toStrictEqual(3);
// });

