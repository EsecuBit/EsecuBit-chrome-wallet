<template>
  <div>
    <!-- prompt msg -->
    <blockquote class="site-text layui-elem-quote" style="margin-top: 20px">
      <i class="layui-icon" style="vertical-align: middle;font-size: 20px">&#xe645;</i>   {{$t('message.accept_prompt_msg')}}
    </blockquote>

    <!-- coin type-->
    <h1 class="table-title" style="margin-bottom: 6px">{{receiveCoinTypeMsg}}</h1>

    <!-- Receive form -->
    <div class="site-text site-block">
      <form class="layui-form"  lay-filter="form2">
        <!-- current account name -->
        <div class="layui-form-item" style="margin-bottom: 0">
          <label class="layui-form-label account-label" >{{$t('message.accept_current_account')}}</label>
          <div class="layui-input-block account-info">
            <div class="account-msg" v-if="currentAccount">{{currentAccount.label}}</div>
          </div>
        </div>

        <!-- qrcode area -->
        <div class="layui-form-item">
          <div class="qrcode" v-show="!showAddress" style="line-height: 210px;text-align: center;border: 1px solid #eee">
            <i class="icon iconfont icon-erweima" style="font-size: 50px"></i>
          </div>
          <div id="code" class="qrcode" v-show="showAddress"></div>
        </div>

        <!-- set address on device-->
        <div class="layui-form-item" style="margin-bottom: 5px" v-show="isShowSetAddress">
          <div class="layui-input-block account-info">
            <input type="checkbox" name="setAddressStatus" lay-filter="setAddressStatus" :title="setAddressMsg" lay-skin="primary" :checked="isSetAddress">
          </div>
        </div>

        <!-- generate qrcode btn -->
        <div class="layui-form-item" v-show="!showAddress" >
          <div class="layui-input-block account-info">
            <a href="#" class="layui-btn layui-btn-radius address-btn" @click="generateAddress">{{$t('message.accept_generate_address')}}
              <i class="layui-icon">&#xe623;</i>
            </a>
          </div>
        </div>

        <!-- address text -->
        <div class="layui-form-item" v-show="showAddress" style="margin-bottom: 0">
          <label class="layui-form-label account-label" >{{$t('message.accept_qrcode_msg')}}</label>
          <div class="layui-input-block account-info">
            <div class="address-description" id="address-description">{{qrAddress}}</div>
            <a :title="$t('message.icon_title_copy')" href="#" class="copy-address" data-clipboard-target="#address-description" >
              <i class="icon iconfont icon-copy "></i>
            </a>
          </div>
        </div>
        <!-- tips -->
        <div class="layui-form-item">
          <div class="layui-form-label tips">{{$t('message.accept_tips')}}</div>
          <div class="layui-input-block address-container" v-show="isInitDisplay">
            {{$t('message.accept_prompt_msg1')}}
          </div>
          <div class="layui-input-block address-container" v-show="!isInitDisplay">
            {{$t('message.accept_prompt_msg2')}}
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Store from '../../../common/js/store'
import Clipboard from 'clipboard'
import { mapState, mapGetters, mapMutations } from 'vuex'
import utils from '../../../utils/utils'

const form = layui.form
const layer = layui.layer

export default {
  name: 'accept',
  data () {
    return {
      isFirst: true,
      qrAddress: null,
      accountQrcode: null,
      showAddress: false,
      isInitDisplay: true,
      isSetAddress: null
    }
  },
  computed: {
    ...mapState({
      'currentAccountIndex': 'currentAccountIndex',
      'switchLangTimes': 'switchLangTimes',
      'isPreventClick': 'isPreventClick'
    }),
    ...mapGetters({
      'currentAccountType': 'currentAccountType',
      'currentAccount': 'currentAccount'
    }),
    receiveCoinTypeMsg  () {
      let coinTypeName = this.D.isBtc(this.currentAccountType) ? 'Bitcoin' : 'Ether'
      return this.$t('message.accept_accept_msg') + ' ' + coinTypeName
    },
    setAddressMsg () {
      return this.$t('message.accept_set_address')
    },
    isShowSetAddress () {
      return this.D.isBtc(this.currentAccountType)
    }
  },
  watch: {
    currentAccountIndex: {
      handler (newValue, oldValue) {
        this.initDisplay()
      }
    },
    setAddressMsg: {
      handler (newValue, oldValue) {
        setTimeout(() => {
          form.render('checkbox', 'form2')
        }, 500)
      }
    }
  },
  mounted () {
    this.init()
    form.on('checkbox(setAddressStatus)', (data) => {
      this.isSetAddress = data.elem.checked
      Store.saveChromeStore('isSetAddress', data.elem.checked)
    })
    let clipboard = new Clipboard('.copy-address')
    clipboard.on('success', () => {
      layer.msg(this.$t('message.accept_copy_success'), { icon: 1 })
    })
  },
  methods: {
    ...mapMutations({
      setIsPreventClick: 'SET_IS_PREVENT_CLICK'
    }),
    async init () {
      if (localStorage) {
        this.isSetAddress = typeof Store.fetch('isSetAddress') === 'boolean' ? Store.fetch('isSetAddress') : true
      } else {
        const isSetAddress = await Store.setPromise('isSetAddress')
        this.isSetAddress = typeof isSetAddress['isSetAddress'] === 'boolean' ? isSetAddress['isSetAddress'] : true
      }
      this.$nextTick(() => {
        form.render('checkbox', 'form2')
      })
    },
    generateAddress () {
      // Prevent duplicate generation of verification codes
      if (this.isPreventClick) return
      this.setIsPreventClick(true)
      let layerIndex = (this.isSetAddress && this.D.isBtc(this.currentAccountType)) ? layer.msg(this.$t('message.accept_confirm'), { time: 1000000 }) : layer.msg(this.$t('message.accept_loading'), { time: 1000000 })
      let param = this.D.isBtc(this.currentAccountType) ? this.isSetAddress : false
      if (this.isFirst) {
        setTimeout(() => {
          this.currentAccount.getAddress(param).then(value => {
            layer.close(layerIndex)
            this.generateQRCode(value.qrAddress)
            this.qrAddress = value.address
            this.switchDisplay()
            this.isFirst = false
            this.setIsPreventClick(false)
          }).catch(value => {
            this.setIsPreventClick(false)
            layer.close(layerIndex)
            utils.displayErrorCode(this, value)
          })
        }, 200)
      } else {
        setTimeout(() => {
          this.currentAccount.getAddress(param).then(value => {
            layer.close(layerIndex)
            this.changeQRCode(value.qrAddress)
            this.qrAddress = value.address
            this.switchDisplay()
            this.setIsPreventClick(false)
          }).catch(value => {
            this.setIsPreventClick(false)
            layer.close(layerIndex)
            utils.displayErrorCode(this, value)
          })
        }, 200)
      }
    },
    initDisplay () {
      this.showAddress = false
      this.isInitDisplay = true
    },
    switchDisplay () {
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
    overflow-x: hidden;
  }
  /*Custom qrcode*/
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
    width: 210px;
  }
  .address-description{
    display: inline-block;
    padding: 9px 0!important;
    color: #333!important;
    font-weight: bold;
    cursor: text;
    margin-right: 6px;
  }
  .copy-address .iconfont{
    color: #333;
    font-size: 18px;
    vertical-align: middle;
  }
</style>
