import {D} from 'chrome-excelsecu-wallet'
export default {
  fetch (key) {
    return JSON.parse(window.localStorage.getItem(key))
  },
  save (key, value){
    window.localStorage.setItem(key,JSON.stringify(value))
  },
  generateSeed () {
    let seedValue = D.test.generateSeed()
    this.save('seedValue', seedValue)
    return seedValue
  },
  setPromise (key) {
    return new Promise(resolve => {
      chrome.storage.local.get(key, (result) => {
        resolve(result)
      })
    })
  },
  saveChromeStore (key, value) {
    if (localStorage) {
      this.save(key, value)
    } else {
      let obj = {}
      obj[key] = value
      chrome.storage.local.set(obj)
    }
  },
  async getLang () {
    if (localStorage) {
      return this.fetch('lang') ? this.fetch('lang') : navigator.language
    } else {
      const lang = await this.setPromise('lang')
      return lang['lang'] ? lang['lang'] : navigator.language
    }
  },
  async init () {
    let seed = null
    let device = ''
    if (localStorage) {
      seed = this.fetch('seedValue') ? this.fetch('seedValue') : this.generateSeed()
      device = this.fetch('device') ? this.fetch('device') : 'soft'
    } else {
      const seedValue = await this.setPromise('seedValue')
      const deviceValue = await this.setPromise('device')
      device = deviceValue['device'] ? deviceValue['device'] : 'soft'
      seed = seedValue['seedValue'] ? seedValue['seedValue'] : D.test.generateSeed()
      chrome.storage.local.set({
        seedValue : seed
      })
    }
    if (device === 'soft') {
      D.test.coin = true
      D.test.jsWallet = true
    } else {
      D.test.coin = false
      D.test.jsWallet = false
    }
    D.test.txSeed = seed
    D.test.txWalletId = seed
  }
}
