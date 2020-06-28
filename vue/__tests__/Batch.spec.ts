import { mount } from "@vue/test-utils";
import { useState, self, State, none} from "../src";
import { h, nextTick } from "vue";

test('object: should rerender used via nested batch update', async () => {
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
    expect(result.field1[self].get()).toStrictEqual(0);
    expect(result.field2[self].get()).toStrictEqual('str');
    result[self].map(()=>{
        result.field1[self].set((p) => p + 1);
        result.field2[self].set((p) => p + 'str');
    })
    await nextTick();

    expect(renderTimes).toStrictEqual(2);
    expect(result.field1[self].get()).toStrictEqual(1);
    expect(result.field2[self].get()).toStrictEqual('strstr');

    expect(Object.keys(result)).toEqual(['field1', 'field2']);
    expect(Object.keys(result[self].get())).toEqual(['field1', 'field2']);
    
})

test('object: should rerender used via nested batch merge', async () => {
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
                    result
                );
            };
        },
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.field1[self].get()).toStrictEqual(0);
    expect(result.field2[self].get()).toStrictEqual('str');

    result[self].map(()=>{
        result[self].merge(p=>({
            field1: p.field1 +1,
            field2: p.field2 + 'str'
        }))
    }, null)
    
    await nextTick();

    expect(renderTimes).toStrictEqual(2);
    expect(result.field1[self].get()).toStrictEqual(1);
    expect(result.field2[self].get()).toStrictEqual('strstr');
    
    expect(Object.keys(result)).toEqual(['field1', 'field2']);
    expect(Object.keys(result[self].get())).toEqual(['field1', 'field2']);
})

test('object: should rerender used via nested batch double', async () => {
    let renderTimes = 0;
    let result: State<{field1:number, field2: string}> = {} as any;
    const wrapper = mount({      
        setup() {            
            result = useState({
              field1: 0,
              field2: 'str',
            });
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
    expect(result.field1[self].get()).toStrictEqual(0);
    expect(result.field2[self].get()).toStrictEqual('str');

    result[self].map(()=>{
        result.field2[self].set(p => p + '-before-')
        result[self].map(()=>{
            result[self].merge(p=>({
                field1: p.field1 +1,
                field2: p.field2 + 'str'
            }))
        }, null)
        result.field2[self].set(p => p + '-after-')
    }, null)
    
    await nextTick();

    expect(renderTimes).toStrictEqual(2);
    expect(result.field1[self].get()).toStrictEqual(1);
    expect(result.field2[self].get()).toStrictEqual('str-before-str-after-');
    expect(Object.keys(result)).toEqual(['field1', 'field2']);
    expect(Object.keys(result[self].get())).toEqual(['field1', 'field2']);

})

// test('object: should rerender used via nested batch promised', async () => {
    
//     let renderTimes = 0;
//     let result: State<number> = 0 as any;
//     const wrapper = mount({
//         setup() {
//             result = useState(0);
//             return () => {
//                 ++renderTimes;
//                 return h(
//                     "div",
//                     result.map((x) => x.value)
//                 );
//             };
//         },
//     });

    //TO DO !

    // expect(renderTimes).toStrictEqual(1);
    // expect(result[self].get()).toStrictEqual(0);
    // const promise = new Promise<number>(resolve => setTimeout(async () => {
    //     resolve(100)
    //     await nextTick();
    // }, 500))
    // result[self].set(promise);
// })

it.todo('object: should rerender used via nested batch promised')

it.todo('object: should rerender used via nested batch promised manual')

test('object: should rerender used via scoped batched updates', async () => {
})
