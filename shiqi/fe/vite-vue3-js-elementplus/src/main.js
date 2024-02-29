import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

axios.defaults.baseURL = 'http://localhost:3000/'

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.config.globalProperties.$http= axios

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
