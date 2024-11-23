/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import "@/styles/bootstrap-5.3.3-dist/css/bootstrap.min.css";
import "@/styles/bootstrap-5.3.3-dist/js/bootstrap.min.js";

// Plugins
import { registerPlugins } from "@/plugins";
//import { createRouter, createWebHistory } from 'vue-router'
//import {generatedRoutes} from 'virtual:generated-pages';
// Components
import App from "./App.vue";
// const router = createRouter({
//     history: createWebHistory(),
//     routes: generatedRoutes,

//   })

// Composables
import { createApp } from "vue";
import { createPinia } from "pinia";

const app = createApp(App);
app.use(Toast);
//app.use(router)
registerPlugins(app);
app.use(createPinia());
app.mount("#app");
