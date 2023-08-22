import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { inject } from '@vercel/analytics';
import splitbee from '@splitbee/web';

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// vercel analytics dev
// inject();

// splitbee prd
splitbee.init({
    token: import.meta.env.VITE_SPLITBEE_TOKEN,
    disableCookie: false,
    scriptUrl: "https://cdn.splitbee.io/sb.js",
});

app.mount('#app')
