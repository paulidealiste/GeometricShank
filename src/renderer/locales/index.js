import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from './i18n/en_US';
import sr from './i18n/sr_RS';

Vue.use(VueI18n);

const messages = Object.assign(en, sr);

export default new VueI18n({
    locale: 'en',
    messages
});