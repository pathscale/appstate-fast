import { mount } from "@vue/test-utils";
import { useState, createState, self, State } from "../src";
import { h, nextTick } from "vue";

test('object: should rerender used', async () => {
  let renderTimes = 0;

  let result: State<{field1:number, field2: string}> = {} as any;

  const wrapper = mount({      
      setup() {            
          result = useState({
            field1: 0,
            field2: 'str'
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
  expect(result[self].get().field1).toStrictEqual(0);

  result.field1.set(p => p + 1);
  await nextTick();

  expect(renderTimes).toStrictEqual(2);
  expect(result[self].get().field1).toStrictEqual(1);
  expect(Object.keys(result)).toEqual(['field1', 'field2']);
  expect(Object.keys(result[self].get())).toEqual(['field1', 'field2']);
});

test('object: should rerender used null', async () => {
  let renderTimes = 0
  const state = createState<{ field: string } | null>(null)

  // let result: State<{field:string}> = {} as any;
  let result: any = {} as any;
  const wrapper = mount({      
    setup() {            
        result = useState(state);
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
  expect(result[self].value?.field).toStrictEqual(undefined);

  state[self].set({ field: 'a' });
  await nextTick();

  expect(renderTimes).toStrictEqual(2);
  expect(result[self].get()?.field).toStrictEqual('a');
  expect(Object.keys(result)).toEqual(['field']);
});

test('object: should rerender used property-hiphen', async () => {
    let renderTimes = 0
    const state = createState<{ 'hiphen-property': string }>({ 'hiphen-property': 'value' })
    
    // let result: State<StateMixin<{ 'hiphen-property': string; }> = {} as any;
    let result: any = {} as any;
    const wrapper = mount({      
      setup() {            
          result = useState(state);
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
    expect(result[self].value['hiphen-property']).toStrictEqual('value');

    state['hiphen-property'].set('updated');
    await nextTick();

    expect(renderTimes).toStrictEqual(2);
    expect(result['hiphen-property'].get()).toStrictEqual('updated');
    expect(Object.keys(result)).toEqual(['hiphen-property']);
});

test('object: should rerender used (boolean-direct)', async () => {
  let renderTimes = 0
  // let result: State<{field1:boolean, field2: string}> = {} as any;
  let result: any = {} as any;

  const wrapper = mount({      
      setup() {            
          result = useState({
            field1: true,
            field2: 'str'
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
  expect(result[self].get().field1).toStrictEqual(true);

  result.field1.set((p: any) => !p);
  await nextTick();

  expect(renderTimes).toStrictEqual(2);
  expect(result[self].get().field1).toStrictEqual(false);
  expect(Object.keys(result)).toEqual(['field1', 'field2']);
  expect(Object.keys(result[self].get())).toEqual(['field1', 'field2']);
});

test('object: should rerender used via nested', async () => {
  let renderTimes = 0
  let result: State<{field1: number, field2: string}> = {} as any;

  const wrapper = mount({      
      setup() {            
          result = useState({
            field1: 0,
            field2: 'str'
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
  expect(result.field1[self].get()).toStrictEqual(0);

  result.field1[self].set(p => p + 1);
  await nextTick();

  expect(renderTimes).toStrictEqual(2);
  expect(result.field1[self].get()).toStrictEqual(1);
  expect(Object.keys(result)).toEqual(['field1', 'field2']);
  expect(Object.keys(result[self].get())).toEqual(['field1', 'field2']);
});

// tslint:disable-next-line: no-any
const TestSymbol = Symbol('TestSymbol') as any;
test('object: should not rerender used symbol properties', async () => {
  let renderTimes = 0
  let result: State<{field1: number, field2: string}> = {} as any;

  const wrapper = mount({      
      setup() {            
          result = useState({
            field1: 0,
            field2: 'str'
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

    expect(TestSymbol in result[self].get()).toEqual(false)
    expect(TestSymbol in result).toEqual(false)
    expect(result[self].get()[TestSymbol]).toEqual(undefined)
    expect(result[TestSymbol]).toEqual(undefined)
    
    expect(() => { result[self].get().field1 = 100 })
    .toThrow('Error: APPSTATE-FAST-202 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-202')
    
    result[self].get()[TestSymbol] = 100

    expect(renderTimes).toStrictEqual(1);
    expect(TestSymbol in result[self].get()).toEqual(false)
    expect(TestSymbol in result).toEqual(false)
    expect(result[self].get()[TestSymbol]).toEqual(100);
    expect(Object.keys(result)).toEqual(['field1', 'field2']);
    expect(Object.keys(result[self].get())).toEqual(['field1', 'field2']);
    expect(result[self].get().field1).toEqual(0);
});

// test('object: should rerender used when set to the same', async () => {
//     let renderTimes = 0
//     const { result } = renderHook(() => {
//         renderTimes += 1;
//         return useState({
//             field: 1
//         })
//     });
//     expect(renderTimes).toStrictEqual(1);
//     expect(result.current[self].get()).toEqual({ field: 1 });

//     act(() => {
//         result.current[self].set(p => p);
//     });
//     expect(renderTimes).toStrictEqual(2);
//     expect(result.current[self].get()).toEqual({ field: 1 });
//     expect(Object.keys(result.current)).toEqual(['field']);
//     expect(Object.keys(result.current[self].get())).toEqual(['field']);
// });

// test('object: should rerender when keys used', async () => {
//     let renderTimes = 0
//     const { result } = renderHook(() => {
//         renderTimes += 1;
//         return useState<{field: number, optional?: number} | null>({
//             field: 1
//         })
//     });
//     expect(renderTimes).toStrictEqual(1);
//     expect(result.current[self].keys).toEqual(['field']);

//     act(() => {
//         result.current[self].ornull!.field[self].set(p => p);
//     });
//     expect(renderTimes).toStrictEqual(1);
//     expect(result.current[self].keys).toEqual(['field']);

//     act(() => {
//         result.current[self].ornull!.optional[self].set(2);
//     });
//     expect(renderTimes).toStrictEqual(2);
//     expect(result.current[self].keys).toEqual(['field', 'optional']);

//     act(() => {
//         result.current[self].set(null);
//     });
//     expect(renderTimes).toStrictEqual(3);
//     expect(result.current[self].keys).toEqual(undefined);
// });

// test('object: should rerender unused when new element', async () => {
//     let renderTimes = 0
//     const { result } = renderHook(() => {
//         renderTimes += 1;
//         return useState({
//             field1: 0,
//             field2: 'str'
//         })
//     });
//     expect(renderTimes).toStrictEqual(1);

//     act(() => {
//         // tslint:disable-next-line: no-string-literal
//         result.current['field3'][self].set(1);
//     });
//     expect(renderTimes).toStrictEqual(2);
//     expect(result.current[self].get()).toEqual({
//         field1: 0,
//         field2: 'str',
//         field3: 1
//     });
//     expect(Object.keys(result.current)).toEqual(['field1', 'field2', 'field3']);
//     expect(Object.keys(result.current[self].get())).toEqual(['field1', 'field2', 'field3']);
//     expect(result.current[self].get().field1).toStrictEqual(0);
//     expect(result.current[self].get().field2).toStrictEqual('str');
//     // tslint:disable-next-line: no-string-literal
//     expect(result.current[self].get()['field3']).toStrictEqual(1);
// });

// test('object: should not rerender unused property', async () => {
//     let renderTimes = 0
//     const { result } = renderHook(() => {
//         renderTimes += 1;
//         return useState({
//             field1: 0,
//             field2: 'str'
//         })
//     });
//     expect(renderTimes).toStrictEqual(1);
    
//     act(() => {
//         result.current.field1[self].set(p => p + 1);
//     });
//     expect(renderTimes).toStrictEqual(1);
//     expect(result.current[self].get().field1).toStrictEqual(1);
// });

// test('object: should not rerender unused self', async () => {
//     let renderTimes = 0
//     const { result } = renderHook(() => {
//         renderTimes += 1;
//         return useState({
//             field1: 0,
//             field2: 'str'
//         })
//     });

//     act(() => {
//         result.current.field1[self].set(2);
//     });
//     expect(renderTimes).toStrictEqual(1);
//     expect(result.current[self].get().field1).toStrictEqual(2);
// });

// test('object: should delete property when set to none', async () => {
//     let renderTimes = 0
//     const { result } = renderHook(() => {
//         renderTimes += 1;
//         return useState({
//             field1: 0,
//             field2: 'str',
//             field3: true
//         })
//     });
//     expect(renderTimes).toStrictEqual(1);
//     expect(result.current[self].get().field1).toStrictEqual(0);
    
//     act(() => {
//         // deleting existing property
//         result.current.field1[self].set(none);
//     });
//     expect(renderTimes).toStrictEqual(2);
//     expect(result.current[self].get()).toEqual({ field2: 'str', field3: true });

//     act(() => {
//         // deleting non existing property
//         result.current.field1[self].set(none);
//     });
//     expect(renderTimes).toStrictEqual(2);
//     expect(result.current[self].get()).toEqual({ field2: 'str', field3: true });
    
//     act(() => {
//         // inserting property
//         result.current.field1[self].set(1);
//     });
//     expect(renderTimes).toStrictEqual(3);
//     expect(result.current[self].get().field1).toEqual(1);

//     act(() => {
//         // deleting existing but not used in render property
//         result.current.field2[self].set(none);
//     });
//     expect(renderTimes).toStrictEqual(4);
//     expect(result.current[self].get()).toEqual({ field1: 1, field3: true });

//     // deleting root value makes it promised
//     act(() => {
//         result.current[self].set(none)
//     })
//     expect(result.current[self].map(() => false, () => true)).toEqual(true)
//     expect(renderTimes).toStrictEqual(5);
// });

// test('object: should auto save latest state for unmounted', async () => {
//     const state = createState({
//         field1: 0,
//         field2: 'str'
//     })
//     let renderTimes = 0
//     const { result } = renderHook(() => {
//         renderTimes += 1;
//         return useState(state)
//     });
//     const unmountedLink = state
//     expect(unmountedLink.field1[self].get()).toStrictEqual(0);
//     expect(result.current[self].get().field1).toStrictEqual(0);

//     act(() => {
//         result.current.field1[self].set(2);
//     });
//     expect(renderTimes).toStrictEqual(2);
//     expect(unmountedLink.field1[self].get()).toStrictEqual(2);
//     expect(result.current[self].get().field1).toStrictEqual(2);
// });

// test('object: should set to null', async () => {
//     let renderTimes = 0
//     const { result } = renderHook(() => {
//         renderTimes += 1;
//         return useState<{} | null>({})
//     });

//     const _unused = result.current[self].get()
//     act(() => {
//         result.current[self].set(p => null);
//         result.current[self].set(null);
//     });
//     expect(renderTimes).toStrictEqual(2);
// });

// test('object: should denull', async () => {
//     let renderTimes = 0
//     const { result } = renderHook(() => {
//         renderTimes += 1;
//         return useState<{} | null>({})
//     });

//     const state = result.current[self].ornull
//     expect(state ? state[self].get() : null).toEqual({})
//     act(() => {
//         result.current[self].set(p => null);
//         result.current[self].set(null);
//     });
//     expect(renderTimes).toStrictEqual(2);
//     expect(result.current[self].ornull).toEqual(null)
// });
