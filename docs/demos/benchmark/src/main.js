import { createApp } from 'vue'
import '@pathscale/bulma-pull-2981-css-var-only'
import '@pathscale/bulma-extensions-css-var'
import './styles.css'

import App from './App.vue'
import router from './router'
import store from './Vuex/store'

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
