// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Store from './common/js/store'
import VueI18n from 'vue-i18n'
import {D, EsWallet} from 'chrome-excelsecu-wallet'

Store.init().then(value => {
  Vue.prototype.esWallet = new EsWallet()
  Vue.prototype.D = D
  Vue.config.productionTip = false
  Vue.use(VueI18n)
  Store.getLang().then(value => {
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
      render: h => h(App)
    })
  })
})
