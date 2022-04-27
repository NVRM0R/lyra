import { createApp } from 'vue'

import App from './App'
import components from "@/components/UI"
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
const app = createApp(App).use(Quasar, quasarUserOptions)

components.forEach(component=>{
    app.component(component.name,component)
})
app.use(Quasar, { config: {} })
app.mount('#app')
