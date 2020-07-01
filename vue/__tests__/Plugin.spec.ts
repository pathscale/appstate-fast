import { useState, State, createState, Plugin, self,
  DevToolsID, DevTools, DevToolsExtensions, PluginCallbacks } from '../';
import { mount,  } from "@vue/test-utils";
import { h, nextTick, } from "vue";

const TestPlugin = Symbol('TestPlugin')
const TestPluginUnknown = Symbol('TestPluginUnknown')

test('plugin: common flow callbacks', async () => {
  let renderTimes = 0
  let result: any = {} as any;
  const messages: string[] = []

  const wrapper = mount({      
    setup() {            
        result = useState([{
          f1: 0,
          f2: 'str'
      }])[self].attach(() => ({
          id: TestPlugin,
          init: () => {
              messages.push('onInit called')
              return {
                  onBatchStart: (p) => {
                      messages.push(`onBatchStart called, [${p.path}]: ${JSON.stringify(p.state)}, context: ${JSON.stringify(p.context)}`)
                  },
                  onBatchFinish: (p) => {
                      messages.push(`onBatchFinish called, [${p.path}]: ${JSON.stringify(p.state)}, context: ${JSON.stringify(p.context)}`)
                  },
                  onSet: (p) => {
                      messages.push(`onSet called, [${p.path}]: ${JSON.stringify(p.state)}, ${JSON.stringify(p.previous)} => ${JSON.stringify(p.value)}, ${JSON.stringify(p.merged)}`)
                  },
                  onDestroy: (p) => {
                      messages.push(`onDestroy called, ${JSON.stringify(p.state)}`)
                  },
                  onExtension() {
                      messages.push('onExtension called')
                  }
              }
          }
      }))
      return () => {
        ++renderTimes;
        return h(
            "div",
            Object.keys(result).map((x) => x)
        );
      };
    }
  })
  
  expect(DevTools(result[0]).label('should not be labelled')).toBeUndefined();
  expect(DevTools(result[0]).log('should not be logged')).toBeUndefined();

  expect(renderTimes).toStrictEqual(1);
  expect(messages).toEqual(['onInit called'])
  expect(result[0][self].get().f1).toStrictEqual(0);
  expect(messages).toEqual(['onInit called'])

  result[self].set([{ f1: 0, f2: 'str2' }]);
  await nextTick();

  expect(renderTimes).toStrictEqual(2);
  expect(messages.slice(1)).toEqual(['onSet called, []: [{\"f1\":0,\"f2\":\"str2\"}], [{\"f1\":0,\"f2\":\"str\"}] => [{\"f1\":0,\"f2\":\"str2\"}], undefined'])

  expect(result[self].get()[0].f1).toStrictEqual(0);
  expect(result[self].get()[0].f2).toStrictEqual('str2');
  expect(Object.keys(result[0])).toEqual(['f1', 'f2']);
  expect(Object.keys(result[self].get()[0])).toEqual(['f1', 'f2']);
  expect(messages.slice(2)).toEqual([])

  result[0].f1[self].set((p:any) => p + 1);
  await nextTick();
  
  expect(renderTimes).toStrictEqual(3);
  expect(messages.slice(2)).toEqual(['onSet called, [0,f1]: [{\"f1\":1,\"f2\":\"str2\"}], 0 => 1, undefined'])
  
  expect(result[self].get()[0].f1).toStrictEqual(1);
  expect(Object.keys(result[0])).toEqual(['f1', 'f2']);
  expect(Object.keys(result[self].get()[0])).toEqual(['f1', 'f2']);
  expect(messages.slice(3)).toEqual([])
  
  result[0][self].merge((p:any) => ({ f1 : p.f1 + 1 }));
  await nextTick();

  expect(renderTimes).toStrictEqual(4);
  expect(messages.slice(3)).toEqual(['onSet called, [0]: [{\"f1\":2,\"f2\":\"str2\"}], {\"f1\":2,\"f2\":\"str2\"} => {\"f1\":2,\"f2\":\"str2\"}, {\"f1\":2}'])

  expect(result[self].get()[0].f1).toStrictEqual(2);
  expect(Object.keys(result[0])).toEqual(['f1', 'f2']);
  expect(Object.keys(result[self].get()[0])).toEqual(['f1', 'f2']);
  expect(messages.slice(4)).toEqual([]);

  (result[self].attach(TestPlugin)[0] as { onExtension(): void; }).onExtension();
  expect(messages.slice(4)).toEqual(['onExtension called']);

  result[self].map((s:any) => {
    messages.push(`batch executed, state: ${JSON.stringify(s[self].get())}`)
  }, 'custom context')
  expect(messages.slice(5)).toEqual(['onBatchStart called, []: [{\"f1\":2,\"f2\":\"str2\"}], context: \"custom context\"', 'batch executed, state: [{\"f1\":2,\"f2\":\"str2\"}]', 'onBatchFinish called, []: [{\"f1\":2,\"f2\":\"str2\"}], context: \"custom context\"'])
  expect(result[self].attach(TestPluginUnknown)[0] instanceof Error).toEqual(true)

  expect(result[self].get()[0].f1).toStrictEqual(2);
  expect(result[self].get()[0].f2).toStrictEqual('str2');
  const controls = result[self].attach(TestPlugin)[1];
  expect(renderTimes).toStrictEqual(4);
  
  controls.setUntracked([{ f1: 0, f2: 'str3' }])

  expect(renderTimes).toStrictEqual(4);
  expect(messages.slice(8)).toEqual(['onSet called, []: [{\"f1\":0,\"f2\":\"str3\"}], [{\"f1\":2,\"f2\":\"str2\"}] => [{\"f1\":0,\"f2\":\"str3\"}], undefined']);

  expect(result[self].get()[0].f1).toStrictEqual(0);
  expect(result[self].get()[0].f2).toStrictEqual('str3');
  expect(renderTimes).toStrictEqual(4);
  const controlsNested = result[0].f2[self].attach(TestPlugin)[1];

  controlsNested.mergeUntracked('str2')

  expect(renderTimes).toStrictEqual(4);
  expect(messages.slice(9)).toEqual(
      ['onSet called, [0,f2]: [{"f1":0,"f2":"str3str2"}], "str3" => "str3str2", "str2"']);

  expect(result[self].get()[0].f1).toStrictEqual(0);
  expect(result[self].get()[0].f2).toStrictEqual('str3str2');

  controlsNested.rerender([[0, 'f1'], [0, 'f2']])
  await nextTick();

  expect(renderTimes).toStrictEqual(5);
  expect(messages.slice(10)).toEqual([]);

  expect(result[self].get()[0].f1).toStrictEqual(0);
  expect(result[self].get()[0].f2).toStrictEqual('str3str2');

  controlsNested.rerender([[0, 'unknown'], [0, 'f2']])
  await nextTick();

  expect(renderTimes).toStrictEqual(6);
  expect(messages.slice(10)).toEqual([]);

  expect(result[self].get()[0].f1).toStrictEqual(0);
  expect(result[self].get()[0].f2).toStrictEqual('str3str2');

  controlsNested.rerender([[0, 'unknown'], [1]])
  await nextTick();

  expect(renderTimes).toStrictEqual(7);
  expect(messages.slice(10)).toEqual([]);

  expect(result[self].get()[0].f1).toStrictEqual(0);
  expect(result[self].get()[0].f2).toStrictEqual('str3str2');

  controlsNested.rerender([[0, 'unknown']])

  expect(renderTimes).toStrictEqual(7);
  expect(messages.slice(10)).toEqual([]);

  expect(result[self].get()[0].f1).toStrictEqual(0);
  expect(result[self].get()[0].f2).toStrictEqual('str3str2');

  controlsNested.rerender([[0]])
  await nextTick();

  expect(renderTimes).toStrictEqual(8);
  expect(messages.slice(10)).toEqual([]);

  //WHERE CAN WE GET THE UNMOUNT FUNCTION
  // unmount()
  // expect(messages.slice(10)).toEqual(['onDestroy called, [{\"f1\":0,\"f2\":\"str3str2\"}]'])

  // expect(result[self].get()[0].f1).toStrictEqual(0);
  // expect(messages.slice(11)).toEqual([])

  // expect(() => result[0].f1[self].set((p:any) => p + 1)).toThrow(
  //     'Error: HOOKSTATE-106 [path: /0/f1]. See https://hookstate.js.org/docs/exceptions#hookstate-106'
  // );

  // expect(renderTimes).toStrictEqual(8);
  // expect(messages.slice(11)).toEqual([])
})


it.todo('plugin: common flow callbacks global state')

it.todo('plugin: common flow callbacks devtools')

it.todo('plugin: common flow callbacks global state devtools')
