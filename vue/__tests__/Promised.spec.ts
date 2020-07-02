import { mount } from "@vue/test-utils";
import { useState, self, State, createState} from "../src";
import { h, nextTick } from "vue";


// test.skip('primitive: should rerender used on promise resolve', async () => {
//   let renderTimes = 0;

//   let result: State<number> = {} as any;
//   const wrapper = mount({
//       setup() {
//           result = useState(0);
//           return () => {
//               ++renderTimes;
//               return h(
//                   "div",
//                   result.map((x) => x.value)
//               );
//           };
//       },
//   });

//   expect(renderTimes).toStrictEqual(1);
//   expect(result[self].get()).toStrictEqual(0);

//   const promise = new Promise<number>(resolve => setTimeout(() => {
//     () => resolve(100)
//   }, 500))

//   result[self].set(promise);
//   await nextTick();

//   expect(renderTimes).toStrictEqual(2);
//   expect(result[self].map(() => false, () => true)).toStrictEqual(true);
//   expect(result[self].map()).toStrictEqual([true, undefined, undefined]);
//   expect(() => result[self].map(() => false, (s) => s[self].keys, e => e))
//       .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');
//   expect(() => result[self].get())
//       .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');

//   expect(() => result[self].set(200))
//       .toThrow('Error: APPSTATE-FAST-104 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-104')
      
//   await promise;

//   expect(renderTimes).toStrictEqual(3);
//   expect(result.map(() => false, () => true)).toStrictEqual(false);
//   expect(result[self].map()).toStrictEqual([false, undefined, 100]);
//   expect(result[self].map(() => false, (s) => s[self].value, e => e)).toEqual(false);
//   expect(result[self].get()).toEqual(100);
// });

// test.skip('array: should rerender used on promise resolve', async () => {
//     let renderTimes = 0;

//     let result: State<number[]> = {} as any;
//     const wrapper = mount({
//         setup() {
//             result = useState([0]);
//             return () => {
//                 ++renderTimes;
//                 return h(
//                     "div",
//                     result.map((x) => x.value)
//                 );
//             };
//         },
//     });

//     expect(renderTimes).toStrictEqual(1);
//     expect(result[0].get()).toStrictEqual(0);

//     const promise = new Promise<number[]>(resolve => setTimeout(() => {
//         () => resolve([100])
//     }, 500))
    
//     result[self].set(promise);
//     await nextTick();
    
//     expect(renderTimes).toStrictEqual(2);
//     expect(result[self].map(() => false, () => true)).toStrictEqual(true);
//     expect(() => result[self].map(() => false, (s) => s[self].keys, e => e))
//         .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');
//     expect(() => result[self].get())
//         .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');

//     expect(() => result[self].set([200]))
//         .toThrow('Error: APPSTATE-FAST-104 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-104')
        
//     async () => {
//         await promise;
//     }
    
//     expect(renderTimes).toStrictEqual(3);
//     expect(result[self].map(() => false, () => true)).toStrictEqual(false);
//     expect(result[self].map(() => false, (s) => s[self].value, e => e)).toEqual(false);
//     expect(result[self].get()).toEqual([100]);
// });

// test.skip('array: should rerender used on promise resolve (global)', async () => {
//     let renderTimes = 0;    
//     let result: State<number[]> = {} as any;
//     const state = createState([0])

//     const wrapper = mount({
//         setup() {
//             result = useState<number[]>(state);
//             return () => {
//                 ++renderTimes;
//                 return h(
//                     "div",
//                     result.map((x) => x.value)
//                 );
//             };
//         },
//     });


//     expect(renderTimes).toStrictEqual(1);
//     expect(result[0].get()).toStrictEqual(0);

//     const promise = new Promise<number[]>(resolve => setTimeout(() => {
//         () => resolve([100])
//     }, 500))
  
//     result[self].set(promise);
//     await nextTick();

//     expect(renderTimes).toStrictEqual(2);
//     expect(result[self].map(() => false, () => true)).toStrictEqual(true);
//     expect(() => result[self].map(() => false, (s) => s[self].keys, e => e))
//         .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');
//     expect(() => result[self].get())
//         .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');

//     expect(() => result[self].set([200]))
//         .toThrow('Error: APPSTATE-FAST-104 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-104')
      
//     async () => {
//         await promise;        
//     }

//     expect(renderTimes).toStrictEqual(3);
//     expect(result[self].map(() => false, () => true)).toStrictEqual(false);
//     expect(result[self].map(() => false, (s) => s[self].value, e => e)).toEqual(false);
//     expect(result[self].get()).toEqual([100]);
// });

