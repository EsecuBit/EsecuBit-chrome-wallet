import {D} from 'chrome-excelsecu-wallet'
export default {
  fetch (key) {
    return JSON.parse(window.localStorage.getItem(key))
  },
  save (key, value){
    window.localStorage.setItem(key,JSON.stringify(value))
  },
  fetchApp (key) {
    let res = null
    chrome.storage.local.get(key, function (result) {
      res = result
    })
    return res
  },
  saveApp (key, value){
    let obj = {}
    obj[key] = value
    chrome.storage.local.set(obj)
  },
  generateSeed () {
    let seedValue = D.test.generateSeed()
    this.save('seedValue', seedValue)
    return seedValue
  },
  setSeed () {
    let seed = this.fetch('seedValue') ? this.fetch('seedValue') : this.generateSeed()
    D.test.txSeed = seed
    D.test.txWalletId = seed
  }
}
