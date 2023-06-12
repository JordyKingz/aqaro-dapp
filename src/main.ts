import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { inject } from '@vercel/analytics';

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

inject();

app.mount('#app')
