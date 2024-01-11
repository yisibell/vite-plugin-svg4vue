import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import DemoifyUI from 'demoify'
import 'demoify/lib/style.css'

import '@/assets/styles/home.scss'
import 'prismjs/themes/prism-okaidia.min.css'
import 'toolkitcss/dist/index.css'

const app = createApp(App)

app.use(DemoifyUI)
app.use(createPinia())
app.use(router)

app.mount('#app')
