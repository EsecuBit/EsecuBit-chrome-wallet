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
      <v-breadcrumb :nav-title="navTitle" :is-add-accounts="isAddAccounts"></v-breadcrumb>

      <!-- main page -->
      <div class="layui-container main-content-wrapper">
        <div class="main-tab-content">
          <div class="main-tab-item" :class="{'layui-show': 0 === pageIndex}">
            <Accounts :error-code-msg="errorCodeMsg"/>
          </div>
          <div class="main-tab-item" :class="{'layui-show': 1 === pageIndex}">
            <Send :error-code-msg="errorCodeMsg"/>
          </div>
          <div class="main-tab-item" :class="{'layui-show': 2 === pageIndex}">
            <Accept :error-code-msg="errorCodeMsg"/>
          </div>
          <div class="main-tab-item" :class="{'layui-show': 3 === pageIndex}">
            <Setting/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Login from './components/login/Login'
import Accounts from './components/pages/accounts/Accounts'
import Send from './components/pages/send/Send'
import Setting from './components/pages/setting/Setting'
import Accept from './components/pages/accept/Accept'
import Breadcrumb from './components/breadcrumb/Breadcrumb'
import Header from './components/header/Header'
import Store from './common/js/store'
import qs from 'qs'
import { mapState, mapMutations } from 'vuex'

// Introducing layui plugin variables
const layer = layui.layer

