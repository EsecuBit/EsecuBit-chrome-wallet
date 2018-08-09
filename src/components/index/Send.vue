<template>
  <div>
    <blockquote class="site-text layui-elem-quote" style="margin-top: 20px">
      <i class="layui-icon">&#xe645;</i> {{$t('message.send_prompt_msg')}}
    </blockquote>
    <div class="site-title" style="margin-top: 20px">
      <fieldset><legend><a name="use">{{sendCoinTypeMsg}}</a></legend></fieldset>
    </div>
    <div class="site-text site-block">
      <form class="layui-form customize-form" action="" lay-filter="form1" autocomplete="off">
        <div class="layui-form-item" style="position: relative">
          <label class="layui-form-label account-label" >{{$t('message.send_current_account')}}</label>
          <!--<div class="layui-input-block account-info " >-->
            <!--<div class="account-msg">{{currentAccount.label}}</div>-->
          <!--</div>-->
          <div class="layui-input-block input-width account-name" style="margin-left: 220px">
            <div style="display: inline-block;width: 250px">
              <select name="account" lay-filter="account"  style="width: 250px" v-model="currentSelectedAccountIndex" >
                <option v-for="(accountItem, index) in accountInfo"  :value="index">{{accountItem.label}}</option>
              </select>
            </div>
            <div class="account-balance">{{getBalance}}</div>
          </div>
        </div>
        <div class="layui-form-item" style="margin-bottom: 5px">
          <label class="layui-form-label" style="padding: 17px 15px">{{$t('message.send_amount')}}</label>
          <div class="layui-input-block input-width" style="position: relative;height: 55px">
            <div style="width: 300px">
              <div v-if="coinType" class="unit-display" >{{currentDisplayUnit(currentAccount.coinType)}}</div>
              <input type="number" v-model="amountValue" name="money" id="money" lay-verify="isEmpty" v-if="coinType"
                     :placeholder="$t('message.send_amount')"
                     autocomplete="off" class="layui-input amount-input">
            </div>
            <button class="layui-btn layui-btn-radius layui-btn-sm max-btn" type="button" @click="maxAmount">MAX</button>
            <div class="usd-amount" v-if="coinType && currentUnit && currentExchangeRate && isDisplayExchange">{{toExchangeText}}</div>
          </div>
        </div>
        <!--<div class="switch-money">-->
          <!--<label class="blank-label"></label>-->
          <!--<div ><span class="usd-amount" v-if="coinType && currentUnit && currentExchangeRate">{{toExchangeText}}</span><em class="unit"></em></div>-->
        <!--</div>-->
        <div class="money-address">
          <div class="layui-form-item">
            <label class="layui-form-label">{{$t('message.send_address')}}</label>
            <div class="layui-input-block input-width" style="margin-left: 100px">
              <input type="text" v-model="addressValue" name="address"  lay-verify="isEmpty"  :placeholder="$t('message.send_address')"
                     class="layui-input" style="width: 360px;text-align: right;" id="transactionAddress">
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
            <!--<button class="layui-btn layui-btn-radius layui-btn-primary" type="button" @click="addAddressDom">Add</button>-->
          </div>
          <div class="layui-form-item" v-for="item in addressList">
            <label class="layui-form-label">{{item}}</label>
            <div class="layui-input-inline input-width">
              <input type="text" value="" name="address"  placeholder="Address" autocomplete="off" class="layui-input">
            </div>
          </div>
        </div>
        <!--<div class="layui-form-item">-->
          <!--<label class="layui-form-label">Choose an Account</label>-->
          <!--<div class="layui-input-inline input-width">-->
            <!--<select name="account" lay-verify="isEmpty">-->
              <!--<option disabled value="">请选择</option>-->
              <!--<option v-for="account in accountList" v-bind:value="account">{{account}}</option>-->
            <!--</select>-->
          <!--</div>-->
        <!--</div>-->
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
        <div class="layui-form-item" v-show="!switchFee">
          <label class="layui-form-label">{{isBtc?$t('message.send_transaction_fees'): 'Gas price'}}</label>
          <div class="layui-input-block input-width" style="margin-left: 220px">
            <div style="display: inline-block;width: 250px">
              <select name="fee" lay-filter="fee"  style="width: 250px">
              <option v-for="(fee, index) in feeList"  :value="index" :selected="selectedIndex(index)">{{fee.label}}</option>
              </select>
            </div>
            <button class="layui-btn layui-btn-sm layui-btn-radius "
                    style="margin-left: 5px" type="button" @click="switchCustomButton">{{$t('message.send_custom_fee')}}</button>
          </div>
        </div>

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
        <div class="layui-form-item" v-show="isShowData && !isBtc">
          <label class="layui-form-label">Data</label>
          <div class="layui-input-block input-width" style="margin-left: 100px">
            <input type="text" value="" name="data"  v-model="etcData" :placeholder="$t('message.send_data')" class="layui-input" style="width: 360px;text-align: right;">
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">{{$t('message.send_total_fee')}}</label>
          <div class="layui-input-inline input-width">
            <textarea disabled  class="layui-textarea" v-bind:value= "totalDisplayFee" name="desc"></textarea>
          </div>
        </div>

        <div class="add-data-wrapper" v-show="!isShowData && !isBtc">
          <a class="add-data" @click="switchData">
            <i class="layui-icon">&#xe654;</i> {{$t('message.send_advance')}}
          </a>
        </div>
        <div class="layui-form-item" style="border:none">
          <button class="layui-btn" lay-submit type="button" @click="submitSendData">{{$t('message.send_submit_btn')}}</button>
          <button type="button" class="layui-btn layui-btn-primary" @click="clearFormData">{{$t('message.send_reset_btn')}}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Bus from '../../common/js/bus'

