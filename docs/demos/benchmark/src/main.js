import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@pathscale/bulma-pull-2981-css-var-only'
import '@pathscale/bulma-extensions-css-var'
import './styles.css'

import App from './App.vue'
import router from './router'
import store from './Vuex/store'

const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(store)
app.use(pinia)
app.mount('#app')
