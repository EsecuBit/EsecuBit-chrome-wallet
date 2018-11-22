<template>
  <div v-cloak>
    <!-- login page -->
    <div v-show="isShowLogin">
      <Login :status="loginStatus" :login-error-msg="loginErrorMsg"/>
    </div>
    <!-- app page -->
    <div class="app-page-container" :class="[customizeColor]" v-show="!isShowLogin">
      <!-- header -->
      <v-header></v-header>
      <!-- breadcrumb and add accounts btn -->
      <v-breadcrumb></v-breadcrumb>

      <!-- main page -->
      <v-content></v-content>
    </div>
  </div>
</template>

<script>
import Login from './components/login/Login'
import Breadcrumb from './components/breadcrumb/Breadcrumb'
import Header from './components/header/Header'
import Content from './components/content/Content'
import Store from './common/js/store'
import qs from 'qs'
import { mapState, mapMutations } from 'vuex'
import utils from './utils/utils'

// Introducing layui plugin variables
const layer = layui.layer

export default {
  name: 'App',
  components: {
    Login,
    'v-breadcrumb': Breadcrumb,
    'v-header': Header,
    'v-content': Content
  },
  data () {
    return {
      isShowLogin: true,
      loginStatus: null,
      loginErrorMsg: '',
      getNewAppUrl: 'http://39.106.201.178/app-update-server/getNewApp',
      downloadUrl: 'https://www.esecubit.com/'
    }
  },
  computed: {
    ...mapState({
      'accountList': 'accountList',
      'appVersion': 'appVersion',
      'pageIndex': 'pageIndex',
      'customizeColor': 'customizeColor'
    })
  },
  beforeMount () {
    this.init()
  },
  mounted () {
    // Disable enter key
    document.onkeydown = function () {
      if (window.event && window.event.keyCode === 13) {
        window.event.returnValue = false
      }
    }
    this.checkVersionUpdateMsg()
  },
  methods: {
    ...mapMutations({
      setAccountList: 'SET_ACCOUNT',
      setWalletInfo: 'SET_WALLET_INFO',
      setCurrentUnitBtc: 'SET_CURRENT_UNIT_BTC',
      setCurrentUnitEth: 'SET_CURRENT_UNIT_ETH',
      setCurrentExchangeRate: 'SET_CURRENT_EXCHANGE_RATE',
      setNetInfo: 'SET_NET_INFO',
      setPageIndex: 'SET_PAGE_INDEX',
      setIsPreventClick: 'SET_IS_PREVENT_CLICK',
      setHeadColor: 'SET_HEAD_COLOR',
      setCustomizeColor: 'SET_CUSTOMIZE_COLOR',
      setCurrentAccountIndex: 'SET_CURRENT_ACCOUNT_INDEX'
    }),
    checkVersionUpdateMsg () {
      // current chrome version < 45
      let currentVersion = this.getChromeVersion()
      if (currentVersion < 45) {
        layer.msg(this.$t('message.app_version_prompt'), {anim: 6, time: 100000})
        return false
      }
      this.isNeedUpdate()
    },
    isNeedUpdate () {
      let btn1 = [ this.$t('message.app_update_btn_yes'), this.$t('message.app_update_btn_no') ]
      let btn2 = [ this.$t('message.app_update_btn_yes') ]
      let versionMsg = this.$t('message.app_update_msg')
      let versionMsgForce = this.$t('message.app_update_force_msg')
      let title = this.$t('message.app_msg')
      let versionData = {
        platform: 'Chrome',
        versionName: this.appVersion,
        versionCode: 1,
        hardwareVersionCode: 'bd0802030ae420180829'
      }
      this.axios.post(this.getNewAppUrl, qs.stringify(versionData), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {
        console.log(response.data)
        if (response.data.errorCode === 0) {
          // force to update
          if (response.data.data.isForceUpdate) {
            layer.confirm(versionMsgForce, {
              title: title,
              btn: btn2
            }, (index) => {
              window.open(this.downloadUrl)
              layer.close(index)
            })
          } else {
            // Suggest to update
            layer.confirm(versionMsg, {
              title: title,
              btn: btn1
            }, (index) => {
              window.open(this.downloadUrl)
              layer.close(index)
            }, () => {
              // user update
              this.listenLoginStatus()
            })
          }
        } else {
          // enter system
          this.listenLoginStatus()
        }
      }).catch((value) => {
        // enter system
        this.listenLoginStatus()
      })
    },
    getChromeVersion () {
      let arr = navigator.userAgent.split(' ')
      let chromeVersion = ''
      for (let value of arr) {
        if (/chrome/i.test(value)) chromeVersion = value
      }
      return Number(chromeVersion.split('/')[1].split('.')[0])
    },
    async init () {
      if (localStorage) {
        let getBtcUnit = Store.fetch('bitUnit') ? Store.fetch('bitUnit') : this.D.unit.btc.BTC
        this.setCurrentUnitBtc(getBtcUnit)
        let getEthUnit = Store.fetch('ethUnit') ? Store.fetch('ethUnit') : this.D.unit.eth.ETH
        this.setCurrentUnitEth(getEthUnit)
        let getCurrentExchangeRate = Store.fetch('exchange') ? Store.fetch('exchange') : this.D.unit.legal.USD
        this.setCurrentExchangeRate(getCurrentExchangeRate)
        let currentSkin = Store.fetch('skin') ? Store.fetch('skin') : 'gray'
        let getHeadColor = currentSkin + '-skin'
        this.setHeadColor(getHeadColor)
        let getCustomizeColor = currentSkin + '-customize'
        this.setCustomizeColor(getCustomizeColor)
      } else {
        const bitUnit = await Store.setPromise('bitUnit')
        const ethUnit = await Store.setPromise('ethUnit')
        const exchange = await Store.setPromise('exchange')
        const skin = await Store.setPromise('skin')
        let getBtcUnit = bitUnit['bitUnit'] ? bitUnit['bitUnit'] : this.D.unit.btc.BTC
        this.setCurrentUnitBtc(getBtcUnit)
        let getEthUnit = ethUnit['ethUnit'] ? ethUnit['ethUnit'] : this.D.unit.eth.ETH
        this.setCurrentUnitEth(getEthUnit)
        let getCurrentExchangeRate = exchange['exchange'] ? exchange['exchange'] : this.D.unit.legal.USD
        this.setCurrentExchangeRate(getCurrentExchangeRate)
        let currentSkin = skin['skin'] ? skin['skin'] : 'gray'
        let getHeadColor = currentSkin + '-skin'
        this.setHeadColor(getHeadColor)
        let getCustomizeColor = currentSkin + '-customize'
        this.setCustomizeColor(getCustomizeColor)
      }
    },
    listenLoginStatus () {
      // Monitor wallet status
      this.esWallet.listenStatus((errorNum, status) => {
        // some error occur
        if (errorNum !== 0) {
          let errorCodeMsg = utils.getErrorCodeMsg(this)
          this.loginErrorMsg = errorCodeMsg[String(errorNum)]
          this.loginStatus = 404
          return false
        }
        if (status === this.D.status.plugIn) this.loginStatus = 1
        if (status === this.D.status.initializing) this.loginStatus = 2
        if (status === this.D.status.syncing) this.loginStatus = 3
        if (status === this.D.status.syncFinish) {
          this.onLoginFinish()
        }
        if (status === this.D.status.plugOut) {
          this.loginStatus = 99
          this.isShowLogin = true
          this.setCurrentAccountIndex(0)
          this.setPageIndex(0)
          this.setIsPreventClick(false)
          layer.msg(this.$t('message.app_plug_out'))
        }
      })
    },
    onLoginFinish () {
      this.isShowLogin = false
      this.esWallet.getWalletInfo().then(value => {
        this.setWalletInfo(value)
      }).catch(value => {
        utils.displayErrorCode(this, value)
      })
      this.esWallet.getAccounts().then(value => {
        if (value) this.setAccountList(value)
      }).catch(value => {
        console.warn(value)
        layer.msg(this.$t('message.app_error_get_account'), { icon: 2, anim: 6 })
      })
      this.setNetInfo(this.esWallet.getProviders())
    }
  }
}
</script>

