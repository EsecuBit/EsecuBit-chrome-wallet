<template>
  <div>
    <!-- prompt message -->
    <blockquote class="site-text layui-elem-quote" style="margin-top: 20px">
      <i class="layui-icon" style="vertical-align: middle;">&#xe645;</i> {{$t('message.send_prompt_msg')}}
    </blockquote>

    <!-- coin type -->
    <h1 class="table-title" style="margin-bottom: 6px">{{sendCoinTypeMsg}}</h1>

    <!-- warning message -->
    <div class="again-send-msg" v-if="isReSendStatus">
      <div class="again-send-content">
        <i class="layui-icon">&#xe702;</i> {{$t('message.send_resend_prompt')}}
      </div>
      <div class="close-msg">
        <i class="layui-icon" @click="clearResendStatusAndData">&#x1006;</i>
      </div>
    </div>
    <div class="again-send-msg" v-if="isShowAllowAmountMsg">
      <div class="again-send-content">
        <i class="layui-icon">&#xe702;</i> {{AllowAmountMsg}}
      </div>
      <div class="close-msg">
        <i class="layui-icon" @click="clearAllowAmountMsg">&#x1006;</i>
      </div>
    </div>

    <!-- transaction form -->
    <div class="site-text site-block">
      <form class="layui-form customize-form" action="" lay-filter="form1" autocomplete="off">
        <!-- select accounts -->
        <div class="layui-form-item" style="position: relative">
          <label class="layui-form-label account-label" >{{$t('message.send_current_account')}}</label>
          <div class="layui-input-block input-width account-name" style="margin-left: 220px">
            <div style="display: inline-block;width: 250px">
              <select name="account" lay-filter="account"  style="width: 250px" v-model="currentSelectedAccountIndex" >
                <option > </option>
                <optgroup :label="item.label" v-for="item in groupingAccounts" v-if="groupingAccounts">
                  <option v-for="accountItem in item.account" :value="accountItem.index">{{accountItem.label}}</option>
                </optgroup>
              </select>
            </div>
            <div class="account-balance">{{getBalance}}</div>
          </div>
        </div>

        <!-- amount input -->
        <div class="layui-form-item" style="margin-bottom: 5px">
          <label class="layui-form-label" style="padding: 17px 15px">{{$t('message.send_amount')}}</label>
          <div class="layui-input-block input-width" style="position: relative;height: 55px">
            <div style="width: 300px">
              <div v-if="coinType" class="unit-display" >{{currentDisplayUnit(currentAccount.coinType)}}</div>
              <input type="number" v-model="amountValue" name="money" id="money" lay-verify="isEmpty" v-if="coinType"
                     :placeholder="$t('message.send_amount')" autocomplete="off" class="layui-input amount-input">
            </div>
            <button class="layui-btn layui-btn-radius layui-btn-sm max-btn" type="button" @click="maxAmount">MAX</button>
            <div class="usd-amount" v-if="coinType && currentUnitBtc && currentExchangeRate && isDisplayExchange">{{toExchangeText}}</div>
          </div>
        </div>

        <!-- address input -->
        <div class="money-address">
          <div class="layui-form-item">
            <label class="layui-form-label">{{$t('message.send_address')}}</label>
            <div class="layui-input-block input-width" style="margin-left: 100px">
              <input type="text" v-model="addressValue" name="address"  lay-verify="isEmpty"  :placeholder="$t('message.send_address')"
                     class="layui-input" style="width: 360px;text-align: right;" id="transactionAddress">
              <!-- icon -->
              <span v-show="isDisplayIcon" style="margin-left: 10px">
                <a v-show="isAddressError" style="color: #e74c3c; vertical-align: sub" @click="clearAddress">
                  <i class="layui-icon">&#x1007;</i>
                </a>
                <a v-show="isAddressTrue" href="#" style="color: #009a61;vertical-align: sub">
                  <i class="layui-icon">&#x1005;</i>
                </a>
                <a v-show="!isAddressError && !isAddressTrue" style="color: #f9c94f; vertical-align: sub" @click="clearAddress">
                  <i class="layui-icon">&#xe702;</i>
                </a>
              </span>

            </div>
          </div>
        </div>

        <!-- btc input -->
        <div class="layui-form-item" v-if="switchFee && isBtc">
          <label class="layui-form-label" >{{$t('message.send_transaction_fees')}}</label>
          <div class="layui-input-block input-width" style="position: relative;">
            <div style="width: 300px">
              <div v-if="coinType" class="transFee-unit" >{{currentTransactionUnit(coinType)}}</div>
              <input type="number"  lay-verify="isEmpty" v-model="customFees" :placeholder="$t('message.send_amount')" autocomplete="off" class="layui-input transFee-input">
            </div>
            <button class="layui-btn layui-btn-sm layui-btn-radius transFee-btn" type="button" @click="switchSelectButton">{{$t('message.send_select_fee')}}</button>
          </div>
        </div>

        <!-- select fee -->
        <div class="layui-form-item" v-show="!switchFee">
          <label class="layui-form-label">{{isBtc?$t('message.send_transaction_fees'): 'Gas price'}}</label>
          <div class="layui-input-block input-width" style="margin-left: 220px">
            <div style="display: inline-block;width: 250px">
              <select name="fee" lay-filter="fee"  style="width: 250px">
              <option v-for="(fee, index) in feeList"  :value="index" :selected="selectedIndex(index)">{{fee.label}}</option>
              </select>
            </div>
            <button class="layui-btn layui-btn-sm layui-btn-radius " style="margin-left: 5px" type="button" @click="switchCustomButton">{{$t('message.send_custom_fee')}}</button>
          </div>
        </div>

        <!-- etc customize input -->
        <div class="layui-form-item" v-show="switchFee && !isBtc">
          <div style="display: inline-block">
            <label class="layui-form-label" >Gas Limit</label>
            <div class="layui-input-block input-width" style="position: relative;">
              <div style="width: 300px">
                <input type="number"  lay-verify="isEmpty" v-model="gasLimit" :placeholder="$t('message.send_amount')" autocomplete="off" class="layui-input transFee-input">
              </div>
              <button class="layui-btn layui-btn-sm layui-btn-radius transFee-btn" type="button" @click="switchSelectButton">{{$t('message.send_select_fee')}}</button>
            </div>
          </div>
          <div style="display: inline-block">
            <label class="layui-form-label" >Gas Price</label>
            <div class="layui-input-block input-width" style="position: relative;">
              <div style="width: 300px">
                <div v-if="coinType" class="transFee-unit" >GWei</div>
                <input type="number"  lay-verify="isEmpty" v-model="gasPrice" :placeholder="$t('message.send_amount')" autocomplete="off" class="layui-input transFee-input">
              </div>
            </div>
          </div>
        </div>

        <!-- btc customize input -->
        <div class="layui-form-item" v-show="isShowData && !isBtc">
          <label class="layui-form-label">Data</label>
          <div class="layui-input-block input-width" style="margin-left: 100px">
            <input type="text" value="" name="data"  v-model="etcData" :placeholder="$t('message.send_data')" class="layui-input" style="width: 360px;text-align: right;">
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">{{$t('message.send_fee')}}</label>
          <div class="layui-input-inline input-width">
            <textarea disabled  class="layui-textarea" v-bind:value= "totalDisplayFee" name="desc"></textarea>
          </div>
        </div>

        <!-- etc data -->
        <div class="add-data-wrapper" v-show="!isShowData && !isBtc">
          <a class="add-data" @click="switchData">
            <i class="layui-icon">&#xe654;</i> {{$t('message.send_advance')}}
          </a>
        </div>

        <!-- button -->
        <div class="layui-form-item" style="border:none">
          <button class="layui-btn" lay-submit type="button" @click="submitSendData">{{$t('message.send_submit_btn')}}</button>
          <button type="button" class="layui-btn layui-btn-primary" @click="clearFormData" style="background-color: #fff">{{$t('message.send_reset_btn')}}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import utils from '../../../utils/utils'

