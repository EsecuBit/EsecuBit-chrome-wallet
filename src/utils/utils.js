const layer = layui.layer
export default {
  getFormatTime (time) {
    let date = new Date(time)
    let yyyy = date.getFullYear()
    let moth = date.getMonth() + 1
    let MM = parseInt(moth / 10) ? moth : '0' + moth
    let dd = parseInt(date.getDate() / 10) ? date.getDate() : '0' + date.getDate()
    let HH = parseInt(date.getHours() / 10) ? date.getHours() : '0' + date.getHours()
    let mm = parseInt(date.getMinutes() / 10) ? date.getMinutes() : '0' + date.getMinutes()
    let ss = parseInt(date.getSeconds() / 10) ? date.getSeconds() : '0' + date.getSeconds()
    let arr = []
    arr.push(yyyy)
    arr.push('-')
    arr.push(MM)
    arr.push('-')
    arr.push(dd)
    arr.push(' ')
    arr.push(HH)
    arr.push(':')
    arr.push(mm)
    arr.push(':')
    arr.push(ss)
    return arr.join('')
  },
  formatNum (num) {
    return parseFloat(num).toLocaleString()
  },
  toTwoPoint (num) {
    // Keep two decimals
    return Math.round(num * 100) / 100
  },
  getErrorCodeMsg (vm) {
    return {
      101: vm.$t('message.error_noDevice'),
      102: vm.$t('message.error_deviceComm'),
      103: vm.$t('message.error_deviceConnectFailed'),
      104: vm.$t('message.error_deviceDeriveLargerThanN'),
      105: vm.$t('message.error_deviceProtocol'),
      106: vm.$t('message.error_handShake'),
      107: vm.$t('message.error_needPressKey'), // sleep after long time idle
      108: vm.$t('message.error_userCancel'),
      109: vm.$t('message.error_pinError'),
      110: vm.$t('message.error_operationTimeout'),
      111: vm.$t('message.error_deviceNotInit'),
      112: vm.$t('message.devicePressKeyTooEarly'),
      201: vm.$t('message.error_databaseOpenFailed'),
      202: vm.$t('message.error_databaseExecFailed'),
      301: vm.$t('message.error_lastAccountNoTransaction'),
      302: vm.$t('message.error_accountHasTransactions'),
      401: vm.$t('message.error_networkUnavailable'),
      402: vm.$t('message.error_networkNotInitialized'),
      403: vm.$t('message.error_networkProviderError'),
      404: vm.$t('message.error_networkTxNotFound'),
      405: vm.$t('message.error_networkFeeTooSmall'),
      406: vm.$t('message.error_networkTooManyPendingTx'),
      407: vm.$t('message.error_networkValueTooSmall'),
      408: vm.$t('message.error_networkGasTooLow'),
      409: vm.$t('message.error_networkGasPriceTooLow'),
      501: vm.$t('message.error_balanceNotEnough'),
      601: vm.$t('message.error_invalidAddress'),
      602: vm.$t('message.error_noAddressCheckSum'), // for eth
      603: vm.$t('message.error_invalidAddressChecksum'),
      604: vm.$t('message.error_valueIsDecimal'),
      605: vm.$t('message.error_invalidDataNotHex'),
      607: vm.$t('message.error_invalidParams'),
      608: vm.$t('message.error_permissionNotFound'),
      10000: vm.$t('message.error_notImplemented'),
      10001: vm.$t('message.error_unknown'),
      10002: vm.$t('message.error_coinNotSupported')
    }
  },
  displayErrorCode (vm, value) {
    console.warn(value)
    let errorCodeMsg = this.getErrorCodeMsg(vm)
    layer.closeAll()
    let errorKey = String(value)
    errorCodeMsg[errorKey] ? layer.msg(errorCodeMsg[errorKey], {icon: 2, anim: 6}) : layer.msg(errorKey, {icon: 2, anim: 6})
  },
  classifyTx (txArray) {
    let transferActionArray = []
    let voteActionArray = []
    let resourceActionArray = []
    let otherActionArray = []
    txArray.forEach((item, index) => {
      item.actions.forEach((action, index) => {
        let obj = {
          time: item.time,
          txId: item.txId,
          confirmations: item.confirmations,
          link: item.link,
          actions: action
        }
        if (action.name === 'transfer' && action.data.from && action.data.quantity && action.data.to) {
          transferActionArray.push(obj)
        } else if (((action.name === 'delegatebw' || action.name === 'undelegatebw') && (action.account === 'eosio.stake')) ||
          ((action.name === 'buyram' || action.name === 'buyrambytes' || action.name === 'sellrambytes' || action.name === 'sellram') && (action.account === 'eosio'))) {
          resourceActionArray.push(obj)
        } else if (action.name === 'voteproducer' && action.account === 'eosio') {
          voteActionArray.push(obj)
        } else {
          otherActionArray.push(obj)
        }
      })
    })
    console.log(otherActionArray, 'otherActionArray')
    return {
      transferActionArray: transferActionArray,
      resourceActionArray: resourceActionArray,
      voteActionArray: voteActionArray,
      otherActionArray: otherActionArray
    }
  }
}
