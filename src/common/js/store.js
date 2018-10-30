import {D} from 'esecubit-wallet-sdk'
export default {
  printLog () {
    document.getElementById('clear').onclick = function () {
      document.getElementById('log').innerHTML = ''
    }
    const getLogString = function (args) {
      let logString = ''
      args.forEach(arg => {
        logString += JSON.stringify(arg).replace(/"/g, '') + ' '
      })
      return logString
    }

    const log = function (logLevel, args = []) {
      let color = (logLevel === 0 && '#009688') || (logLevel === 1 && '#333') || (logLevel === 2 && '#f6ae85')
      document.getElementById('log').innerHTML += `<p style="color: ${color}"> ${getLogString(args)} </p>`
    }

    console.debug = function (...args) {
      log(0, args)
    }

    console.log = function (...args) {
      log(1, args)
    }

    console.warn = function (...args) {
      log(2, args)
    }
  },
  fetch (key) {
    return JSON.parse(window.localStorage.getItem(key))
  },
  save (key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
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
    // this.printLog()
    let device = ''
    let net = ''

    if (localStorage) {
      device = this.fetch('device') ? this.fetch('device') : 'soft'
      net = this.fetch('net') ? this.fetch('net') : 'test'
    } else {
      const deviceValue = await this.setPromise('device')
      const netValue = await this.setPromise('net')
      device = deviceValue['device'] ? deviceValue['device'] : 'soft'
      net = netValue['net'] ? netValue['net'] : 'test'
    }
    if (this.isOfficial) {
      D.test.jsWallet = false
      D.test.coin = false
    } else {
      D.test.jsWallet = (device === 'soft')
      D.test.coin = (net === 'test')
    }
  }
}
