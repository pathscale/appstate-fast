import { mount } from "@vue/test-utils";
import { useState, self, State } from "../src";
import { h, nextTick } from "vue";

test("primitive: should rerender used after merge update", async () => {
  let renderTimes = 0;

  let result: State<number> = {} as any;

  const wrapper = mount({
      setup() {
          result = useState(1);
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
  expect(result[self].get()).toStrictEqual(1);

  result[self].merge((p) => p + 1);
  await nextTick();
  expect(renderTimes).toStrictEqual(2);
  expect(result[self].get()).toStrictEqual(2);
});

test('string: should rerender used after merge update', async () => {
  let renderTimes = 0;

  let result: State<string> = {} as any;

  const wrapper = mount({
      setup() {
          result = useState('str');
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
  expect(result[self].get()).toStrictEqual('str');
  
  result[self].merge('str');
  await nextTick();
  expect(renderTimes).toStrictEqual(2);
  expect(result[self].get()).toStrictEqual('strstr');
})

it.todo("object: should rerender used after merge update");
it.todo("object: should rerender used after merge insert");
it.todo("object: should rerender used after merge delete");
it.todo("object: should rerender used after merge complex");
it.todo("object: should not rerender unused after merge update");
it.todo("array: should rerender used after merge update");
it.todo("array: should rerender used after merge insert");
it.todo("array: should rerender used after merge concat");
it.todo("array: should rerender used after merge concat (scoped)");
it.todo("array: should rerender used after merge delete");
it.todo("array: should rerender used after merge complex");
it.todo("array: should not rerender unused after merge update");