test('array: should rerender used on promise resolve (global promise)', async () => {
    let renderTimes = 0;    
    let result: State<number[]> = {} as any;
    const state = createState(new Promise<number[]>(resolve => setTimeout(() => {
            () => resolve([100])
        }, 500)))

    const wrapper = mount({
        setup() {
            result = useState<number[]>(state);
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

    expect(result[self].map(() => false, () => true)).toStrictEqual(true);
    expect(() => result[self].map(() => false, (s) => s[self].keys, e => e))
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');
    expect(() => result[self].get())
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');

    expect(() => result[self].set([200]))
        .toThrow('Error: APPSTATE-FAST-104 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-104')
});

// test('primitive: should rerender used on promise resolve manual', async () => {
//   let renderTimes = 0
//   const { result } = renderHook(() => {
//       renderTimes += 1;
//       return useState(none)
//   });
//   expect(renderTimes).toStrictEqual(1);
//   expect(result.current[self].map(() => false, () => true)).toStrictEqual(true);
//   expect(() => result.current[self].map(() => false, (s) => s[self].value, e => e))
//       .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
//   expect(() => result.current[self].get())
//       .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

//   act(() => {
//       result.current[self].set(100);
//   });

//   expect(renderTimes).toStrictEqual(2);
//   expect(result.current[self].map(() => false, () => true)).toStrictEqual(false);
//   expect(result.current[self].map(() => false, (s) => s[self].value, e => e)).toEqual(false);
//   expect(result.current[self].get()).toEqual(100);
// });

test.skip('primitive: should rerender used on promise resolve second', async () => {
//   let renderTimes = 0
//   const { result } = renderHook(() => {
//       renderTimes += 1;
//       return useState(new Promise<number>(resolve => setTimeout(() => {
//           act(() => resolve(100))
//       }, 500)))
//   });
//   expect(renderTimes).toStrictEqual(1);
//   expect(result.current[self].map(() => false, () => true)).toStrictEqual(true);
//   expect(() => result.current[self].map(() => false, (s) => s[self].value, e => e))
//       .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
//   expect(() => result.current[self].get())
//       .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

//   const promise = new Promise<number>(resolve => setTimeout(() => {
//       act(() => resolve(200))
//   }, 500))
//   act(() => {
//       result.current[self].set(promise);
//   });
//   expect(renderTimes).toStrictEqual(2);
//   expect(result.current[self].map(() => false, () => true)).toStrictEqual(true);
//   expect(() => result.current[self].map(() => false, (s) => s[self].value, e => e))
//       .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
//   expect(() => result.current[self].get())
//       .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

//   await act(async () => {
//       await promise;
//   })
//   expect(renderTimes).toStrictEqual(3);
//   expect(result.current[self].map(() => false, () => true)).toStrictEqual(false);
//   expect(result.current[self].map(() => false, (s) => s[self].value, e => e)).toEqual(false);
//   expect(result.current[self].get()).toEqual(200);
});

test.skip('primitive: should rerender used on promise resolved', async () => {
//   let renderTimes = 0
//   const { result } = renderHook(() => {
//       renderTimes += 1;
//       return useState(0)
//   });
//   expect(renderTimes).toStrictEqual(1);
//   expect(result.current[self].get()).toStrictEqual(0);

//   const promise = Promise.resolve(100)
//   act(() => {
//       result.current[self].set(promise);
//   });
//   expect(renderTimes).toStrictEqual(2);
//   expect(result.current[self].map(() => false, () => true)).toStrictEqual(true);
//   expect(() => result.current[self].map(() => false, (s) => s[self].value, e => e))
//       .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
//   expect(() => result.current[self].get())
//       .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

//   await act(async () => {
//       await promise;
//   })
//   expect(renderTimes).toStrictEqual(3);
//   expect(result.current[self].map(() => false, () => true)).toStrictEqual(false);
//   expect(result.current[self].map(() => false, (s) => s[self].value, e => e)).toEqual(false);
//   expect(result.current[self].get()).toEqual(100);
});

test.skip('primitive: should rerender used on promise reject', async () => {
//   let renderTimes = 0
//   const { result } = renderHook(() => {
//       renderTimes += 1;
//       return useState(0)
//   });
//   expect(renderTimes).toStrictEqual(1);
//   expect(result.current[self].get()).toStrictEqual(0);

//   const promise = new Promise<number>((resolve, reject) => setTimeout(() => {
//       act(() => reject('some error promise'))
//   }, 500))
//   act(() => {
//       result.current[self].set(promise);
//   });
//   expect(renderTimes).toStrictEqual(2);
//   expect(result.current[self].map(() => false, () => true)).toStrictEqual(true);
//   expect(() => result.current[self].map(() => false, (s) => s[self].value, e => e))
//       .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
//   expect(() => result.current[self].get())
//       .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

//   try {
//       await act(async () => {
//           await promise
//           return undefined
//       });
//   } catch (err) {
//       // ignore
//   }
//   expect(renderTimes).toStrictEqual(3);
//   expect(result.current[self].map(() => false, () => true)).toStrictEqual(false);
//   expect(result.current[self].map(() => false, (s) => s[self].value, e => e)).toEqual('some error promise');
//   expect(() => result.current[self].get()).toThrow('some error promise');
});

test.skip('primitive: should rerender used on promise rejected', async () => {
//   let renderTimes = 0
//   const { result } = renderHook(() => {
//       renderTimes += 1;
//       return useState(0)
//   });
//   expect(renderTimes).toStrictEqual(1);
//   expect(result.current[self].get()).toStrictEqual(0);

//   const promise = Promise.reject('some error rejected')
//   act(() => {
//       result.current[self].set(promise);
//   });
//   expect(renderTimes).toStrictEqual(2);
//   expect(result.current[self].map(() => false, () => true)).toStrictEqual(true);
//   expect(() => result.current[self].map(() => false, (s) => s[self].value, e => e))
//       .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
//   expect(() => result.current[self].get())
//       .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

//   await act(async () => {
//       try {
//           await promise;
//       } catch (err) {
//           // ignore
//       }
//   })
//   expect(renderTimes).toStrictEqual(3);
//   expect(result.current[self].map(() => false, () => true)).toStrictEqual(false);
//   expect(result.current[self].map()).toStrictEqual([false, 'some error rejected', undefined]);
//   expect(result.current[self].map(() => false, (s) => s[self].value, e => e)).toEqual('some error rejected');
//   expect(() => result.current[self].get()).toThrow('some error rejected');
});

test.skip('primitive: should rerender used on promise resolve init', async () => {
//   let renderTimes = 0
//   const { result } = renderHook(() => {
//       renderTimes += 1;
//       return useState(new Promise<number>(resolve => setTimeout(() => {
//           act(() => resolve(100))
//       }, 500)))
//   });
//   expect(renderTimes).toStrictEqual(1);
//   expect(result.current[self].map(() => false, () => true)).toStrictEqual(true);
//   expect(() => result.current[self].map(() => false, (s) => s[self].value, e => e))
//       .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
//   expect(() => result.current[self].get())
//       .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

//   await act(async () => {
//       await new Promise(resolve => setTimeout(() => act(() => resolve()), 600));
//   })
//   expect(renderTimes).toStrictEqual(2);
//   expect(result.current[self].map(() => false, () => true)).toStrictEqual(false);
//   expect(result.current[self].map(() => false, (s) => s[self].value, e => e)).toEqual(false);
//   expect(result.current[self].get()).toEqual(100);
});

test.skip('primitive: should rerender used on promise resolve init global', async () => {
//   let renderTimes = 0

//   const stateInf = createState(new Promise<number>(resolve => setTimeout(() => {
//       act(() => resolve(100))
//   }, 500)))

//   const { result } = renderHook(() => {
//       renderTimes += 1;
//       return useState(stateInf)
//   });
//   expect(renderTimes).toStrictEqual(1);
//   expect(result.current[self].map(() => false, () => true)).toStrictEqual(true);
//   expect(() => result.current[self].map(() => false, (s) => s[self].value, e => e))
//       .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
//   expect(() => result.current[self].get())
//       .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

//   await act(async () => {
//       await new Promise(resolve => setTimeout(() => act(() => resolve()), 600));
//   })
//   expect(renderTimes).toStrictEqual(2);
//   expect(result.current[self].map(() => false, () => true)).toStrictEqual(false);
//   expect(result.current[self].map(() => false, (s) => s[self].value, e => e)).toEqual(false);
//   expect(result.current[self].get()).toEqual(100);
});

test.skip('primitive: should rerender used on promise reject init global', async () => {
//   let renderTimes = 0

//   const stateInf = createState(new Promise<number>((resolve, reject) => setTimeout(() => {
//       act(() => reject('some error init global'))
//   }, 500)))

//   const { result } = renderHook(() => {
//       renderTimes += 1;
//       return useState(stateInf)
//   });
//   expect(renderTimes).toStrictEqual(1);
//   expect(result.current[self].map(() => false, () => true)).toStrictEqual(true);
//   expect(() => result.current[self].map(() => false, (s) => s[self].value, e => e))
//       .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');
//   expect(() => result.current[self].get())
//       .toThrow('Error: HOOKSTATE-103 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-103');

//   try {
//       await act(async () => {
//           await new Promise(resolve => setTimeout(() => act(() => resolve()), 600));
//       })
//   } catch (err) {
//       //
//   }
//   expect(renderTimes).toStrictEqual(2);
//   expect(result.current[self].map(() => false, () => true)).toStrictEqual(false);
//   expect(result.current[self].map(() => false, (s) => s[self].value, e => e)).toEqual('some error init global');
//   expect(() => result.current[self].get()).toThrow('some error init global');
});















