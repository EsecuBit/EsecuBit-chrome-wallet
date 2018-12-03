const getters = {
  currentAccountType: (state) => {
    return state.accountList.length > 0 ? state.accountList[state.currentAccountIndex].coinType : ''
  },
  currentAccount: (state) => {
    return state.accountList.length > 0 ? state.accountList[state.currentAccountIndex] : null
  }
}
export default getters