const form = layui.form
const layer = layui.layer
export default {
  name: 'Sending',
  props: ['accountInfo', 'currentUnit', 'currentUnitEth', 'currentExchangeRate', 'resetStatus', 'errorCodeMsg'],
  data () {
    return {
      addressList: [],
      count: 2,
      unit: 'BTC',
      amountValue: null,
      addressValue: '',
      selected: null,
      customFees: 0,
      accountList: ['account 1', 'account 2'],
      feeList: [
        {label: 'slow（10 usd）', value: 10}
      ],
      switchFee: false,
      currentAccount: {label: ''},
      totalFee: 0,
      totalDisplayFee: '',
      isDisplayExchange: false,
      isDisplayDetails: false,
      coinType: '',
      isDisplayIcon: false,
      isAddressError: false,
      isAddressTrue: false,
      isInit: true,
      currentSelectedIndex: null,
      currentSelectedAccountIndex: 0,
      isClearFormData: false,
      gasLimit: 21000,
      gasPrice: 0,
      isShowData: false,
      etcData: ''
    }
  },
  computed: {
    isBtc () {
      return this.D.isBtc(this.coinType)
    },
    toExchangeText () {
      if (this.currentUnit && this.currentExchangeRate) {
        let nowUnit = this.currentDisplayUnit(this.coinType)
        let exchange = Number(this.esWallet.convertValue(this.coinType, String(Number(this.amountValue)), nowUnit, this.currentExchangeRate)).toFixed(2)
        return this.formatNum(exchange) + ' ' + this.currentExchangeRate
      }
    },
    sendCoinTypeMsg () {
      let coinTypeName = this.D.isBtc(this.coinType) ? 'Bitcoin' : 'Ether'
      return this.$t('message.send_send_msg') + ' ' + coinTypeName
    },
    getBalance () {
      let coinType = this.currentDisplayUnit(this.coinType)
      return '(' + this.$t('message.send_balance') + this.toTargetCoinUnit(this.currentAccount.balance) + ' ' + coinType + ')'
    }
  },
  watch: {
    resetStatus: {
      handler (newValue, oldValue) {
        if (newValue) {
          this.isInit = true
        }
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
    totalFee: {
      handler (newValue, oldValue) {
        if (this.coinType && this.currentUnit && this.currentExchangeRate && this.isDisplayDetails) {
          let nowUnit = this.currentDisplayUnit(this.coinType)
          let exchange = this.esWallet.convertValue(this.coinType, newValue, nowUnit, this.currentExchangeRate)
          this.totalDisplayFee = newValue + ' ' + nowUnit + ' (' +
            this.formatNum(exchange) + ' ' + this.currentExchangeRate + ')' + ' '
        }
      }
    },
    amountValue: {
      handler (newValue, oldValue) {
        this.isDisplayExchange = true
        if (Number(newValue) < 0) {
          this.amountValue = null
          layer.msg(this.$t('message.send_positive_number'), { icon: 2, anim: 6 })
          return false
        }
        if (newValue !== null && (!this.isClearFormData)) {
          this.calculateTotal()
        }
      }
    },
    switchFee: {
      handler () {
        if (!this.isClearFormData) this.calculateTotal()
      }
    },
    customFees: {
      handler (newValue, oldValue) {
        if (Number(newValue) < 0) {
          this.customFees = null
          layer.msg(this.$t('message.send_positive_number'), { icon: 2, anim: 6 })
          return
        }
        if (this.switchFee && (!this.isClearFormData)) this.calculateTotal()
      }
    },
    gasLimit: {
      handler (newValue, oldValue) {
        if (!newValue) return
        if (Number(newValue) < 0) {
          this.gasLimit = null
          layer.msg(this.$t('message.send_positive_number'), { icon: 2, anim: 6 })
          return
        }
        if (this.switchFee && (!this.isClearFormData)) this.calculateTotal()
      }
    },
    gasPrice: {
      handler (newValue, oldValue) {
        if (Number(newValue) < 0) {
          this.gasPrice = null
          layer.msg(this.$t('message.send_positive_number'), { icon: 2, anim: 6 })
          return
        }
        if (this.switchFee && (!this.isClearFormData)) this.calculateTotal()
      }
    },
    accountInfo: {
      handler (newValue, oldValue) {
        this.$nextTick(() => {
          this.renderAccountForm()
        })
        if (this.isInit) this.currentAccount = newValue[0]
        this.isInit = false
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
    }
  },
  mounted () {
    this.verifyForm()
    Bus.$on('switchAccount', (index) => {
      this.currentSelectedAccountIndex = index
      this.currentAccount = this.accountInfo[index]
      this.$nextTick(() => {
        this.renderAccountForm()
      })
    })
    Bus.$on('switchLang', () => { this.renderFeeForm(this.currentAccount) })
    Bus.$on('rename', () => { this.renderAccountForm() })
  },
  methods: {
    switchData () {
      this.isShowData = true
    },
    renderAccountForm () {
      form.render('select', 'form1')
      form.on('select(account)', data => {
        let index = Number(data.value)
        this.$nextTick(() => {
          this.currentSelectedAccountIndex = index
          this.currentAccount = this.accountInfo[index]
        })
      })
    },
    displayErrorCode (value) {
      layer.closeAll()
      let errorKey = String(value)
      if (this.errorCodeMsg[errorKey]) {
        layer.msg(this.errorCodeMsg[errorKey], {icon: 2, anim: 6})
      } else {
        layer.msg(errorKey, {icon: 2, anim: 6})
      }
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
          newFeeList.push({label: fastestMsg + '(' + this.WeiToGwei(oldFeeList.fastest) + ' ' + this.D.unit.eth.GWei + ')', value: oldFeeList.fastest})
          newFeeList.push({label: fastMsg + '(' + this.WeiToGwei(oldFeeList.fast) + ' ' + this.D.unit.eth.GWei + ')', value: oldFeeList.fast})
          newFeeList.push({label: standardMsg + '(' + this.WeiToGwei(oldFeeList.normal) + ' ' + this.D.unit.eth.GWei + ')', value: oldFeeList.normal})
          newFeeList.push({label: slowMsg + '(' + this.WeiToGwei(oldFeeList.economic) + ' ' + this.D.unit.eth.GWei + ')', value: oldFeeList.economic})
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
      this.$nextTick(() => {
        this.amountValue = null
        this.addressValue = ''
        this.customFees = 0
        this.gasLimit = 21000
        this.gasPrice = 0
        this.totalDisplayFee = ''
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
      if (this.coinType) {
        return this.D.isBtc(this.coinType) ? index === 1 : index === 2
      }
    },
    currentDisplayUnit (coinType) {
      return this.D.isBtc(coinType) ? this.currentUnit : this.currentUnitEth
    },
    currentTransactionUnit (coinType) {
      return this.D.isBtc(coinType) ? 'satoshi per byte' : 'Gwei per byte'
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
      let formData = {
        sendAll: true,
        feeRate: String(this.switchFee ? getCustomFees : this.selected),
        outputs: [{
          address: getAddress,
          value: '0'
        }]
      }
      this.currentAccount.prepareTx(formData).then(result => {
        this.amountValue = this.toTargetCoinUnit(result.outputs[0].value)
      })
        .catch(value => {
          console.warn(value)
          this.displayErrorCode(value)
        })
    },
    verifyAddress () {
      if (!this.currentAccount) return false
      try {
        this.currentAccount.checkAddress(this.addressValue)
        layer.msg(this.$t('message.send_effective_address_mag'), { icon: 1, anim: 2, time: 1500 })
      } catch (e) {
        console.warn(e)
        this.displayErrorCode(e)
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
          console.warn(e)
          this.displayErrorCode(e)
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
      this.customFees = null
      this.gasPrice = null
    },
    WeiToGwei (value) {
      return this.esWallet.convertValue(this.coinType, value, this.D.unit.eth.Wei, this.D.unit.eth.GWei)
    },
    gweiToWei (value) {
      return this.esWallet.convertValue(this.coinType, value, this.D.unit.eth.GWei, this.D.unit.eth.Wei)
    },
    submitSendData () {
      // 验证表单
      if (!this.switchFee) {
        if (!(this.selected && this.amountValue && this.addressValue)) return false
      } else {
        if (!(this.customFees && this.amountValue && this.addressValue) && this.D.isBtc(this.coinType)) return false
        if (!(this.gasPrice && this.amountValue && this.addressValue && this.gasLimit) && !this.D.isBtc(this.coinType)) return false
      }
      if (!this.verifySubmitAddress()) return false
      layer.msg(this.$t('message.send_is_click'), {time: 600000000})
      let address = this.addressValue
      let moneyValue = this.toMinCoinUnit(String(this.amountValue))
      let getCustomFees = this.customFees ? String(this.customFees) : '0'
      let customFees = this.D.isBtc(this.coinType) ? getCustomFees : this.gweiToWei(getCustomFees)
      let formData = {}
      if (this.D.isBtc(this.coinType)) {
        formData = {
          feeRate: String(this.switchFee ? customFees : this.selected),
          outputs: [{
            address: address,
            value: moneyValue
          }]
        }
      } else {
        let gasPrice = String(this.gasPrice ? this.gasPrice : 0)
        let getGasPrice = this.gweiToWei(gasPrice)
        formData = {
          output: {
            address: address,
            value: moneyValue
          },
          gasPrice: String(this.switchFee ? getGasPrice : this.selected),
          gasLimit: String(this.gasLimit),
          data: this.etcData
        }
      }
      console.log(formData, '0xc0C67EfdCf6eA024F0Bad34d3c6D60773b8b078A')
      this.$emit('preventPageSwitch', true)
      setTimeout(() => {
        this.currentAccount.prepareTx(formData).then(value => {
          return this.currentAccount.buildTx(value)
        })
          .then(value => {
            layer.closeAll('msg')
            layer.msg(this.$t('message.send_is_trading'), {time: 600000000})
            return this.currentAccount.sendTx(value)
          }).then(value => {
          // 格式化表格
            this.$emit('allowPageSwitch', true)
            this.clearFormData()
            layer.closeAll('msg')
            layer.msg(this.$t('message.send_submit_success'), { icon: 1 })
            this.$emit('switchFirstPage', true)
          }).catch(value => {
            console.warn(value)
            this.$emit('allowPageSwitch', true)
            layer.closeAll('msg')
            this.displayErrorCode(value)
          })
      }, 200)
    },
    calculateTotal () {
      let getAmountValue = this.amountValue ? String(this.amountValue) : '0'
      let sendAmountValue = this.toMinCoinUnit(getAmountValue)
      let getCustomFees = this.customFees ? String(this.customFees) : '0'
      let getAddress = this.addressValue
      let customFees = this.D.isBtc(this.coinType) ? getCustomFees : this.gweiToWei(getCustomFees)
      let formData = {
        feeRate: this.switchFee ? customFees : String(this.selected),
        outputs: [{
          address: getAddress,
          value: sendAmountValue
        }]
      }
      if (this.D.isBtc(this.coinType)) {
        formData = {
          feeRate: this.switchFee ? customFees : String(this.selected),
          outputs: [{
            address: getAddress,
            value: sendAmountValue
          }]
        }
      } else {
        let gasPrice = String(this.gasPrice ? this.gasPrice : 0)
        let getGasPrice = this.gweiToWei(gasPrice)
        formData = {
          output: {
            address: getAddress,
            value: sendAmountValue
          },
          gasPrice: String(this.switchFee ? getGasPrice : this.selected),
          gasLimit: String(this.gasLimit),
          data: ''
        }
        console.log(formData)
      }
      this.currentAccount.prepareTx(formData).then(value => {
        this.isDisplayDetails = true
        this.$nextTick(() => {
          this.totalFee = this.toTargetCoinUnit(value.total)
        })
      })
        .catch(value => {
          console.warn(value)
          this.displayErrorCode(value)
        })
    },
    addAddressDom () {
      let name = 'Bitcoin Address ' + this.count
      this.addressList.push(name)
      this.count++
    },
    formatNum (num) {
      return parseFloat(num).toLocaleString()
    }
  }
}
</script>

<style scoped>
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
  }
  .amount-input:after {
    content: "";
    height: 0;
    line-height: 0;
    clear: both;
  }
  .unit-display:after {
    content: "";
    height: 0;
    line-height: 0;
    clear: both;
  }
  .unit-display {
    display: inline-block;
    float: right;
    font-size: 20px;
    font-weight: 600;
    color:#000;
    height: 55px;
    line-height: 55px;
    opacity: 0.6
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
    max-width: 200px;
    overflow: hidden;
    font-size: 12px;
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
</style>
