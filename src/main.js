/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'


// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// import { useUserAuthStore } from './store/userAuth'

const app = createApp(App)

// app.component('apexchart', VueApexCharts);


registerPlugins(app)
// app.use(pinia)

app.mount('#app')


