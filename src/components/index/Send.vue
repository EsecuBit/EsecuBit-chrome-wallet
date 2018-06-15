<template>
  <div>
    <blockquote class="site-text layui-elem-quote" style="margin-top: 20px">
      <i class="layui-icon">&#xe645;</i> {{$t('message.send_prompt_msg')}}
    </blockquote>
    <div class="site-title" style="margin-top: 20px">
      <fieldset><legend><a name="use">{{sendCoinTypeMsg}}</a></legend></fieldset>
    </div>
    <div class="site-text site-block">
      <form class="layui-form customize-form" action="" lay-filter="form1">
        <div class="layui-form-item">
          <label class="layui-form-label account-label" >{{$t('message.send_current_account')}}</label>
          <div class="layui-input-block account-info" style="margin-left: 464px">
            <div class="account-msg">{{currentAccount.label}}</div>
          </div>
        </div>
        <div class="layui-form-item" style="margin-bottom: 5px">
          <label class="layui-form-label">{{$t('message.send_amount')}}</label>
          <div class="layui-input-block input-width">
            <input type="number" v-model.number="amountValue" name="money" id="money" lay-verify="isEmpty" v-if="coinType"
                   :placeholder="$t('message.send_amount')"
                   autocomplete="off" class="layui-input" style="width: 300px;text-align: end;">
            <span v-if="coinType" style="font-size: 16px;font-weight: 600;color:#000;opacity: 0.6">{{currentDisplayUnit(currentAccount.coinType)}}</span>
            <span class="usd-amount" v-if="coinType && currentUnit && currentExchangeRate">{{toExchangeText}}</span>
          </div>
          <!--<button class="layui-btn layui-btn-radius layui-btn-primary pull-left" type="button" @click="maxAmount">MAX</button>-->
        </div>
        <!--<div class="switch-money">-->
          <!--<label class="blank-label"></label>-->
          <!--<div ><span class="usd-amount" v-if="coinType && currentUnit && currentExchangeRate">{{toExchangeText}}</span><em class="unit"></em></div>-->
        <!--</div>-->
        <div class="money-address">
          <div class="layui-form-item">
            <label class="layui-form-label">{{$t('message.send_address')}}</label>
            <div class="layui-input-block input-width">
              <input type="text" v-model="addressValue" name="address"  lay-verify="isEmpty"  :placeholder="$t('message.send_address')" autocomplete="off"
                     class="layui-input" style="width: 300px;text-align: end;">
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
        <div class="layui-form-item" v-show="switchFee">
          <label class="layui-form-label">{{$t('message.send_transaction_fees')}}</label>
          <div class="layui-input-block input-width">
            <input type="number"  lay-verify="isEmpty" v-model="customFees" :placeholder="$t('message.send_transaction_fees')" autocomplete="off" class="layui-input" style="width: 300px;text-align: end;  ">
            <button class="layui-btn layui-btn-sm layui-btn-radius "
                    style="margin-left: 5px" type="button" @click="switchSelectButton">{{$t('message.send_select_fee')}}</button>
          </div>
        </div>
        <div class="layui-form-item" v-show="!switchFee">
          <label class="layui-form-label">{{$t('message.send_transaction_fees')}}</label>
          <div class="layui-input-block input-width" style="margin-left: 270px">
            <div style="display: inline-block;width: 200px">
              <select name="fee" lay-filter="fee"  style="width: 200px">
              <option v-for="(fee, index) in feeList" v-bind:value="fee.value" :selected="index === 0">{{fee.label}}</option>
              </select>
            </div>
            <button class="layui-btn layui-btn-sm layui-btn-radius "
                    style="margin-left: 5px" type="button" @click="switchCustomButton">{{$t('message.send_custom_fee')}}</button>
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">{{$t('message.send_total_fee')}}</label>
          <div class="layui-input-inline input-width">
            <textarea disabled  class="layui-textarea" v-bind:value= "totalFeeDesc" name="desc"></textarea>
          </div>
        </div>
        <div class="layui-form-item" style="border:none">
          <button class="layui-btn" lay-submit type="button" @click="submitSendData">{{$t('message.send_submit_btn')}}</button>
          <button type="reset" class="layui-btn layui-btn-primary">{{$t('message.send_reset_btn')}}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Bus from '../../common/js/bus'
