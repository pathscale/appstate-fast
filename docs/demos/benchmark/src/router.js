import { createRouter, createWebHistory } from 'vue-router'

import Layout from './Layout.vue'
import Hello from './Hello.vue'

import Vuex from './Vuex/Main.vue'
import VuexLarge from './VuexLarge/Main.vue'
import Pinia from './Pinia/Main.vue'
import PiniaLarge from './PiniaLarge/Main.vue'
import CompositionAPI from './CompositionAPI/Main.vue'
import CompositionAPILarge from './CompositionAPILarge/Main.vue'
import Appstate from './Appstate/Main.vue'
import AppstateLarge from './AppstateLarge/Main.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        name: 'hello',
        path: '/hello',
        component: Hello,
      },
      {
        name: 'appstate',
        path: '/appstate',
        component: Appstate,
      },
        {
            name: 'appstateLarge',
            path: '/appstate-large',
            component: AppstateLarge
        },
      {
        name: 'composition-api',
        path: '/composition-api',
        component: CompositionAPI
      },
        {
            name: 'composition-api-large',
            path: 'composition-api-large',
            component: CompositionAPILarge
        },
        {
            name: 'vuex',
            path: '/vuex',
            component: Vuex,
        },
        {
            name: 'vuex-large',
            path: '/vuex-large',
            component: VuexLarge,
        },
        {
            name: 'pinia',
            path: '/pinia',
            component: Pinia,
        },
        {
            name: 'pinia-large',
            path: '/pinia-large',
            component: PiniaLarge,
        },
      {
        path: '/',
        redirect: '/hello'
      }
    ]
  },
]

export default createRouter({
  history: createWebHistory(),
  routes
})
