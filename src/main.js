import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'

import * as UIkit from 'uikit';
import * as Icons from 'uikit/dist/js/uikit-icons.js'

UIkit.use(Icons);

import en from './locales/i18n/en_US';
import sr from './locales/i18n/en_US';
const messages = Object.assign(en, sr);

const i18n = createI18n({
    locale: 'en',
    messages
})

const app = createApp(App)

app.use(i18n)

app.mount('#app')
