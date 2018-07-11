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
        <div class="layui-form-item" style="margin-bottom: 0">
          <label class="layui-form-label account-label" >{{$t('message.accept_current_account')}}</label>
          <div class="layui-input-block account-info">
            <div class="account-msg" v-if="currentAccount.label">{{currentAccount.label}}</div>
          </div>
        </div>
        <div class="layui-form-item">
          <div class="layui-form-label tips">{{$t('message.accept_tips')}}</div>
          <div class="layui-input-block address-container" v-text="msg1" v-show="isInitDisplay">
          </div>
          <div class="layui-input-block address-container" v-text="msg2" v-show="!isInitDisplay">
          </div>
          <div class="qrcode" v-show="!showAddress" style="line-height: 210px;text-align: center;border: 1px solid #eee">
            <i class="icon iconfont icon-erweima" style="font-size: 50px"></i>
          </div>
          <div id="code" class="qrcode" v-show="showAddress"></div>
        </div>
        <div class="layui-form-item" v-show="showButton" >
          <div class="layui-input-block account-info">
            <a href="#" class="layui-btn layui-btn-radius address-btn" @click="generateAddress">{{$t('message.accept_generate_address')}}
              <i class="layui-icon">&#xe623;</i>
            </a>
          </div>
        </div>
        <div class="layui-form-item" v-show="showAddress">
          <label class="layui-form-label account-label" >{{$t('message.accept_qrcode_msg')}}</label>
          <div class="layui-input-block account-info">
            <div class="description">{{qrAddress}}</div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Bus from '../../common/js/bus'

const form = layui.form
export default {
  name: 'accept',
  props: ['accountInfo'],
  data () {
    return {
      isFirst: true,
      qrAddress: null,
      accountIndex: 0,
      accountOrder: [],
      currentAccount: {label: ''},
      accountQrcode: null,
      coinType: '',
      showButton: true,
      showAddress: false,
      isInitDisplay: true,
      isInit: true,
      msg1: this.$t('message.accept_prompt_msg1'),
      msg2: this.$t('message.accept_prompt_msg2')
    }
  },
  computed: {
    receiveCoinTypeMsg  () {
      let coinTypeName = this.D.isBtc(this.coinType) ? 'Bitcoin' : 'Ether'
      return this.$t('message.accept_accept_msg') + ' ' + coinTypeName
    }
  },
  watch: {
    accountInfo: {
      handler (newValue, oldValue) {
        this.accountOrder = newValue
        if (this.isInit) {
          this.coinType = newValue[0].coinType
          this.currentAccount = this.accountOrder[0]
        }
        this.isInit = false
      }
    },
    accountIndex: {
      handler (newValue, oldValue) {
        this.coinType = this.accountOrder[newValue].coinType
        this.currentAccount = this.accountOrder[newValue]
        this.initDisplay()
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
          this.switchDisplay()
        }).catch(value => { console.log(value) })
        this.isFirst = false
      } else {
        this.currentAccount.getAddress().then(value => {
          this.changeQRCode(value.qrAddress)
          this.qrAddress = value.address
          this.switchDisplay()
        }).catch(value => { console.log(value) })
      }
    },
    initDisplay () {
      this.showButton = true
      this.showAddress = false
      this.isInitDisplay = true
    },
    switchDisplay () {
      this.showButton = false
      this.showAddress = true
      this.isInitDisplay = false
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
    },
    changeQRCode (address) {
      if (this.accountQrcode) this.accountQrcode.makeCode(address)
    }
  }
}
</script>

<style scoped>
  .account-label{
    font-size: 13px;
    padding-left: 0;
    width: 180px;
  }
  .account-msg {
    display: inline-block;
    height: 38px;
    line-height: 38px;
    color: #e74c3c;
    font-weight: 600;
  }
  .account-info {
    margin-left: 190px;
  }
  /*自定义的qrcode*/
  .qrcode{
    display: block;
    width: 210px;
    height: 210px;
    margin-left: 190px;
  }
  .address-container {
    text-align: left;
    font-size: 14px;
    color: #444;
    width: 550px;
    height: 63px;
    padding: 9px 0;
    line-height: 150%;
    margin-left: 190px;
    margin-bottom: 5px;
  }
  .tips {
    height: 45px;
    width: 180px;
    line-height: 150%;
    text-align: right;
  }
  .address-btn {
    color: #fff;
    background-color: rgb(42, 195, 148);
    width: 210px;
  }
  .description{
    display: inline-block;
    padding: 9px 0!important;
    color: #333!important;
    font-weight: bold;
    cursor: text;
  }
</style>
