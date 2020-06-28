import { mount } from "@vue/test-utils";
import { useState, self, State, none} from "../src";
import { h, nextTick } from "vue";

test('complex: should rerender used', async () => {
  let renderTimes = 0;

    let result: State<{field1:number, field2: string}[]> = {} as any;

    const wrapper = mount({      
        setup() {            
            result = useState([{
              field1: 0,
              field2: 'str'
            }]);
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
    expect(result[0][self].get().field1).toStrictEqual(0);

    result[0].field1[self].set(p => p + 1);
    await nextTick();

    expect(renderTimes).toStrictEqual(2);
    expect(result[self].get()[0].field1).toStrictEqual(1);
    expect(Object.keys(result[0])).toEqual(['field1', 'field2']);
    expect(Object.keys(result[self].get()[0])).toEqual(['field1', 'field2']);
})

it.todo('complex: should rerender used via nested')
it.todo('complex: should rerender used when set to the same')
it.todo('complex: should rerender unused when new element')
it.todo('complex: should not rerender unused property')
it.todo('complex: should not rerender unused self')
it.todo('complex: should delete property when set to none')
it.todo('complex: should auto save latest state for unmounted')