const form = layui.form
const layer = layui.layer
export default {
  name: 'Sending',
  data () {
    return {
      amountValue: null,
      addressValue: '',
      selected: null,
      customFees: 0,
      feeList: [],
      switchFee: false,
      currentAccount: {},
      totalFee: 0,
      transFee: 0,
      totalFeeDisplay: '',
      transFeeDisplay: '',
      isDisplayExchange: false,
      isDisplayDetails: false,
      coinType: '',
      isDisplayIcon: false,
      isAddressError: false,
      isAddressTrue: false,
      currentSelectedIndex: null,
      currentSelectedAccountIndex: 0,
      isClearFormData: false,
      gasLimit: 21000,
      gasPrice: 0,
      isShowData: false,
      etcData: '',
      isPreventClick: false,
      groupingAccounts: null,
      oldTxId: '',
      isReSendStatus: false,
      isShowAllowAmountMsg: false,
      AllowAmountMsg: '',
      intervalId: null,
      isFirst: true,
      btcFeePlaceHolder: 'Satoshi per byte',
      ethFeePlaceHolder: 'Gwei per byte',
      btcName: 'Bitcoin',
      ethName: 'Ether'
    }
  },
  computed: {
    ...mapState({
      'accountList': 'accountList',
      'currentUnitBtc': 'currentUnitBtc',
      'currentUnitEth': 'currentUnitEth',
      'currentExchangeRate': 'currentExchangeRate',
      'pageIndex': 'pageIndex',
      'currentAccountIndex': 'currentAccountIndex',
      'renameTimes': 'renameTimes',
      'switchLangTimes': 'switchLangTimes',
      'fillTableTimes': 'fillTableTimes',
      'autoFillTableData': 'autoFillTableData'
    }),
    isBtc () {
      return this.D.isBtc(this.coinType)
    },
    toExchangeText () {
      if (this.currentUnitBtc && this.currentExchangeRate) {
        let nowUnit = this.currentDisplayUnit(this.coinType)
        let getMoney = this.amountValue ? this.amountValue : '0'
        let exchange = Number(this.esWallet.convertValue(this.coinType, String(getMoney), nowUnit, this.currentExchangeRate)).toFixed(2)
        return utils.formatNum(exchange) + ' ' + this.currentExchangeRate
      }
    },
    sendCoinTypeMsg () {
      let coinTypeName = this.D.isBtc(this.coinType) ? this.btcName : this.ethName
      return this.$t('message.send_send_msg') + ' ' + coinTypeName
    },
    getBalance () {
      let coinType = this.currentDisplayUnit(this.coinType)
      return '(' + this.$t('message.send_balance') + this.toTargetCoinUnit(this.currentAccount.balance) + ' ' + coinType + ')'
    },
    totalDisplayFee () {
      if (this.coinType && this.currentUnitBtc && this.currentExchangeRate && this.isDisplayDetails) {
        let nowUnit = this.currentDisplayUnit(this.coinType)
        let exchange = this.esWallet.convertValue(this.coinType, this.totalFee, nowUnit, this.currentExchangeRate)
        let feeExchange = this.esWallet.convertValue(this.coinType, this.transFee, nowUnit, this.currentExchangeRate)
        const totalFeeDisplay = this.$t('message.send_total_fee') + ': ' + this.totalFee + ' ' + nowUnit + ' (' + utils.formatNum(exchange) + ' ' + this.currentExchangeRate + ')' + '\n'
        const transFeeDisplay = this.$t('message.send_transaction_fees') + ': ' + this.transFee + ' ' + nowUnit + ' (' + utils.formatNum(feeExchange) + ' ' + this.currentExchangeRate + ')'
        return totalFeeDisplay + transFeeDisplay
      } else {
        return ''
      }
    }
  },
  watch: {
    fillTableTimes: {
      handler (newValue, oldValue) {
        let table = this.autoFillTableData
        this.isReSendStatus = true
        this.switchCurrentAccount(this.currentAccountIndex)
        this.$nextTick(() => {
          let getValue = table.outputs[0].value
          this.amountValue = this.toTargetCoinUnit(String(getValue))
          this.addressValue = table.outputs[0].address
          this.etcData = table.data ? table.data : ''
          this.isShowData = !!table.data
          this.oldTxId = table.txId
        })
      }
    },
    renameTimes: {
      handler (newValue, oldValue) {
        this.setMenuList(this.accountList)
      }
    },
    switchLangTimes: {
      handler (newValue, oldValue) {
        // Re-render the form when setting the language
        this.renderFeeForm(this.currentAccount)
      }
    },
    currentAccountIndex: {
      handler (newValue, oldValue) {
        this.switchCurrentAccount(newValue)
      }
    },
    currentUnitEth: {
      handler (newValue, oldValue) {
        !this.D.isBtc(this.coinType) && this.clearFormData()
      }
    },
    currentUnitBtc: {
      handler (newValue, oldValue) {
        this.D.isBtc(this.coinType) && this.clearFormData()
      }
    },
    addressValue: {
      handler (newValue, oldValue) {
        this.isDisplayIcon = true
        if (!this.currentAccount || !newValue) return false
        try {
          this.currentAccount.checkAddress(this.addressValue)
          this.isAddressError = false
          this.isAddressTrue = true
        } catch (e) {
          console.warn(e)
          if (e === this.D.error.noAddressCheckSum) {
            this.isAddressError = false
            this.isAddressTrue = false
          } else {
            this.isAddressError = true
            this.isAddressTrue = false
          }
        }
      }
    },
    amountValue: {
      handler (newValue, oldValue) {
        // not support scientific notation
        if (/[eE]/.test(newValue)) {
          this.amountValue = ''
          layer.msg(this.$t('message.send_scientific_count'), { icon: 2, anim: 6 })
          return false
        }
        if (newValue != null) this.isDisplayExchange = true
        // input cannot < 0
        if (Number(newValue) < 0) {
          this.amountValue = ''
          layer.msg(this.$t('message.send_positive_number'), { icon: 2, anim: 6 })
          return false
        }
        if (this.D.isBtc(this.coinType)) {
          if (!this.isClearFormData && this.customFees !== '') this.calculateTotal()
        } else {
          if (!this.isClearFormData && this.gasLimit !== '' && this.gasPrice !== '') this.calculateTotal()
        }
      }
    },
    switchFee: {
      handler (newValue, oldValue) {
        if (!this.isClearFormData && !newValue) this.calculateTotal()
      }
    },
    customFees: {
      handler (newValue, oldValue) {
        // not support scientific notation
        if (/[eE]/.test(newValue)) {
          this.customFees = null
          layer.msg(this.$t('message.send_scientific_count'), { icon: 2, anim: 6 })
          return false
        }
        if (Number(newValue) < 0) {
          this.customFees = null
          layer.msg(this.$t('message.send_positive_number'), { icon: 2, anim: 6 })
          return false
        }
        if (this.switchFee && (!this.isClearFormData) && newValue !== null && newValue !== '') this.calculateTotal()
        if (!newValue) this.isDisplayDetails = false
      }
    },
    gasLimit: {
      handler (newValue, oldValue) {
        if (!newValue) return
        // not support scientific notation
        if (/[eE]/.test(newValue)) {
          this.gasLimit = null
          layer.msg(this.$t('message.send_scientific_count'), { icon: 2, anim: 6 })
          return false
        }
        if (Number(newValue) < 0) {
          this.gasLimit = null
          layer.msg(this.$t('message.send_positive_number'), { icon: 2, anim: 6 })
          return false
        }
        // Does not support decimal points
        if (/\./.test(newValue)) {
          this.gasLimit = null
          layer.msg(this.$t('message.send_not_decimal'), { icon: 2, anim: 6 })
          return false
        }
        if (!this.isClearFormData) this.calculateTotal()
        if (newValue !== '') this.isDisplayDetails = false
      }
    },
    gasPrice: {
      handler (newValue, oldValue) {
        // not support scientific notation
        if (/[eE]/.test(newValue)) {
          this.gasPrice = null
          layer.msg(this.$t('message.send_scientific_count'), { icon: 2, anim: 6 })
          return false
        }
        if (Number(newValue) < 0) {
          this.gasPrice = null
          layer.msg(this.$t('message.send_positive_number'), { icon: 2, anim: 6 })
          return
        }
        if (this.switchFee && (!this.isClearFormData) && newValue !== null && newValue !== '') this.calculateTotal()
        if (!newValue) this.isDisplayDetails = false
      }
    },
    etcData: {
      handler (newValue, oldValue) {
        // hex string
        let dataLength = Math.ceil(newValue.length / 2)
        this.gasLimit = 21000 + dataLength * 68
      }
    },
    accountList: {
      handler (newValue, oldValue) {
        if (this.isFirst && newValue.length > 0) {
          this.currentAccount = newValue[0]
          this.isFirst = false
        }
        this.setMenuList(newValue)
      }
    },
    currentAccount: {
      handler (newValue, oldValue) {
        this.clearFormData()
        this.coinType = newValue.coinType
        this.isDisplayDetails = false
        this.isDisplayExchange = false
        this.currentSelectedIndex = null
        this.renderFeeForm(newValue)
      }
    },
    pageIndex: {
      handler (newValue, oldValue) {
        if (newValue !== 1 && this.isReSendStatus) {
          this.clearResendStatus()
        }
      }
    }
  },
  mounted () {
    this.verifyForm()
  },
  methods: {
    ...mapMutations({
      setPageIndex: 'SET_PAGE_INDEX',
      setIsPreventSwitch: 'SET_IS_PREVENT_SWITCH'
    }),
    switchCurrentAccount (index) {
      this.currentSelectedAccountIndex = index
      this.currentAccount = this.accountList[index]
      this.$nextTick(() => {
        this.renderAccountForm()
      })
    },
    setMenuList (targetArray) {
      const arr = []
      const newAccountList = []
      for (let [index, elem] of targetArray.entries()) {
        if (!arr.includes(elem.coinType)) {
          arr.push(elem.coinType)
          newAccountList.push({label: elem.coinType, account: [{label: elem.label, index: index}]})
        } else {
          for (let val of newAccountList) {
            if (val.label === elem.coinType) {
              val.account.push({label: elem.label, index: index})
              break
            }
          }
        }
      }
      this.groupingAccounts = newAccountList
      this.$nextTick(() => {
        this.renderAccountForm()
      })
    },
    switchData () {
      this.isShowData = true
    },
    renderAccountForm () {
      form.render('select', 'form1')
      form.on('select(account)', data => {
        if (this.isReSendStatus) this.clearResendStatus()
        let index = Number(data.value)
        this.$nextTick(() => {
          this.currentSelectedAccountIndex = index
          this.currentAccount = this.accountList[index]
        })
      })
    },
    renderFeeForm (newValue) {
      if (newValue.getSuggestedFee) {
        let oldFeeList = newValue.getSuggestedFee()
        let newFeeList = []
        let fastestMsg = this.$t('message.send_fastest_confirm')
        let fastMsg = this.$t('message.send_fast_confirm')
        let standardMsg = this.$t('message.send_standard_confirm')
        let slowMsg = this.$t('message.send_slow_confirm')
        if (this.D.isBtc(this.coinType)) {
          newFeeList.push({label: fastMsg + '(' + oldFeeList.fast + ' ' + this.D.unit.btc.satoshi + ')', value: oldFeeList.fast})
          newFeeList.push({label: standardMsg + '(' + oldFeeList.normal + ' ' + this.D.unit.btc.satoshi + ')', value: oldFeeList.normal})
          newFeeList.push({label: slowMsg + '(' + oldFeeList.economic + ' ' + this.D.unit.btc.satoshi + ')', value: oldFeeList.economic})
        } else {
          newFeeList.push({label: fastestMsg + '(' + this.weiToGwei(oldFeeList.fastest) + ' ' + this.D.unit.eth.GWei + ')', value: oldFeeList.fastest})
          newFeeList.push({label: fastMsg + '(' + this.weiToGwei(oldFeeList.fast) + ' ' + this.D.unit.eth.GWei + ')', value: oldFeeList.fast})
          newFeeList.push({label: standardMsg + '(' + this.weiToGwei(oldFeeList.normal) + ' ' + this.D.unit.eth.GWei + ')', value: oldFeeList.normal})
          newFeeList.push({label: slowMsg + '(' + this.weiToGwei(oldFeeList.economic) + ' ' + this.D.unit.eth.GWei + ')', value: oldFeeList.economic})
        }
        this.feeList = newFeeList
        this.selected = oldFeeList.normal
        this.$nextTick(() => {
          form.render('select', 'form1')
          form.on('select(fee)', data => {
            let index = Number(data.value)
            this.currentSelectedIndex = index
            this.selected = this.feeList[index].value
            this.calculateTotal()
          })
        })
      }
    },
    clearAddress () {
      this.addressValue = ''
    },
    clearFormData () {
      this.isClearFormData = true
      this.totalFee = 0
      this.transFee = 0
      this.$nextTick(() => {
        this.amountValue = null
        this.addressValue = ''
        this.customFees = 0
        this.gasLimit = 21000
        this.gasPrice = 0
        this.isDisplayDetails = false
        this.etcData = ''
        this.switchFee = false
        this.$nextTick(() => {
          this.isDisplayIcon = false
          this.isDisplayExchange = false
          this.isClearFormData = false
        })
      })
    },
    verifyForm () {
      let that = this
      form.verify({
        isEmpty (value) {
          if (!value) return that.$t('message.send_form_is_empty')
        }
      })
    },
    selectedIndex (index) {
      if (this.currentSelectedIndex) return this.currentSelectedIndex
      if (this.coinType) return this.D.isBtc(this.coinType) ? index === 1 : index === 2
    },
    currentDisplayUnit (coinType) {
      return this.D.isBtc(coinType) ? this.currentUnitBtc : this.currentUnitEth
    },
    currentTransactionUnit (coinType) {
      return this.D.isBtc(coinType) ? this.btcFeePlaceHolder : this.ethFeePlaceHolder
    },
    toTargetCoinUnit (value) {
      if (this.coinType) {
        let nowType = this.D.isBtc(this.coinType) ? this.D.unit.btc.satoshi : this.D.unit.eth.Wei
        let nowUnit = this.currentDisplayUnit(this.coinType)
        return this.esWallet.convertValue(this.coinType, value, nowType, nowUnit)
      }
    },
    toMinCoinUnit (value) {
      if (this.coinType) {
        let nowType = this.D.isBtc(this.coinType) ? this.D.unit.btc.satoshi : this.D.unit.eth.Wei
        let nowUnit = this.currentDisplayUnit(this.coinType)
        return this.esWallet.convertValue(this.coinType, value, nowUnit, nowType)
      }
    },
    maxAmount () {
      let getAddress = this.addressValue
      let getCustomFees = this.customFees ? this.customFees : '0'
      let formData = {}
      if (this.D.isBtc(this.coinType)) {
        formData = {
          sendAll: true,
          feeRate: String(this.switchFee ? getCustomFees : this.selected),
          outputs: [{
            address: getAddress,
            value: '0'
          }]
        }
        this.currentAccount.prepareTx(formData).then(result => {
          if (result.deviceLimit) {
            if (this.intervalId !== null) clearInterval(this.intervalId)
            this.autoCloseAllowAmountMsg()
            this.isShowAllowAmountMsg = true
          }
          this.amountValue = this.toTargetCoinUnit(result.outputs[0].value)
        }).catch(value => {
          utils.displayErrorCode(this, value)
        })
      } else {
        let gasPrice = String(this.gasPrice ? this.gasPrice : 0)
        let getGasPrice = this.gweiToWei(gasPrice)
        let getGasLimit = String(this.gasLimit ? this.gasLimit : 0)
        formData = {
          sendAll: true,
          output: {
            address: getAddress,
            value: '0'
          },
          gasPrice: String(this.switchFee ? getGasPrice : this.selected),
          gasLimit: getGasLimit,
          data: this.etcData
        }
        this.currentAccount.prepareTx(formData).then(result => {
          this.amountValue = this.toTargetCoinUnit(result.output.value)
        }).catch(value => {
          utils.displayErrorCode(this, value)
        })
      }
    },
    verifyAddress () {
      if (!this.currentAccount) return false
      try {
        this.currentAccount.checkAddress(this.addressValue)
        layer.msg(this.$t('message.send_effective_address_mag'), { icon: 1, anim: 2, time: 1500 })
      } catch (e) {
        utils.displayErrorCode(this, e)
      }
    },
    verifySubmitAddress () {
      if (!this.currentAccount) return false
      try {
        this.currentAccount.checkAddress(this.addressValue)
        return true
      } catch (e) {
        if (e === this.D.error.noAddressCheckSum) {
          return true
        } else {
          layer.msg(this.$t('message.send_invalid_address_mag'), { icon: 2, anim: 6 })
          document.getElementById('transactionAddress').focus()
          return false
        }
      }
    },
    switchSelectButton () {
      this.switchFee = !this.switchFee
      this.customFees = 0
      this.gasPrice = 0
    },
    switchCustomButton () {
      this.switchFee = !this.switchFee
      if (this.D.isBtc(this.coinType)) {
        this.customFees = null
        this.gasPrice = 0
      } else {
        this.customFees = 0
        this.gasPrice = null
      }
    },
    weiToGwei (value) {
      return this.esWallet.convertValue(this.coinType, value, this.D.unit.eth.Wei, this.D.unit.eth.GWei)
    },
    gweiToWei (value) {
      return this.esWallet.convertValue(this.coinType, value, this.D.unit.eth.GWei, this.D.unit.eth.Wei)
    },
    getFormData () {
      let getAmountValue = this.amountValue ? String(this.amountValue) : '0'
      let sendAmountValue = this.toMinCoinUnit(getAmountValue)
      let getCustomFees = this.customFees ? String(this.customFees) : '0'
      let getAddress = this.addressValue
      let customFees = this.D.isBtc(this.coinType) ? getCustomFees : this.gweiToWei(getCustomFees)
      let formData = {}
      if (this.D.isBtc(this.coinType)) {
        formData = {
          feeRate: this.switchFee ? customFees : String(this.selected),
          outputs: [{
            address: getAddress,
            value: sendAmountValue
          }],
          oldTxId: this.oldTxId
        }
      } else {
        let gasPrice = String(this.gasPrice ? this.gasPrice : 0)
        let getGasPrice = this.gweiToWei(gasPrice)
        let getGasLimit = String(this.gasLimit ? this.gasLimit : 0)
        formData = {
          output: {
            address: getAddress,
            value: sendAmountValue
          },
          gasPrice: String(this.switchFee ? getGasPrice : this.selected),
          gasLimit: getGasLimit,
          data: this.etcData,
          oldTxId: this.oldTxId
        }
      }
      return formData
    },
    submitSendData () {
      // Verification form
      if (!this.switchFee) {
        if (!(this.selected && this.amountValue && this.addressValue)) return false
      } else {
        if (!(this.customFees && this.amountValue && this.addressValue) && this.D.isBtc(this.coinType)) return false
        if (!(this.gasPrice && this.amountValue && this.addressValue && this.gasLimit) && !this.D.isBtc(this.coinType)) return false
      }
      // let isInt = Number.isInteger(this.etcData.length / 2)
      if (this.etcData && (!/^(0[xX])?[0-9a-fA-F]*$/.test(this.etcData))) {
        layer.msg(this.$t('message.send_is_hex'), {icon: 2, anim: 6})
        return false
      }
      if (!this.verifySubmitAddress()) return false
      layer.msg(this.$t('message.send_is_click'), {time: 600000000})
      let formData = this.getFormData()
      if (this.isPreventClick) return
      this.isPreventClick = true
      this.setIsPreventSwitch(true)
      setTimeout(() => {
        this.currentAccount.prepareTx(formData).then(value => {
          return this.currentAccount.buildTx(value)
        }).then(value => {
          this.isPreventClick = false
          layer.closeAll('msg')
          layer.msg(this.$t('message.send_is_trading'), {time: 600000000})
          return this.currentAccount.sendTx(value)
        }).then(value => {
          // Empty retransmission status
          if (this.oldTxId) this.clearResendStatus()
          // Formatted form
          this.isPreventClick = false
          this.setIsPreventSwitch(false)
          this.clearFormData()
          layer.closeAll('msg')
          layer.msg(this.$t('message.send_submit_success'), { icon: 1 })
          this.setPageIndex(0)
        }).catch(value => {
          this.isPreventClick = false
          this.setIsPreventSwitch(false)
          layer.closeAll('msg')
          utils.displayErrorCode(this, value)
        })
      }, 200)
    },
    calculateTotal () {
      let formData = this.getFormData()
      this.currentAccount.prepareTx(formData).then(value => {
        if (value.deviceLimit) {
          if (this.intervalId !== null) clearInterval(this.intervalId)
          this.autoCloseAllowAmountMsg()
          this.isShowAllowAmountMsg = true
          this.amountValue = this.toTargetCoinUnit(value.outputs[0].value)
        } else {
          this.isDisplayDetails = true
          this.$nextTick(() => {
            this.transFee = this.toTargetCoinUnit(value.fee)
            this.totalFee = this.toTargetCoinUnit(value.total)
          })
        }
      }).catch(value => {
        utils.displayErrorCode(this, value)
      })
    },
    clearResendStatusAndData () {
      this.clearResendStatus()
      this.clearFormData()
    },
    clearResendStatus () {
      this.isReSendStatus = false
      this.oldTxId = null
    },
    clearAllowAmountMsg () {
      clearInterval(this.intervalId)
      this.isShowAllowAmountMsg = !this.isShowAllowAmountMsg
    },
    autoCloseAllowAmountMsg () {
      let i = 20
      this.AllowAmountMsg = this.$t('message.send_allow_amount_msg_1') + i + 's' + this.$t('message.send_allow_amount_msg_2')
      this.intervalId = setInterval(() => {
        if (i !== 0) {
          this.AllowAmountMsg = this.$t('message.send_allow_amount_msg_1') + i + 's' + this.$t('message.send_allow_amount_msg_2')
          i--
        } else {
          this.isShowAllowAmountMsg = false
          clearInterval(this.intervalId)
        }
      }, 1000)
    }
  }
}
</script>

