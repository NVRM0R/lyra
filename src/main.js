import { createApp } from 'vue'

import App from './App'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import components from "@/components/UI"
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/app.scss'
const app = createApp(App)

components.forEach(component=>{
    app.component(component.name,component)
})
app.use(BootstrapVue);
app.use(IconsPlugin);
app.mount('#app')
