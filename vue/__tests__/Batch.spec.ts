import { mount } from "@vue/test-utils";
import { useState, self, State } from "../src";
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

    result.field1[self].set((p) => p + 1);
    result.field2[self].set((p) => p + 'str');
    await nextTick();

    expect(renderTimes).toStrictEqual(2);
    expect(result.field1[self].get()).toStrictEqual(1);
    expect(result.field2[self].get()).toStrictEqual('strstr');

    expect(Object.keys(result)).toEqual(['field1', 'field2']);
    expect(Object.keys(result[self].get())).toEqual(['field1', 'field2']);
    
})

it.todo('object: should rerender used via nested batch merge')

it.todo('object: should rerender used via nested batch double')

it.todo('object: should rerender used via nested batch promised')

it.todo('object: should rerender used via nested batch promised manual')

it.todo('object: should rerender used via scoped batched updates')
