import { mount } from "@vue/test-utils";
import { useState, self, State, createState, none} from "../src";
import { h, nextTick } from "vue";


test('primitive: should rerender used on promise resolve', async () => {
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

  const promise = new Promise<number>(resolve => setTimeout(() => {
    () => resolve(100)
  }, 500))

  result[self].set(promise);
  await nextTick();

  expect(renderTimes).toStrictEqual(2);
  expect(result[self].map(() => false, () => true)).toStrictEqual(true);
  expect(result[self].map()).toStrictEqual([true, undefined, undefined]);
  expect(() => result[self].map(() => false, (s) => s[self].keys, e => e))
      .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');
  expect(() => result[self].get())
      .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');

  expect(() => result[self].set(200))
      .toThrow('Error: APPSTATE-FAST-104 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-104')
      
  await promise;

  expect(renderTimes).toStrictEqual(3);
  expect(result.map(() => false, () => true)).toStrictEqual(false);
  expect(result[self].map()).toStrictEqual([false, undefined, 100]);
  expect(result[self].map(() => false, (s) => s[self].value, e => e)).toEqual(false);
  expect(result[self].get()).toEqual(100);
});

test('array: should rerender used on promise resolve', async () => {
    let renderTimes = 0;

    let result: State<number[]> = {} as any;
    const wrapper = mount({
        setup() {
            result = useState([0]);
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
    expect(result[0].get()).toStrictEqual(0);

    const promise = new Promise<number[]>(resolve => setTimeout(() => {
        () => resolve([100])
    }, 500))
    
    result[self].set(promise);
    await nextTick();
    
    expect(renderTimes).toStrictEqual(2);
    expect(result[self].map(() => false, () => true)).toStrictEqual(true);
    expect(() => result[self].map(() => false, (s) => s[self].keys, e => e))
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');
    expect(() => result[self].get())
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');

    expect(() => result[self].set([200]))
        .toThrow('Error: APPSTATE-FAST-104 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-104')
        
    async () => {
        await promise;
    }
    
    expect(renderTimes).toStrictEqual(3);
    expect(result[self].map(() => false, () => true)).toStrictEqual(false);
    expect(result[self].map(() => false, (s) => s[self].value, e => e)).toEqual(false);
    expect(result[self].get()).toEqual([100]);
});

test('array: should rerender used on promise resolve (global)', async () => {
    let renderTimes = 0;    
    let result: State<number[]> = {} as any;
    const state = createState([0])

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
    expect(result[0].get()).toStrictEqual(0);

    const promise = new Promise<number[]>(resolve => setTimeout(() => {
        () => resolve([100])
    }, 500))
  
    result[self].set(promise);
    await nextTick();

    expect(renderTimes).toStrictEqual(2);
    expect(result[self].map(() => false, () => true)).toStrictEqual(true);
    expect(() => result[self].map(() => false, (s) => s[self].keys, e => e))
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');
    expect(() => result[self].get())
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');

    expect(() => result[self].set([200]))
        .toThrow('Error: APPSTATE-FAST-104 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-104')
      
    async () => {
        await promise;        
    }

    expect(renderTimes).toStrictEqual(3);
    expect(result[self].map(() => false, () => true)).toStrictEqual(false);
    expect(result[self].map(() => false, (s) => s[self].value, e => e)).toEqual(false);
    expect(result[self].get()).toEqual([100]);
});

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

test('primitive: should rerender used on promise resolve manual', async () => {
    let renderTimes = 0;    
    let result: any = none as any;

    const wrapper = mount({
        setup() {
            result = useState(none);
            return () => {
                ++renderTimes;
                return h(
                    "div",
                    result
                );
            };
        },
    });

    expect(renderTimes).toStrictEqual(1);
    expect(result[self].map(() => false, () => true)).toStrictEqual(true);
    expect(() => result[self].map(() => false, (s:any) => s[self].value, (e:any) => e))
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');
    expect(() => result[self].get())
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');

    result[self].set(100);
    await nextTick();

    expect(renderTimes).toStrictEqual(2);
    expect(result[self].map(() => false, () => true)).toStrictEqual(false);
    expect(result[self].map(() => false, (s:any) => s[self].value, (e:any) => e)).toEqual(false);
    expect(result[self].get()).toEqual(100);
});

test('primitive: should rerender used on promise resolve second', async () => {
    let renderTimes = 0;    
    let result: State<number> = {} as any;

    const wrapper = mount({
        setup() {
            result = useState(new Promise<number>(resolve => setTimeout(() => {
                () => resolve(100)
            }, 500)));
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
    expect(() => result[self].map(() => false, (s) => s[self].value, e => e))
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');
    expect(() => result[self].get())
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');

    const promise = new Promise<number>(resolve => setTimeout(() => {
        () => resolve(200)
    }, 500))

    result[self].set(promise);
    await nextTick();

    expect(renderTimes).toStrictEqual(2);
    expect(result[self].map(() => false, () => true)).toStrictEqual(true);
    expect(() => result[self].map(() => false, (s) => s[self].value, e => e))
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');
    expect(() => result[self].get())
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');

    async () => {
        await promise;
    }
    expect(renderTimes).toStrictEqual(3);
    expect(result[self].map(() => false, () => true)).toStrictEqual(false);
    expect(result[self].map(() => false, (s) => s[self].value, e => e)).toEqual(false);
    expect(result[self].get()).toEqual(200);
});

test('primitive: should rerender used on promise resolved', async () => {
    let renderTimes = 0;

    let result: State<number> = {} as any;
    const wrapper = mount({
        setup() {
            result = useState(0);
            return () => {
                ++renderTimes;
                return h(
                    "div",
                    result
                );
            };
        },
    });

    expect(renderTimes).toStrictEqual(1);
    expect(result[self].get()).toStrictEqual(0);

    const promise = Promise.resolve(100)
    
    result[self].set(promise);
    await nextTick();
    
    expect(renderTimes).toStrictEqual(2);
    expect(result[self].map(() => false, () => true)).toStrictEqual(true);
    expect(() => result[self].map(() => false, (s) => s[self].value, e => e))
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');
    expect(() => result[self].get())
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');

    async () => {
        await promise;
    }
    expect(renderTimes).toStrictEqual(3);
    expect(result[self].map(() => false, () => true)).toStrictEqual(false);
    expect(result[self].map(() => false, (s) => s[self].value, e => e)).toEqual(false);
    expect(result[self].get()).toEqual(100);
});

test('primitive: should rerender used on promise reject', async () => {
    let renderTimes = 0;
    let result: State<number> = {} as any;
    const wrapper = mount({
        setup() {
            result = useState(0);
            return () => {
                ++renderTimes;
                return h(
                    "div",
                    result
                );
            };
        },
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result[self].get()).toStrictEqual(0);

    const promise = new Promise<number>((resolve, reject) => setTimeout(() => {
        reject('some error promise')
    }, 500))
  
    result[self].set(promise);
    await nextTick();
    
    expect(renderTimes).toStrictEqual(2);
    expect(result[self].map(() => false, () => true)).toStrictEqual(true);
    expect(() => result[self].map(() => false, (s) => s[self].value, e => e))
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');
    expect(() => result[self].get())
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');

    try {
        async () => {
            await promise
            return undefined
        };
    } catch (err) {
        // ignore
    }
    
    expect(renderTimes).toStrictEqual(3);
    expect(result[self].map(() => false, () => true)).toStrictEqual(false);
    expect(result[self].map(() => false, (s) => s[self].value, e => e)).toEqual('some error promise');
    expect(() => result[self].get()).toThrow('some error promise');
});

test('primitive: should rerender used on promise rejected', async () => {
    let renderTimes = 0;
    let result: State<number> = {} as any;
    const wrapper = mount({
        setup() {
            result = useState(0);
            return () => {
                ++renderTimes;
                return h(
                    "div",
                    result
                );
            };
        },
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result[self].get()).toStrictEqual(0);

    const promise = Promise.reject('some error rejected')
    result[self].set(promise);
    await nextTick();

    expect(renderTimes).toStrictEqual(2);
    expect(result[self].map(() => false, () => true)).toStrictEqual(true);
    expect(() => result[self].map(() => false, (s) => s[self].value, e => e))
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');
    expect(() => result[self].get())
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');

    async () => {
        try {
            await promise;
        } catch (err) {
            // ignore
        }
    }
    expect(renderTimes).toStrictEqual(3);
    expect(result[self].map(() => false, () => true)).toStrictEqual(false);
    expect(result[self].map()).toStrictEqual([false, 'some error rejected', undefined]);
    expect(result[self].map(() => false, (s) => s[self].value, e => e)).toEqual('some error rejected');
    expect(() => result[self].get()).toThrow('some error rejected');
});

test('primitive: should rerender used on promise resolve init', async () => {
    let renderTimes = 0;
    let result: any = {} as any;
    const wrapper = mount({
        setup() {
            result = useState(new Promise<number>(resolve => setTimeout(() => {
                resolve(100)
            }, 500)));
            return () => {
                ++renderTimes;
                return h(
                    "div",
                    result
                );
            };
        },
    });

    expect(renderTimes).toStrictEqual(1);
    expect(result[self].map(() => false, () => true)).toStrictEqual(true);
    expect(() => result[self].map(() => false, (s: any) => s[self].value, (e: any) => e))
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');
    expect(() => result[self].get())
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');

    async () => {
        await new Promise(resolve => setTimeout(() => resolve(), 600));
    }
    expect(renderTimes).toStrictEqual(2);
    expect(result[self].map(() => false, () => true)).toStrictEqual(false);
    expect(result[self].map(() => false, (s:any) => s[self].value, (e:any) => e)).toEqual(false);
    expect(result[self].get()).toEqual(100);
});

test('primitive: should rerender used on promise resolve init global', async () => {
    let renderTimes = 0;
    const stateInf = createState(new Promise<number>(resolve => setTimeout(() => {
        resolve(100)
    }, 500)))
    let result: State<number> = {} as any;
    const wrapper = mount({
        setup() {
            result = useState(stateInf)
            return () => {
                ++renderTimes;
                return h(
                    "div",
                    result
                );
            };
        },
    });

    expect(renderTimes).toStrictEqual(1);
    expect(result[self].map(() => false, () => true)).toStrictEqual(true);
    expect(() => result[self].map(() => false, (s:any) => s[self].value, (e:any) => e))
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');
    expect(() => result[self].get())
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');

    async () => {
        await new Promise(resolve => setTimeout(() => resolve(), 600));
    }
    expect(renderTimes).toStrictEqual(2);
    expect(result[self].map(() => false, () => true)).toStrictEqual(false);
    expect(result[self].map(() => false, (s:any) => s[self].value, (e:any) => e)).toEqual(false);
    expect(result[self].get()).toEqual(100);
});

test('primitive: should rerender used on promise reject init global', async () => {
    let renderTimes = 0
    const stateInf = createState(new Promise<number>((resolve, reject) => setTimeout(() => {
        reject('some error init global')
    }, 500)));
    let result: any = {} as any;
    const wrapper = mount({
        setup() {
            result = useState(stateInf)
            return () => {
                ++renderTimes;
                return h(
                    "div",
                    result
                );
            };
        },
    });
    
    expect(renderTimes).toStrictEqual(1);
    expect(result[self].map(() => false, () => true)).toStrictEqual(true);
    expect(() => result[self].map(() => false, (s:any) => s[self].value, (e:any) => e))
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');
    expect(() => result[self].get())
        .toThrow('Error: APPSTATE-FAST-103 [path: /]. See https://vue3.dev/docs/exceptions#appastate-fast-103');

    try {
        async () => {
            await new Promise(resolve => setTimeout(() => resolve(), 600));
        }
    } catch (err) {
        //
    }
    expect(renderTimes).toStrictEqual(2);
    expect(result[self].map(() => false, () => true)).toStrictEqual(false);
    expect(result[self].map(() => false, (s:any) => s[self].value, (e:any) => e)).toEqual('some error init global');
    expect(() => result[self].get()).toThrow('some error init global');
});