import D from '../../common/js/wallet/sdk/D'
import EsWallet from '../../common/js/wallet/sdk/EsWallet'
const esWallet = new EsWallet()
// eslint-disable-next-line
const form = layui.form
// eslint-disable-next-line
const layer = layui.layer
export default {
  name: 'Sending',
  props: ['accountInfo', 'currentUnit', 'currentUnitEth', 'currentExchangeRate'],
  data () {
    return {
      addressList: [],
      count: 2,
      unit: 'BTC',
      amountValue: null,
      addressValue: '',
      selected: null,
      customFees: 0.00,
      accountList: ['account 1', 'account 2'],
      feeList: [
        {label: 'slow（10 usd）', value: 10}
      ],
      switchFee: false,
      accountOrder: [],
      currentAccount: {label: ''},
      totalFee: 0,
      coinType: ''
    }
  },
  computed: {
    totalFeeDesc () {
      if (this.coinType && this.currentUnit && this.currentExchangeRate) {
        let nowUnit = this.currentDisplayUnit(this.coinType)
        return this.totalFee.toFixed(2) + ' ' + nowUnit + ' (' +
          esWallet.convertValue(this.coinType, this.totalFee, nowUnit, this.currentExchangeRate).toFixed(2) + ' ' + this.currentExchangeRate + ')' + ' '
      }
    },
    toExchangeText () {
      if (this.currentUnit && this.currentExchangeRate) {
        let nowUnit = this.currentDisplayUnit(this.coinType)
        return esWallet.convertValue(this.coinType, this.amountValue, nowUnit, this.currentExchangeRate).toFixed(2) + ' ' + this.currentExchangeRate
      }
    },
    sendCoinTypeMsg () {
      let coinTypeName = this.coinType.includes('btc') ? 'Bitcoin' : 'Ether'
      return this.$t('message.send_send_msg') + ' ' + coinTypeName
    }
  },
  watch: {
    amountValue: {
      handler (newValue, oldValue) {
        if (this.currentAccount.prepareTx) {
          this.calculateTotal()
        }
      }
    },
    switchFee: {
      handler () {
        this.calculateTotal()
      }
    },
    customFees: {
      handler () {
        if (this.switchFee) this.calculateTotal()
      }
    },
    accountInfo: {
      handler (newValue, oldValue) {
        this.accountOrder = newValue
        this.currentAccount = this.accountOrder[0]
      }
    },
    currentAccount: {
      handler (newValue, oldValue) {
        this.coinType = newValue.coinType
        if (newValue.getSuggestedFee) {
          let oldFeeList = newValue.getSuggestedFee()
          console.log(oldFeeList, 12343213123)
          let newFeeList = []
          let fastestMsg = this.$t('message.send_fastest_confirm')
          let fastMsg = this.$t('message.send_fast_confirm')
          let standardMsg = this.$t('message.send_standard_confirm')
          let slowMsg = this.$t('message.send_slow_confirm')
          if (this.coinType.includes('btc')) {
            newFeeList.push({label: fastMsg + '(' + oldFeeList.fast + ')', value: oldFeeList.fast})
            newFeeList.push({label: standardMsg + '(' + oldFeeList.normal + ')', value: oldFeeList.normal})
            newFeeList.push({label: slowMsg + '(' + oldFeeList.economic + ')', value: oldFeeList.economic})
          } else {
            newFeeList.push({label: fastestMsg + '(' + oldFeeList.fastest + ')', value: oldFeeList.fastest})
            newFeeList.push({label: fastMsg + '(' + oldFeeList.fast + ')', value: oldFeeList.fast})
            newFeeList.push({label: standardMsg + '(' + oldFeeList.normal + ')', value: oldFeeList.normal})
            newFeeList.push({label: slowMsg + '(' + oldFeeList.economic + ')', value: oldFeeList.economic})
          }
          this.feeList = newFeeList
          this.selected = oldFeeList.fast
          this.$nextTick(() => {
            form.render('select', 'form1')
            form.on('select(fee)', data => {
              this.selected = Number(data.value)
              this.calculateTotal()
            })
          })
        }
      }
    }
  },
  mounted () {
    this.verifyForm()
    Bus.$on('switchAccount', (index) => { this.currentAccount = this.accountOrder[index] })
  },
  methods: {
    verifyForm () {
      let that = this
      form.verify({
        isEmpty (value) {
          if (!value) return that.$t('message.send_form_is_empty')
        }
      })
    },
    currentDisplayUnit (coinType) {
      return coinType.includes('btc') ? this.currentUnit : this.currentUnitEth
    },
    toTargetCoinUnit (value) {
      if (this.coinType) {
        let nowUnit = this.currentDisplayUnit(this.coinType)
        return esWallet.convertValue(this.coinType, value, D.unit.btc.santoshi, nowUnit)
      }
    },
    toMinCoinUnit (value) {
      if (this.coinType) {
        let nowUnit = this.currentDisplayUnit(this.coinType)
        return esWallet.convertValue(this.coinType, value, nowUnit, D.unit.btc.santoshi)
      }
    },
    maxAmount () {
      this.amountValue = 200
    },
    switchSelectButton () {
      this.switchFee = !this.switchFee
      this.customFees = 0.00
    },
    switchCustomButton () {
      this.switchFee = !this.switchFee
      this.customFees = null
    },
    submitSendData () {
      if (!this.switchFee) {
        if (!(this.selected && this.amountValue !== '' && this.addressValue)) return false
      } else {
        if (!(this.customFees && this.amountValue !== '' && this.addressValue)) return false
      }
      let address = this.addressValue
      let moneyValue = this.amountValue
      let formData = {
        feeRate: Number(this.switchFee ? this.customFees : this.selected),
        outputs: [{
          address: address,
          value: moneyValue
        }]
      }
      this.currentAccount.prepareTx(formData).then(value => this.currentAccount.buildTx(value))
        .then(value => this.currentAccount.sendTx(value)).then(value => { layer.msg(this.$t('message.send_submit_success'), { icon: 1 }) })
        .catch(value => { layer.msg(this.$t('message.send_submit_error'), { icon: 2 }) })
    },
    calculateTotal () {
      let getAmountValue = this.amountValue ? this.amountValue : 0
      let sendAmountValue = this.toMinCoinUnit(getAmountValue)
      let getAddress = this.addressValue
      let formData = {
        feeRate: Number(this.switchFee ? this.customFees : this.selected),
        outputs: [{
          address: getAddress,
          value: sendAmountValue
        }]
      }
      this.currentAccount.prepareTx(formData).then(value => { this.totalFee = this.toTargetCoinUnit(value.total) })
        .catch(value => { layer.msg(value, { icon: 2 }) })
    },
    addAddressDom () {
      let name = 'Bitcoin Address ' + this.count
      this.addressList.push(name)
      this.count++
    }
  }
}
</script>

<style scoped>
  input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{  /* chrome */
    -webkit-appearance: none!important;
    margin: 0;
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
  .usd-amount{
    font-size: 12px;
    margin-left: 5px;
    color: #999;
    padding-left: 3px;
  }
  .unit{
    color: #999;
  }
  textarea{
    color: #999;
  }
  .layui-textarea{
    min-height: 80px;
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
    width: 395px;
    padding: 9px 10px;
    resize: none;
  }
  .layui-btn-sm {
    height: 28px;
    line-height: 28px;
    font-size: 10px;
  }
  .site-block {
    border: 1px solid #DCEBF7;
  }
</style>
