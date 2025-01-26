import './assets/base.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import piniaPluginPersist from 'pinia-plugin-persist'
import { VueMasonryPlugin } from "vue-masonry";


import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(VueMasonryPlugin)
app.use(ElementPlus)

const store = createPinia()

//使用持久化插件
store.use(piniaPluginPersist)
app.use(store)

app.use(router)

app.mount('#app')
