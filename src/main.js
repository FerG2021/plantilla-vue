import { createApp } from 'vue'
// Elment plus
import ElementPlus from 'element-plus'
import ElMessage from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/es'

import App from './App.vue'

// importamos las rutas
import router from './router/index.js'

// importo los componentes de forma global
import Modal from './components/modal/index.vue'
import Boton from './components/boton/index.vue'
import MacaSelectBox from './components/select_box/index.vue'

import axios from 'axios'
import VueAxios from 'vue-axios'

const variableGlobal = {
  data() {
    return {
      base_url: 'http://localhost:8000/api'
    }
  },
}

createApp(App)
  .use(router)
  .use(ElementPlus, {locale})
  .use(ElMessage)
  .use(VueAxios, axios)
  .mixin(variableGlobal)
  .component('Modal', Modal)
  .component('Boton', Boton)
  .component('MacaSelectBox', MacaSelectBox)
  .mount('#app')
