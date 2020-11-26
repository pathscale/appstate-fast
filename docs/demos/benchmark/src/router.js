import { createRouter, createWebHistory } from 'vue-router'

import Layout from './Layout.vue'
import Hello from './Hello.vue'

import Vuex from './Vuex/Main.vue'
import CompositionAPI from './CompositionAPI/Main.vue'
import Appstate from './Appstate/Main.vue'

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
        name: 'composition-api',
        path: '/composition-api',
        component: CompositionAPI
      },
      {
        name: 'vuex',
        path: '/vuex',
        component: Vuex,
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