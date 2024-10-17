/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)
app.use(Toast);
registerPlugins(app)

app.mount('#app')
