<template>
  <div>
    <blockquote class="site-text layui-elem-quote" style="margin-top: 20px">
      <i class="layui-icon">&#xe645;</i> {{$t('message.send_prompt_msg')}}
    </blockquote>
    <div class="site-title" style="margin-top: 20px">
      <fieldset><legend><a name="use">{{sendCoinTypeMsg}}</a></legend></fieldset>
    </div>
    <div class="site-text site-block">
      <form class="layui-form" action="" lay-filter="form1">
        <div class="layui-form-item">
          <label class="layui-form-label account-label" >{{$t('message.send_current_account')}}</label>
          <div class="layui-input-block account-info">
            <div class="account-msg">{{currentAccount.label}}</div>
          </div>
        </div>
        <div class="layui-form-item" style="margin-bottom: 5px">
          <label class="layui-form-label">{{$t('message.send_amount')}}</label>
          <div class="layui-input-inline input-width">
            <input type="number" v-model.number="amountValue" name="money" id="money" lay-verify="isEmpty" :placeholder="currentDisplayUnit(currentAccount.coinType)"
                   autocomplete="off" class="layui-input">
          </div>
          <!--<button class="layui-btn layui-btn-radius layui-btn-primary pull-left" type="button" @click="maxAmount">MAX</button>-->
        </div>
        <div class="switch-money">
          <label class="blank-label"></label>
          <div ><span class="usd-amount" v-if="coinType && currentUnit && currentExchangeRate">{{toExchangeText}}</span><em class="unit"></em></div>
        </div>
        <div class="money-address">
          <div class="layui-form-item">
            <label class="layui-form-label">{{$t('message.send_address')}}</label>
            <div class="layui-input-inline input-width">
              <input type="text" v-model="addressValue" name="address"  lay-verify="isEmpty"  :placeholder="$t('message.send_address')" autocomplete="off" class="layui-input">
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
          <label class="layui-form-label">{{$t('message.send_custom_fee')}}</label>
          <div class="layui-input-inline input-width">
            <input type="number"  lay-verify="isEmpty" v-model="customFees" placeholder="satoshis per byte" autocomplete="off" class="layui-input">
          </div>
          <button class="layui-btn layui-btn-radius layui-btn-primary pull-left" type="button" @click="switchSelectButton">{{$t('message.send_select_fee')}}</button>
        </div>
        <div class="layui-form-item" v-show="!switchFee">
          <label class="layui-form-label">{{$t('message.send_transaction_fees')}}</label>
          <div class="layui-input-inline input-width">
            <select name="fee" lay-filter="fee"  >
              <option v-for="(fee, index) in feeList" v-bind:value="fee.value" :selected="index === 0">{{fee.label}}</option>
            </select>
          </div>
          <button class="layui-btn layui-btn-radius layui-btn-primary pull-left" type="button" @click="switchCustomButton">{{$t('message.send_custom_fee')}}</button>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">{{$t('message.send_total_fee')}}</label>
          <div class="layui-input-inline input-width">
            <textarea disabled  lay-verify="isEmpty" class="layui-textarea" v-bind:value= "totalFeeDesc" name="desc"></textarea>
          </div>
        </div>
        <div class="layui-form-item">
          <div class="layui-input-block">
            <button class="layui-btn" lay-submit type="button" @click="submitSendData">{{$t('message.send_submit_btn')}}</button>
            <button type="reset" class="layui-btn layui-btn-primary">{{$t('message.send_reset_btn')}}</button>
          </div>
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
          esWallet.convertValue(this.coinType, this.totalFee, nowUnit, this.currentExchangeRate).toFixed(2) + ' ' + this.currentExchangeRate + ')'
      }
    },
    toExchangeText () {
      if (this.currentUnit && this.currentExchangeRate) {
        let nowUnit = this.currentDisplayUnit(this.coinType)
        return esWallet.convertValue(this.coinType, this.amountValue, nowUnit, this.currentExchangeRate).toFixed(2) + ' ' + this.currentExchangeRate
      }
    },
    sendCoinTypeMsg () {
      return this.$t('message.send_send_msg') + ' ' + this.coinType
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
          console.log(oldFeeList)

          let newFeeList = []
          let fastMsg = this.$t('message.send_fast_confirm')
          let standardMsg = this.$t('message.send_standard_confirm')
          let slowMsg = this.$t('message.send_slow_confirm')
          newFeeList.push({label: fastMsg + '(' + oldFeeList.fast + ')', value: oldFeeList.fast})
          newFeeList.push({label: standardMsg + '(' + oldFeeList.normal + ')', value: oldFeeList.normal})
          newFeeList.push({label: slowMsg + '(' + oldFeeList.economy + ')', value: oldFeeList.economy})
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
      let nowUnit = this.currentDisplayUnit(this.coinType)
      return esWallet.convertValue(this.coinType, value, D.unit.btc.santoshi, nowUnit)
    },
    toMinCoinUnit (value) {
      let nowUnit = this.currentDisplayUnit(this.coinType)
      return esWallet.convertValue(this.coinType, value, nowUnit, D.unit.btc.santoshi)
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
    padding-left: 10px;
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
</style>
