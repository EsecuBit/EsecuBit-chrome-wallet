<template>
  <div>
    <blockquote class="site-text layui-elem-quote" style="margin-top: 20px">
      <i class="layui-icon">&#xe645;</i>   Make sure you have the correct beneficiary address
    </blockquote>
    <div class="site-title" style="margin-top: 20px">
      <fieldset><legend><a name="use">Send Bitcoins</a></legend></fieldset>
    </div>
    <div class="site-text site-block">
      <form class="layui-form" action="" lay-filter="form1">
        <div class="layui-form-item">
          <label class="layui-form-label account-label" >Current Account</label>
          <div class="layui-input-block account-info">
            <div class="account-msg">{{accountName}}</div>
          </div>
        </div>
        <div class="layui-form-item" style="margin-bottom: 5px">
          <label class="layui-form-label">Amount</label>
          <div class="layui-input-inline input-width">
            <input type="number" v-model.number="amountValue" name="money" id="money" lay-verify="required|money" placeholder="0.00 BTC"
                   autocomplete="off" class="layui-input">
          </div><button class="layui-btn layui-btn-radius layui-btn-primary pull-left" type="button" @click="maxAmount">MAX</button>
        </div>
        <div class="switch-money">
          <label class="blank-label"></label>
          <div ><span class="usd-amount">{{((amountValue * 1235.0191*100000000)/100000000).toFixed(4)}}</span><em class="unit">USD</em></div>
        </div>
        <div class="money-address">
          <div class="layui-form-item">
            <label class="layui-form-label">Bitcoin Address</label>
            <div class="layui-input-inline input-width">
              <input type="text" v-model="addressValue" name="address"  lay-verify="required"  placeholder="Bitcoin Address" autocomplete="off" class="layui-input">
            </div>
            <!--<button class="layui-btn layui-btn-radius layui-btn-primary" type="button" @click="addAddressDom">Add</button>-->
          </div>
          <div class="layui-form-item" v-for="item in addressList">
            <label class="layui-form-label">{{item}}</label>
            <div class="layui-input-inline input-width">
              <input type="text" value="" name="address"  placeholder="Bitcoin Address" autocomplete="off" class="layui-input">
            </div>
          </div>
        </div>
        <!--<div class="layui-form-item">-->
          <!--<label class="layui-form-label">Choose an Account</label>-->
          <!--<div class="layui-input-inline input-width">-->
            <!--<select name="account" lay-verify="required">-->
              <!--<option disabled value="">请选择</option>-->
              <!--<option v-for="account in accountList" v-bind:value="account">{{account}}</option>-->
            <!--</select>-->
          <!--</div>-->
        <!--</div>-->
        <div class="layui-form-item" v-show="switchFee">
          <label class="layui-form-label">Custom fees</label>
          <div class="layui-input-inline input-width">
            <input type="number"  lay-verify="required" v-model="customFees" placeholder="Enter Yours Transaction Fees" autocomplete="off" class="layui-input">
          </div>
          <button class="layui-btn layui-btn-radius layui-btn-primary pull-left" type="button" @click="switchSelectButton">Select fees</button>
        </div>
        <div class="layui-form-item" v-show="!switchFee">
          <label class="layui-form-label">Transaction Fees</label>
          <div class="layui-input-inline input-width">
            <select name="fee" lay-verify="required" lay-filter="fee" v-model="selected" >
              <option disabled value="">请选择</option>
              <option v-for="fee in feeList" v-bind:value="fee.value">{{fee.label}}</option>
            </select>
          </div>
          <button class="layui-btn layui-btn-radius layui-btn-primary pull-left" type="button" @click="switchCustomButton">Custom fees</button>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">Total Fees</label>
          <div class="layui-input-inline input-width">
            <textarea disabled  lay-verify="required" class="layui-textarea"
                      v-bind:value="'BTC '+ (amountValue + selected).toFixed(4)+' (BTC ' + (selected) + ' Transaction Fees)'+ '\n' +
                       'USD '+(amountValue + selected).toFixed(4)+' (USD ' + (selected) + ' Transaction Fees)'"
                      name="desc"></textarea>
          </div>
        </div>
        <div class="layui-form-item">
          <div class="layui-input-block">
            <button class="layui-btn" lay-submit type="button" @click="submitSendData">Submit</button>
            <button type="reset" class="layui-btn layui-btn-primary">Reset</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Bus from '../../common/js/bus'
// eslint-disable-next-line
const form = layui.form
export default {
  name: 'Sending',
  props: ['accountInfo'],
  data () {
    return {
      addressList: [],
      count: 2,
      unit: 'BTC',
      amountValue: 0,
      addressValue: '1MdYC22Gmjp2ejVpCxyYjfyWbQCYTGhGq8',
      selected: 0.01,
      customFees: 0.00,
      accountList: ['account 1', 'account 2'],
      feeList: [
        {label: '慢速确认（0.01 usd）', value: 0.01},
        {label: '标准确认（0.02 usd）', value: 0.02},
        {label: '快速确认（0.05 usd）', value: 0.05}
      ],
      switchFee: false,
      AccountOrder: [],
      accountName: null,
      accountIndex: 0
    }
  },
  watch: {
    accountInfo: {
      handler (newValue, oldValue) {
        this.accountOrder = this.orderArr(newValue)
        this.accountName = this.accountOrder[0].info.label
      }
    },
    accountIndex: {
      handler (newValue, oldValue) {
        this.accountName = this.accountOrder[newValue].info.label
      }
    }
  },
  mounted () {
    Bus.$on('switchAccount', function (index) {
      this.accountIndex = index
    })
    form.render('select', 'form1')
    form.on('select(fee)', data => {
      this.selected = Number(data.value)
    })
  },
  methods: {
    orderArr (targetArr) {
      const arr = []
      const accountList = []
      for (let val of targetArr) {
        if (!arr.includes(val.info.coinType)) {
          arr.push(val.info.coinType)
          accountList.push({type: val.info.coinType, list: [val]})
        } else {
          for (let item of accountList) {
            if (item.type === val.info.coinType) {
              item.list.push(val)
              break
            }
          }
        }
      }
      let a = []
      for (let val of accountList) {
        a = a.concat(val.list)
      }
      return a
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
      console.log(typeof this.amountValue)
      if (!this.switchFee) {
        if (!(this.selected && this.amountValue !== '' && this.addressValue)) return false
      } else {
        if (!(this.customFees && this.amountValue !== '' && this.addressValue)) return false
      }
      let formData = {
        out: this.amountValue,
        address: this.addressValue,
        fee: this.switchFee ? this.customFees : this.selected
      }
      console.log(formData)
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
