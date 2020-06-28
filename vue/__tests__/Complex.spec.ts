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

test('complex: should rerender used via nested', async () => {
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
  expect(result[0].field1[self].get()).toStrictEqual(0);

  result[0].field1[self].set(p => p + 1);
  await nextTick();

  expect(renderTimes).toStrictEqual(2);
    expect(result[0].field1[self].get()).toStrictEqual(1);
    expect(Object.keys(result[0])).toEqual(['field1', 'field2']);
    expect(Object.keys(result[0][self].get())).toEqual(['field1', 'field2']);
})

test('complex: should rerender used when set to the same', async () => {
  let renderTimes = 0;

  let result: State<[{field:number}]> = {} as any;

  const wrapper = mount({
      setup() {
          result = useState([{
            field: 1,
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
  expect(result[0][self].get()).toEqual({ field: 1 });

  result[self].set(p => p);
  await nextTick();

  expect(renderTimes).toStrictEqual(2);
  expect(result[0][self].get()).toEqual({ field: 1 });
  expect(Object.keys(result[0])).toEqual(['field']);
  expect(Object.keys(result[0][self].get())).toEqual(['field']);
})

it.todo('complex: should rerender unused when new element')
it.todo('complex: should not rerender unused property')
it.todo('complex: should not rerender unused self')
it.todo('complex: should delete property when set to none')
it.todo('complex: should auto save latest state for unmounted')
