const getters = {
  currentAccountType: (state) => {
    let currentAccountType = state.accountList.length > 0 ? state.accountList[state.currentAccountIndex].coinType : ''
    return currentAccountType
  },
  currentAccount: (state) => {
    let currentAccount = state.accountList.length > 0 ? state.accountList[state.currentAccountIndex] : null
    return currentAccount
  }
}
export default getters
