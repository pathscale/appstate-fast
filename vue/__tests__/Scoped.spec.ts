import { mount } from "@vue/test-utils";
import { useState, self, State, Downgraded} from "../src";
import { h, nextTick } from "vue";

test.skip('object: should rerender used via scoped updates by child', async () => {
  let parentRenderTimes = 0
  let childRenderTimes = 0

  let parent: State<{fieldUsedByParent:number, fieldUsedByChild: number,fieldUsedByBoth: number}> = {} as any;
  const wrapperParent = mount({
      setup() {            
          parent = useState({
              fieldUsedByParent: 0,
              fieldUsedByChild: 100,
              fieldUsedByBoth: 200
          });
          return () => {
              ++parentRenderTimes;
              return h(
                  "div",
                  parent
              );
          };
      },
  });

  let child: State<{fieldUsedByParent:number, fieldUsedByChild: number,fieldUsedByBoth: number}> = {} as any;
  const wrapperChild = mount({
      setup() {            
          child = useState(parent);
          return () => {
              ++childRenderTimes;
              return h(
                  "div",
                  child
              );
          };
      },
  });  

  expect(parent.fieldUsedByParent[self].get()).toStrictEqual(0);
  expect(parent.fieldUsedByBoth[self].get()).toStrictEqual(200);
  expect(child.fieldUsedByChild[self].get()).toStrictEqual(100);
  expect(child.fieldUsedByBoth[self].get()).toStrictEqual(200);
  expect(parentRenderTimes).toStrictEqual(1);
  expect(childRenderTimes).toStrictEqual(1);
      
  child.fieldUsedByChild[self].set(p => p + 1);
  await nextTick();
  
  expect(parent.fieldUsedByParent[self].get()).toStrictEqual(0);
  expect(parent.fieldUsedByBoth[self].get()).toStrictEqual(200);
  expect(child.fieldUsedByChild[self].get()).toStrictEqual(101);
  expect(child.fieldUsedByBoth[self].get()).toStrictEqual(200);
  expect(parentRenderTimes).toStrictEqual(1);
  expect(childRenderTimes).toStrictEqual(2);

  child.fieldUsedByParent[self].set(p => p + 1);
  await nextTick();

  expect(parent.fieldUsedByParent[self].get()).toStrictEqual(1);
  expect(parent.fieldUsedByBoth[self].get()).toStrictEqual(200);
  expect(child.fieldUsedByChild[self].get()).toStrictEqual(101);
  expect(child.fieldUsedByBoth[self].get()).toStrictEqual(200);
  expect(parentRenderTimes).toStrictEqual(2);
  expect(childRenderTimes).toStrictEqual(2);

  child.fieldUsedByBoth[self].set(p => p + 1);
  await nextTick();

  expect(parent.fieldUsedByParent[self].get()).toStrictEqual(1);
  expect(parent.fieldUsedByBoth[self].get()).toStrictEqual(201);
  expect(child.fieldUsedByChild[self].get()).toStrictEqual(101);
  expect(child.fieldUsedByBoth[self].get()).toStrictEqual(201);
  // correct if parent is rerendered, child should not
  // as it is rerendered as a child of parent:
  expect(parentRenderTimes).toStrictEqual(3);
  expect(childRenderTimes).toStrictEqual(2);

});

