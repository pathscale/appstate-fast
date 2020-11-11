import { createApp } from 'vue'
import App from './App.vue'
import '@pathscale/bulma-pull-2981-css-var-only/css/bulma.css'
import '@pathscale/bulma-extensions-css-var'
import router from './router/index.js'

createApp(App).use(router).mount('#app')
