// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import util from './common/js/store'
import VueI18n from 'vue-i18n'
import axios from 'axios'
import {D, EsWallet} from 'esecubit-wallet-sdk'
import store from './store/'

util.init().then(result => {
  Vue.prototype.esWallet = new EsWallet()
  Vue.prototype.D = D
  Vue.config.productionTip = false
  Vue.prototype.axios = axios
  Vue.use(VueI18n)
  util.getLang().then(value => {
    const i18n = new VueI18n({
      locale: value,
      messages: {
        'zh-CN': require('./common/js/lang/cn'),
        'en-US': require('./common/js/lang/en')
      }
    })
    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      i18n,
      store,
      render: h => h(App)
    })
  })
})