<style lang="less">
  @import './common/css/iconfont.css' ;
  @import './common/css/layer.css';
  @import './common/css/skin';
  div{
    font: 14px Helvetica Neue,Helvetica,PingFang SC,\5FAE\8F6F\96C5\9ED1,Tahoma,Arial,sans-serif;
  }
  .app-page-container{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    .main-content-wrapper{
      display: flex;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      flex-direction: row;
      -webkit-box-flex: 1;
      flex: 1;
      flex-basis: auto;
      .main-tab-content{
        width: 100%;
        .main-tab-item{
          height: 100%;
        }
      }
    }
  }
  .height-scroll{
    height: 100%;
    overflow-y: scroll;
  }
  .description {
    text-indent: 2em;
    font-size:16px;
    height: 36px;
    line-height: 36px;
    color: #333;
    background-color: #F8F8F8;
    border-radius: 6px;
    margin: 20px;
  }
  .msg-wrapper{
    display: inline-block;
    text-indent: 2em;
    margin: 20px 10px 0;
    background-color: #f8f8f8;
    height: 150px;
    border-radius: 8px;
    border: 1px solid #f0f0f0;
    box-shadow: 1px 4px 8px 0 rgba(0,0,0,0.1);
    color: #888;
  }
  .msg-content .error-msg{
    padding: 12px;
    font-size: 26px;
    font-weight: 600;
    word-wrap: break-word;
    word-spacing: 0.1em;
  }
</style>
