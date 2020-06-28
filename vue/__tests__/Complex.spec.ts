import { mount } from "@vue/test-utils";
import { useState, createState, self, State, none} from "../src";
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

  let result: State<{field:number}[]> = {} as any;

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

test('complex: should rerender unused when new element', async () => {

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

  result[0]['field3'][self].set(1);
  await nextTick();

  expect(renderTimes).toStrictEqual(2);
    expect(result[0][self].get()).toEqual({
        field1: 0,
        field2: 'str',
        field3: 1
    });
    expect(Object.keys(result[0])).toEqual(['field1', 'field2', 'field3']);
    expect(Object.keys(result[0][self].get())).toEqual(['field1', 'field2', 'field3']);
    expect(result[0][self].get().field1).toStrictEqual(0);
    expect(result[0][self].get().field2).toStrictEqual('str');
    // tslint:disable-next-line: no-string-literal
    expect(result[0][self].get()['field3']).toStrictEqual(1);

})


test('complex: should not rerender unused property', async () => {
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
  })

  expect(renderTimes).toStrictEqual(1);
    
  result[0].field1[self].set(p => p + 1);
  await nextTick();

  expect(renderTimes).toStrictEqual(1);
  expect(result[0][self].get().field1).toStrictEqual(1);

})

test('complex: should not rerender unused self', async () => {
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
  })

  result[0].field1[self].set(2);
  await nextTick();
  expect(renderTimes).toStrictEqual(1);
  expect(result[0][self].get().field1).toStrictEqual(2);
})

test('complex: should delete property when set to none', async () => {
  let renderTimes = 0;

  let result: any // do we need set up the type here? it's not accepting boolean

  const wrapper = mount({      
      setup() {            
          result = useState([{
            field1: 0,
            field2: 'str',
            field3: true
          }]);
          return () => {
              ++renderTimes;
              return h(
                  "div",
                  JSON.stringify(result)
              );
          };
      },
  })

  expect(renderTimes).toStrictEqual(1);
  expect(result[0][self].get().field1).toStrictEqual(0);

  result[0].field1[self].set(none);
  await nextTick();

  expect(renderTimes).toStrictEqual(2);
  expect(result[0][self].get()).toEqual({ field2: 'str', field3: true });
  expect(Object.keys(result[0][self].get())).toEqual(['field2', 'field3']);

  result[0].field1[self].set(none);
  // await nextTick(); // DO WE NEED TO SET THE NEXTICK() HERE? CURRENTLY IT THROWS AN ERROR
  expect(renderTimes).toStrictEqual(2);
  expect(result[0][self].get()).toEqual({ field2: 'str', field3: true });

  result[0].field1[self].set(1);
  await nextTick();

  expect(renderTimes).toStrictEqual(3);
  expect(result[0][self].get().field1).toEqual(1);

  result[0].field2[self].set(none);
  await nextTick();
  
  expect(renderTimes).toStrictEqual(4);
  expect(result[0][self].get()).toEqual({ field1: 1, field3: true });
})

test('complex: should auto save latest state for unmounted', async () => {
  let renderTimes = 0;

  const state = createState([{
    field1: 0,
    field2: 'str'
  }])

  let result: any // do we need set up the type here?  

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
  })
  const unmountedLink = state[0]
  expect(unmountedLink.field1[self].get()).toStrictEqual(0);
  expect(result[0][self].get().field1).toStrictEqual(0);

  result[0].field1[self].set(2);
  await nextTick();

  expect(renderTimes).toStrictEqual(2);
  expect(unmountedLink.field1[self].get()).toStrictEqual(2);
  expect(result[0][self].get().field1).toStrictEqual(2);
})