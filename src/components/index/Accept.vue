<template>
  <div>
    <blockquote class="site-text layui-elem-quote" style="margin-top: 20px">
      <i class="layui-icon">&#xe645;</i>   {{$t('message.accept_prompt_msg')}}
    </blockquote>
    <div class="site-title" style="margin-top: 20px">
      <fieldset><legend><a name="use">{{receiveCoinTypeMsg}}</a></legend></fieldset>
    </div>
    <div class="site-text site-block">
      <form class="layui-form"  lay-filter="form2">
        <div class="layui-form-item">
          <label class="layui-form-label account-label" >{{$t('message.accept_current_account')}}</label>
          <div class="layui-input-block account-info">
            <div class="account-msg">{{currentAccount.label}}</div>
          </div>
        </div>
        <div class="layui-form-item" v-if="isSelect">
          <label class="layui-form-label account-label" >Choose an Account</label>
          <div class="layui-input-block">
            <select name="receiveAccount" lay-verify="required" lay-filter="receiveAccount" v-model="selected">
              <option disabled value="">please choose</option>
              <option v-for="account in accountAddress" v-bind:value="account.value">{{account.label}}</option>
            </select>
          </div>
        </div>
        <div class="layui-form-item">
          <div class="address-container" v-text="promptMsg">
          </div>
          <div class="qrcode" v-show="!showAddress" style="line-height: 210px;text-align: center;border: 1px solid #eee">
            <i class="icon iconfont icon-erweima" style="font-size: 50px"></i>
          </div>
          <div id="code" class="qrcode" v-show="showAddress"></div>
        </div>
        <div class="layui-form-item" v-show="showButton" style="text-align: center">
          <a href="#" class="layui-btn layui-btn-radius address-btn" @click="generateAddress">Generate Address
            <i class="layui-icon">&#xe623;</i>
          </a>
        </div>
        <div class="layui-form-item" v-show="showAddress">
          <div class="description">{{qrAddressMsg}}</div>
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
  name: 'accept',
  props: ['accountInfo'],
  data () {
    return {
      selected: '',
      isSelect: false,
      isFirst: true,
      qrAddress: null,
      accountIndex: 0,
      accountOrder: [],
      currentAccount: {label: ''},
      accountQrcode: null,
      coinType: '',
      accountAddress: [ { label: 'accout 1', value: '2313131352' }, {label: 'accout 2', value: 'https://www.baidu.com'} ],
      showButton: true,
      showAddress: false,
      promptMsg: 'Click the button below to generate a QR code, please check the address and confirm on the device',
      msg1: 'Click the button below to generate a QR code, please check the address and confirm on the device',
      msg2: 'Please double-check that your address from the page matches the address on your device'
    }
  },
  computed: {
    qrAddressMsg () {
      return this.$t('message.accept_qrcode_msg') + this.qrAddress
    },
    receiveCoinTypeMsg () {
      let coinTypeName = this.D.isBtc(this.coinType) ? 'Bitcoin' : 'Ether'
      return this.$t('message.accept_accept_msg') + ' ' + coinTypeName
    }
  },
  watch: {
    accountInfo: {
      handler (newValue, oldValue) {
        this.coinType = newValue[0].coinType
        this.accountOrder = newValue
        this.currentAccount = this.accountOrder[0]
      }
    },
    accountIndex: {
      handler (newValue, oldValue) {
        this.coinType = this.accountOrder[newValue].coinType
        this.currentAccount = this.accountOrder[newValue]
        this.showButton = true
        this.showAddress = false
      }
    }
  },
  mounted () {
    form.render('select', 'form2')
    Bus.$on('switchAccount', (index) => {
      this.accountIndex = index
    })
  },
  methods: {
    generateAddress () {
      if (this.isFirst) {
        this.currentAccount.getAddress().then(value => {
          this.generateQRCode(value.qrAddress)
          this.qrAddress = value.address
          this.showButton = false
          this.showAddress = true
        }).catch(value => { console.log(value) })
        this.isFirst = false
      } else {
        this.currentAccount.getAddress().then(value => {
          this.changeQRCode(value.qrAddress)
          this.qrAddress = value.address
          this.showButton = false
          this.showAddress = true
        }).catch(value => { console.log(value) })
      }
    },
    generateQRCode (address) {
      // eslint-disable-next-line
      this.accountQrcode = new QRCode('code', {
        text: address,
        width: 200,
        height: 200,
        colorDark: '#000000',
        colorLight: '#ffffff',
        // eslint-disable-next-line
        correctLevel: QRCode.CorrectLevel.H
      })
      // form.on('select(receiveAccount)', function (data) {
      //   accountQrcode.makeCode(data.value)
      // })
    },
    changeQRCode (address) {
      if (this.accountQrcode) {
        this.accountQrcode.makeCode(address)
      }
    }
  }
}
</script>

<style scoped>
  .account-label{
    font-size: 13px;
    padding-left: 0;
    width: 150px;
  }
  .account-msg {
    display: inline-block;
    height: 38px;
    line-height: 38px;
    color: #e74c3c;
    font-weight: 600;
  }
  /*自定义的qrcode*/
  .qrcode{
    display: block;
    width: 210px;
    height: 210px;
    margin: 15px auto 10px;

  }
  .address-container {
    display: block;
    position: relative;
    text-align: center;
    font-size: 14px;
    color: #444;
    width: 450px;
    height: 45px;
    line-height: 150%;
    margin: 0 auto 5px;
  }
  .address-btn {
    color: #fff;
    background-color: rgb(42, 195, 148);
  }
  .description{
    padding: 9px 0!important;
    margin: 0 auto;
    display: block;
    line-height: 20px;
    color: #999!important;
    text-align: center ;
  }
</style>