test.skip('object: should rerender used via scoped updates by parent', async () => {
  let parentRenderTimes: number = 0
  let childRenderTimes: number = 0

  let parent: State<{fieldUsedByParent:number, fieldUsedByChild: number,fieldUsedByBoth: number}> = {} as any;
  const wrapperParent = mount({
      setup() {            
          parent = useState({
              fieldUsedByParent: 0,
              fieldUsedByChild: 100,
              fieldUsedByBoth: 200
          });
          return () => {
              ++parentRenderTimes;
              return h(
                  "div",
                  parent
              );
          };
      },
  });

  let child: State<{fieldUsedByParent:number, fieldUsedByChild: number,fieldUsedByBoth: number}> = {} as any;
  const wrapperChild = mount({
      setup() {            
          child = useState(parent);
          return () => {
              ++childRenderTimes;
              return h(
                  "div",
                  child
              );
          };
      },
  });

  expect(parent.fieldUsedByParent[self].get()).toStrictEqual(0);
  expect(parent.fieldUsedByBoth[self].get()).toStrictEqual(200);
  expect(child.fieldUsedByChild[self].get()).toStrictEqual(100);
  expect(child.fieldUsedByBoth[self].get()).toStrictEqual(200);
  expect(parentRenderTimes).toStrictEqual(1);
  expect(childRenderTimes).toStrictEqual(1);

  parent.fieldUsedByChild[self].set(p => p + 1);

  expect(parent.fieldUsedByParent[self].get()).toStrictEqual(0);
  expect(parent.fieldUsedByBoth[self].get()).toStrictEqual(200);
  expect(child.fieldUsedByChild[self].get()).toStrictEqual(101);
  expect(child.fieldUsedByBoth[self].get()).toStrictEqual(200);
  expect(parentRenderTimes).toStrictEqual(1);
  expect(childRenderTimes).toStrictEqual(2);

  parent.fieldUsedByParent[self].set(p => p + 1);

  expect(parent.fieldUsedByParent[self].get()).toStrictEqual(1);
  expect(parent.fieldUsedByBoth[self].get()).toStrictEqual(200);
  expect(child.fieldUsedByChild[self].get()).toStrictEqual(101);
  expect(child.fieldUsedByBoth[self].get()).toStrictEqual(200);
  expect(parentRenderTimes).toStrictEqual(2);
  expect(childRenderTimes).toStrictEqual(2);

  parent.fieldUsedByBoth[self].set(p => p + 1);

  expect(parent.fieldUsedByParent[self].get()).toStrictEqual(1);
  expect(parent.fieldUsedByBoth[self].get()).toStrictEqual(201);
  expect(child.fieldUsedByChild[self].get()).toStrictEqual(101);
  expect(child.fieldUsedByBoth[self].get()).toStrictEqual(201);
  expect(parentRenderTimes).toStrictEqual(3);
  // correct if parent is rerendered, child should not
  // as it is rerendered as a child of parent:
  expect(childRenderTimes).toStrictEqual(2);
});

test.skip('object: should rerender used via scoped updates by parent (disabled tracking)', async () => {
  let parentRenderTimes: number = 0
  let childRenderTimes: number = 0

  let parent: State<{fieldUsedByParent:number, fieldUsedByChild: number,fieldUsedByBoth: number}> = {} as any;
  const wrapperParent = mount({
      setup() {            
          parent = useState({
              fieldUsedByParent: 0,
              fieldUsedByChild: 100,
              fieldUsedByBoth: 200
          })[self].attach(Downgraded)
          return () => {
              ++parentRenderTimes;
              return h(
                  "div",
                  parent
              );
          };
      },
  });

  let child: State<{fieldUsedByParent:number, fieldUsedByChild: number,fieldUsedByBoth: number}> = {} as any;
  const wrapperChild = mount({
      setup() {            
          child = useState(parent);
          return () => {
              ++childRenderTimes;
              return h(
                  "div",
                  child
              );
          };
      },
  }); 

  expect(parent.fieldUsedByParent[self].get()).toStrictEqual(0);
  expect(parent.fieldUsedByBoth[self].get()).toStrictEqual(200);
  expect(child.fieldUsedByChild[self].get()).toStrictEqual(100);
  expect(child.fieldUsedByBoth[self].get()).toStrictEqual(200);
  expect(parentRenderTimes).toStrictEqual(1);
  expect(childRenderTimes).toStrictEqual(1);

  parent.fieldUsedByChild[self].set(p => p + 1);
  await nextTick();

  expect(parent.fieldUsedByParent[self].get()).toStrictEqual(0);
  expect(parent.fieldUsedByBoth[self].get()).toStrictEqual(200);
  expect(child.fieldUsedByChild[self].get()).toStrictEqual(101);
  expect(child.fieldUsedByBoth[self].get()).toStrictEqual(200);
  expect(parentRenderTimes).toStrictEqual(2);
  expect(childRenderTimes).toStrictEqual(1);

  parent.fieldUsedByParent[self].set(p => p + 1);
  await nextTick();

  expect(parent.fieldUsedByParent[self].get()).toStrictEqual(1);
  expect(parent.fieldUsedByBoth[self].get()).toStrictEqual(200);
  expect(child.fieldUsedByChild[self].get()).toStrictEqual(101);
  expect(child.fieldUsedByBoth[self].get()).toStrictEqual(200);
  expect(parentRenderTimes).toStrictEqual(3);
  expect(childRenderTimes).toStrictEqual(1);

  parent.fieldUsedByBoth[self].set(p => p + 1);
  await nextTick();

  expect(parent.fieldUsedByParent[self].get()).toStrictEqual(1);
  expect(parent.fieldUsedByBoth[self].get()).toStrictEqual(201);
  expect(child.fieldUsedByChild[self].get()).toStrictEqual(101);
  expect(child.fieldUsedByBoth[self].get()).toStrictEqual(201);
  expect(parentRenderTimes).toStrictEqual(4);
  // correct if parent is rerendered, child should not
  // as it is rerendered as a child of parent:
  expect(childRenderTimes).toStrictEqual(1);
});

