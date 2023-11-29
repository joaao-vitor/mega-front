import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './global.css'
import Notification from 'notiwind'
import { useUserStore } from './stores/UserStore'
import axios from 'axios'
const app = createApp(App)
axios.defaults.withCredentials = true;


app.use(createPinia())
useUserStore().fetchUser()

app.use(router)
app.use(Notification)

app.mount('#app')