export default {
  name: 'App',
  components: {
    Login,
    Accounts,
    Send,
    Setting,
    Accept,
    'v-breadcrumb': Breadcrumb,
    'v-header': Header
  },
  data () {
    return {
      isShowLogin: true,
      loginStatus: null,
      isAddAccounts: true,
      loginErrorMsg: '',
      getNewAppUrl: 'http://39.106.201.178/app-update-server/getNewApp'
    }
  },
  watch: {
    pageIndex: {
      handler (newValue, oldValue) {
        // Display add accounts button on the home page
        this.isAddAccounts = newValue === 0
      }
    }
  },
  computed: {
    ...mapState({
      'accountList': 'accountList',
      'appVersion': 'appVersion',
      'pageIndex': 'pageIndex',
      'customizeColor': 'customizeColor'
    }),
    navTitle () {
      // breadcrumb: get current page
      let pageTitle = [this.$t('message.app_accounts'), this.$t('message.app_send'), this.$t('message.app_accept'), this.$t('message.app_setting')]
      return pageTitle[this.pageIndex]
    },
    errorCodeMsg () {
      // error code
      return {
        101: this.$t('message.error_noDevice'),
        102: this.$t('message.error_deviceComm'),
        103: this.$t('message.error_deviceConnectFailed'),
        104: this.$t('message.error_deviceDeriveLargerThanN'),
        105: this.$t('message.error_deviceProtocol'),
        106: this.$t('message.error_handShake'),
        107: this.$t('message.error_needPressKey'), // sleep after long time idle
        108: this.$t('message.error_userCancel'),
        109: this.$t('message.error_pinError'),
        110: this.$t('message.error_operationTimeout'),
        111: this.$t('message.error_deviceNotInit'),
        112: this.$t('message.devicePressKeyTooEarly'),
        201: this.$t('message.error_databaseOpenFailed'),
        202: this.$t('message.error_databaseExecFailed'),
        301: this.$t('message.error_lastAccountNoTransaction'),
        302: this.$t('message.error_accountHasTransactions'),
        401: this.$t('message.error_networkUnavailable'),
        402: this.$t('message.error_networkNotInitialized'),
        403: this.$t('message.error_networkProviderError'),
        404: this.$t('message.error_networkTxNotFound'),
        405: this.$t('message.error_networkFeeTooSmall'),
        406: this.$t('message.error_networkTooManyPendingTx'),
        407: this.$t('message.error_networkValueTooSmall'),
        408: this.$t('message.error_networkGasTooLow'),
        409: this.$t('message.error_networkGasPriceTooLow'),
        501: this.$t('message.error_balanceNotEnough'),
        601: this.$t('message.error_invalidAddress'),
        602: this.$t('message.error_noAddressCheckSum'), // for eth
        603: this.$t('message.error_invalidAddressChecksum'),
        605: this.$t('message.error_invalidDataNotHex'),
        604: this.$t('message.error_valueIsDecimal'),
        10000: this.$t('message.error_notImplemented'),
        10001: this.$t('message.error_unknown'),
        10002: this.$t('message.error_coinNotSupported')
      }
    }
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
      setResetStatus: 'ADD_RESET_STATUS',
      setWalletInfo: 'SET_WALLET_INFO',
      setCurrentUnitBtc: 'SET_CURRENT_UNIT_BTC',
      setCurrentUnitEth: 'SET_CURRENT_UNIT_ETH',
      putAccount: 'PUT_ACCOUNT',
      setCurrentExchangeRate: 'SET_CURRENT_EXCHANGE_RATE',
      setNetInfo: 'SET_NET_INFO',
      setPageIndex: 'SET_PAGE_INDEX',
      setIsPreventSwitch: 'SET_IS_PREVENT_SWITCH',
      setHeadColor: 'SET_HEAD_COLOR',
      setCustomizeColor: 'SET_CUSTOMIZE_COLOR'
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
              window.open('https://www.esecubit.com/')
              layer.close(index)
            })
          } else {
            // Suggest to update
            layer.confirm(versionMsg, {
              title: title,
              btn: btn1
            }, (index) => {
              window.open('https://www.esecubit.com/')
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
    displayErrorCode (value) {
      layer.closeAll()
      let errorKey = String(value)
      if (this.errorCodeMsg[errorKey]) {
        layer.msg(this.errorCodeMsg[errorKey], {icon: 2, anim: 6})
      } else {
        layer.msg(errorKey, {icon: 2})
      }
    },
    listenLoginStatus () {
      // Monitor wallet status
      this.esWallet.listenStatus((errorNum, status) => {
        // some error occur
        if (errorNum !== 0) {
          this.loginErrorMsg = this.errorCodeMsg[String(errorNum)]
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
          this.setResetStatus()
          this.setPageIndex(0)
          this.setIsPreventSwitch(false)
          layer.msg(this.$t('message.app_plug_out'))
        }
      })
    },
    onLoginFinish () {
      this.isShowLogin = false
      this.esWallet.getWalletInfo().then(value => {
        this.setWalletInfo(value)
      }).catch(value => {
        console.warn(value)
        this.displayErrorCode(value)
      })
      this.esWallet.getAccounts().then(value => {
        if (value) this.setAccountList(this.orderArr(value))
      }).catch(value => {
        console.warn(value)
        layer.msg(this.$t('message.app_error_get_account'), { icon: 2, anim: 6 })
      })
      this.setNetInfo(this.esWallet.getProviders())
    },
    orderArr (targetArr) {
      // Group accounts by coin type
      const arr = []
      const newAccountList = []
      for (let val of targetArr) {
        if (!arr.includes(val.coinType)) {
          arr.push(val.coinType)
          newAccountList.push({type: val.coinType, list: [val]})
        } else {
          for (let item of newAccountList) {
            if (item.type === val.coinType) {
              item.list.push(val)
              break
            }
          }
        }
      }
      let a = []
      for (let val of newAccountList) {
        a = a.concat(val.list)
      }
      return a
    }
  }
}
</script>

<style lang="less">
  @import './common/css/iconfont.css' ;
  @import './common/css/main.css' ;
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
    margin: 0 20px 20px;
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
  .display-log{
    display: block;
    height: 300px;
    width: 400px;
    position: fixed;
    padding: 20px 5px;
    border: 1px solid #ddd;
    bottom: 0;
    right: 0;
    background-color: #F8F8F8;
    overflow-y: scroll;
    z-index: 10000000;
    white-space:normal;
    word-break: break-all;
    word-wrap:break-word;
    line-height: 20px;
  }
  .display-log p{
    margin-bottom: 10px;
  }
  /*crx log */
  .clear-log{
    background-color: #1E9FFF;
    color: #F8F8F8;
    outline: none;
    padding: 9px 15px;
    position: fixed;
    bottom: 0;
    right: 0;
  }
  .clear-log:hover{
    opacity: .8;
  }
</style>
