const mutations = {
  SET_ACCOUNT: (state, accountList) => {
    state.accountList = accountList
  },
  PUT_ACCOUNT: (state, item) => {
    state.accountList.push(item)
  },
  SET_WALLET_INFO: (state, walletInfo) => {
    state.walletInfo = walletInfo
  },
  SET_CURRENT_UNIT_BTC: (state, currentUnitBtc) => {
    state.currentUnitBtc = currentUnitBtc
  },
  SET_CURRENT_UNIT_ETH: (state, currentUnitEth) => {
    state.currentUnitEth = currentUnitEth
  },
  SET_ADD_ACCOUNT_TIMES: (state) => {
    state.addAccountTimes++
  },
  SET_CURRENT_EXCHANGE_RATE: (state, currentExchangeRate) => {
    state.currentExchangeRate = currentExchangeRate
  },
  SET_NET_INFO: (state, netInfo) => {
    state.netInfo = netInfo
  },
  SET_PAGE_INDEX: (state, pageIndex) => {
    state.pageIndex = pageIndex
  },
  SET_IS_PREVENT_SWITCH: (state, isPreventSwitch) => {
    state.isPreventSwitch = isPreventSwitch
  },
  SET_HEAD_COLOR: (state, headColor) => {
    state.headColor = headColor
  },
  SET_CUSTOMIZE_COLOR: (state, customizeColor) => {
    state.customizeColor = customizeColor
  },
  SET_CURRENT_ACCOUNT_INDEX: (state, currentAccountIndex) => {
    state.currentAccountIndex = currentAccountIndex
  },
  ADD_RENAME_TIMES: (state) => {
    state.renameTimes++
  },
  SET_SWITCH_LANG_TIMES: (state) => {
    state.switchLangTimes++
  },
  SET_FILL_TABLE_TIMES: (state) => {
    state.fillTableTimes++
  },
  SET_AUTO_FILL_TABLE_DATA: (state, autoFillTableData) => {
    state.autoFillTableData = autoFillTableData
  },
  SET_IS_Add_ACCOUNTS: (state, isAddAccounts) => {
    state.isAddAccounts = isAddAccounts
  }
}
export default mutations
