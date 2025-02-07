import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import './style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'; // Ajout de Pinia
import App from './App.vue'
createApp(App)
    .use(createPinia())
    .mount('#app')