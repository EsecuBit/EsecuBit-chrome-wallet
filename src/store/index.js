import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

const state = {
  accountList: [],
  walletInfo: null,
  currentUnitBtc: '',
  currentUnitEth: '',
  addAccountTimes: 0,
  currentExchangeRate: '',
  netInfo: null,
  appVersion: '0.1.24',
  pageIndex: 0,
  isPreventSwitch: false,
  headColor: '',
  customizeColor: '',
  currentAccountIndex: 0,
  renameTimes: 0,
  switchLangTimes: 0,
  fillTableTimes: 0,
  autoFillTableData: {},
  isAddAccounts: true,
  isOfficial: false,
  isTest: true
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