<style scoped lang="less">
  input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{  /* chrome */
    -webkit-appearance: none!important;
    margin: 0;
  }
  input:-webkit-autofill {
    background-color: #fff;
      -webkit-box-shadow: 0 0 0 1000px white inset;
  }
  .account-msg {
    display: inline-block;
    height: 38px;
    line-height: 38px;
    color: #e74c3c;
    font-weight: 600;
  }
  .switch-money {
    margin-bottom: 5px;
    clear: both;
    color: #999;
  }
  .blank-label{
    width: 160px;
    float: left;
    display: block;
    padding: 9px 15px;
  }
  .amount-input{
    padding-left: 0;
    padding-right: 8px;
    max-width: 210px;
    text-align: end;
    height: 55px;
    font-size: 20px;
    float: right;
    &:after{
      content: "";
      height: 0;
      line-height: 0;
      clear: both;
    }
  }
  .unit-display {
    display: inline-block;
    float: right;
    font-size: 20px;
    font-weight: 600;
    color:#000;
    height: 55px;
    line-height: 55px;
    opacity: 0.6;
    &:after{
      content: "";
      height: 0;
      line-height: 0;
      clear: both;
    }
  }
  .transFee-unit{
    display: inline-block;
    float: right;
    font-size: 16px;
    font-weight: 600;
    height:38px;
    line-height: 38px;
    color:#000;
    opacity: 0.6
  }
  .transFee-btn{
    position: absolute;
    left: 320px;
    top: 5px;
  }
  .transFee-input{
    width: 160px;
    text-align: end;
    float: right;
    padding-right: 8px;
  }
  .usd-amount{
    position: absolute;
    display: block;
    height: 15px;
    right: 198px;
    bottom: 3px;
    font-size: 12px;
    margin-left: 5px;
    color: #999;
    padding-left: 3px;
    width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
  }
  .max-btn {
    position: absolute;
    left: 320px;
    top:13px;
  }
  .account-info {
    text-align: right;
    width: 300px;
    overflow-x: hidden;
  }
  .unit{
    color: #999;
  }
  textarea{
    color: #999;
  }
  .layui-textarea{
    min-height: 60px;
    font-size: 12px;
  }
  /*自定义 表格与样式*/
  .layui-form-item {
    width: 100%;
    border-bottom: 1px dotted #b7d3ea;
  }
  .layui-form-label{
    text-align: left;
    width:auto;
  }
  .layui-textarea {
    width: 400px;
    padding: 9px 10px;
    resize: none;
  }
  .layui-btn-sm {
    height: 28px;
    line-height: 28px;
    font-size: 10px;
  }
  .layui-icon {
    font-size: 20px;
  }
  .site-block {
    border: 1px solid #DCEBF7;
  }
  .account-balance{
    position: absolute;
    left: 258px;
    top: 12px;
    max-width: 300px;
    overflow: hidden;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .add-data-wrapper {
    margin-bottom: 10px;
  }
  .add-data-wrapper .layui-icon {
    font-size: 14px;
  }
  .add-data {
    color: #009a61;
  }
  .add-data:hover{
    opacity: .8;
  }
  .again-send-msg{
    margin-bottom: 10px;
    position: relative;
    width: 100%;
    background-color: #f8e2c1;
    padding: 10px;
    border: 1px solid #f6d8ab;
    border-radius: 4px;
    color: #8f6c38;
  }
  .again-send-content{
    display: inline-block;
    font-size: 14px;
    letter-spacing: .1em;
  }
  .again-send-content .layui-icon{
    font-size: 16px;
  }
  .close-msg {
    position: absolute;
    top: 0;
    right: 15px;
    height: 42px;
    line-height: 42px;
  }
  .close-msg .layui-icon:hover {
    font-weight: 900;
  }
</style>
