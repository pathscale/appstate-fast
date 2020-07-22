import { mount } from '@vue/test-utils'
import Counter from './fixtures/Counter.vue'

test('simple', async () => {
  const wrapper = mount(Counter)
  expect(wrapper.html()).toContain('Count: 0')
  expect(wrapper.html()).toContain('Increment')
  await wrapper.find('button').trigger('click')
  expect(wrapper.html()).toContain('Count: 1')
})
