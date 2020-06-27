import { mount, act } from "@vue/test-utils";
import { useState, self, State } from "../src";
import { h, nextTick } from "vue";

test('object: should rerender used via nested batch update', async () => {
  let renderTimes = 0;

    let result: State<{field1:number, field2: string}> = {} as any;

    const wrapper = mount({      
        setup() {
            renderTimes += 1;
            result = useState({
              field1: 0,
              field2: 'str'
            });
            return () => {                
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
  });
})

it.todo('object: should rerender used via nested batch merge')

it.todo('object: should rerender used via nested batch double')

it.todo('object: should rerender used via nested batch promised')

it.todo('object: should rerender used via nested batch promised manual')

it.todo('object: should rerender used via scoped batched updates')
