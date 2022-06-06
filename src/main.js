import { createApp } from 'vue'
// Elment plus
import ElementPlus from 'element-plus'
import ElMessage from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'

// importamos las rutas
import router from './router/index.js'

// importo los componentes de forma global
import Modal from './components/modal/index.vue'

import axios from 'axios'
import VueAxios from 'vue-axios'

createApp(App)
    .use(router)
    .use(ElementPlus)
    .use(ElMessage)
    .use(VueAxios, axios)
    .component('Modal', Modal)
    .mount('#app')
