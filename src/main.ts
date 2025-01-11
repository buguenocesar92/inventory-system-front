import './assets/main.css'
import 'vuetify/styles' // Importa estilos de Vuetify
import '@mdi/font/css/materialdesignicons.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import 'vuetify/styles' // Importa los estilos de Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Configura Vuetify
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi', // Define el set de iconos
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify) // Registra Vuetify

app.mount('#app')
