<template>
  <div id="app" style="height: 100%">
    <div v-cloak style="height: 100%">
      <div v-show="isShowLogin" style="height: 100%">
        <Login :status="loginStatus" :login-error-msg="loginErrorMsg"/>
      </div>
      <div v-show="!isShowLogin">
        <div class="main-admin" :class="[customizeColor]">
          <div class="fly-header bg-black" v-bind:class="[heardColor]">
            <div class="layui-container">
              <a class="logo" href="#"> <img src="./common/imgs/logo.png" alt="Wallet Bitcion"></a>
              <!-- 头部区域（可配合layui已有的水平导航） -->
              <ul class="layui-nav fly-nav layui-hide-xs menu-switch">
                <li class="layui-nav-item " :class="{'layui-this': index === pageIndex}" v-for="(item, index) in pageList" @click="switchPage(index)">
                  <a href="#"><i class="icon iconfont" :class="item.icon"></i>{{item.label}}</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="fly-panel fly-column">
            <div class="layui-container">
              <p style="height: 40px;line-height: 40px">
                <span class="layui-breadcrumb" style="visibility: visible;">
                  <a href="#">{{$t('message.app_home')}}</a><span lay-separator="">&gt;</span>
                  <a href="#" id="message" class="message" v-text="navTitle"></a>
                  <div class="add-btn-wrapper clearfix" v-show="isAddAccounts">
                    <a href="#" class="add-btn" @click="addAccountContent"><i class="layui-icon ">&#xe770;</i>{{$t('message.app_add_accounts')}}</a>
                  </div>
                 </span>
              </p>
            </div>
          </div>
          <div class="layui-container page-content ">
            <div class="main-tab-content">
              <div class="main-tab-item" :class="{'layui-show': 0 === pageIndex}">
                <Accounts @switchTargetPage="switchTargetPage" :account-info ="accounts" :reset-status="resetStatus" :add-account-times="addAccountTimes" :current-unit="currentUnit" :current-unit-eth="currentUnitEth" :current-exchange-rate="currentExchangeRate" :error-code-msg="errorCodeMsg"/>
              </div>
              <div class="main-tab-item" :class="{'layui-show': 1 === pageIndex}">
                <Send @switchTargetPage="switchTargetPage" @preventPageSwitch="preventPageSwitch" @allowPageSwitch="allowPageSwitch" :account-info ="accounts"  :page-index="pageIndex"
                      :current-unit="currentUnit" :current-unit-eth="currentUnitEth" :current-exchange-rate="currentExchangeRate" :reset-status="resetStatus" :error-code-msg="errorCodeMsg"/>
              </div>
              <div class="main-tab-item" :class="{'layui-show': 2 === pageIndex}">
                <Accept :account-info ="accounts" :reset-status="resetStatus" :error-code-msg="errorCodeMsg"/>
              </div>
              <div class="main-tab-item" :class="{'layui-show': 3 === pageIndex}">
                <Setting @settingColor = "settingColor" @setExchangeRate="setExchangeRate"
                         @setBitUnit="setBitUnit"  @setEthUnit="setEthUnit" :account-info ="accounts" :wallet-info="walletInfo" :net-info='netInfo'/>
              </div>
            </div>
          </div>
        </div>
        <div class="add-accounts-content" id="account-content">
          <div class="content-wrapper">
            <div class="form-content" v-show="isHasAccount">
              <p class="description">
                <i class="layui-icon" style="color: #dd4b39;">&#xe702;</i>&nbsp;
                <span>{{$t('message.app_select_prompt')}}</span>
              </p>
              <form class="layui-form" lay-filter="form1">
                <div class="layui-form-item" >
                  <label class="layui-form-label" style="width: 130px">{{$t('message.app_accounts_type')}}</label>
                  <div class="layui-input-inline" style="width: 350px">
                    <select lay-verify="required" lay-filter="addAccount" >
                      <option v-for="item in accountType" :value="item">{{item}}</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div class="msg-wrapper" v-show="!isHasAccount">
              <div class="msg-content">
                <p class="error-msg">
                  <i class="layui-icon" style="color: #dd4b39;font-size: 26px">&#xe702;</i>&nbsp;
                  <span>
                    {{$t('message.app_error_prompt_msg')}}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="add-accounts-content" id="loading">
          <div class="loading-center">
            <div class="loading-wrapper">
              <i class="layui-icon layui-anim layui-anim-rotate layui-anim-loop" style="font-size: 30px;"> </i>
              <span>{{$t('message.app_init_new_account')}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Login from './components/Login'
import Accounts from './components/index/Accounts'
import Send from './components/index/Send'
import Setting from './components/index/Setting'
import Accept from './components/index/Accept'
import Store from './common/js/store'

// eslint-disable-next-line
const element = layui.element
const $ = layui.jquery
const layer = layui.layer
const form = layui.form

export default {
  name: 'App',
  data () {
    return {
      isShowLogin: true,
      loginStatus: null,
      walletInfo: null,
      netInfo: null,
      accounts: null,
      heardColor: '',
      customizeColor: '',
      isAddAccounts: true,
      selected: '',
      isHasAccount: true,
      accountType: [],
      currentUnit: '',
      currentUnitEth: '',
      currentExchangeRate: '',
      resetStatus: 0,
      addAccountTimes: 0,
      pageIndex: 0,
      isPreventSwitch: false,
      loginErrorMsg: ''
    }
  },
  watch: {
    accountType: {
      handler (newValue, oldValue) {
        this.selected = newValue[0]
        this.$nextTick(() => {
          form.render('select', 'form1')
          form.on('select(addAccount)', data => {
            this.selected = data.value
          })
        })
      }
    },
    pageIndex: {
      handler (newValue, oldValue) {
        this.isAddAccounts = newValue === 0
      }
    }
  },
  computed: {
    pageList () {
      return [
        {label: this.$t('message.app_accounts'), icon: 'icon-zhanghu1'},
        {label: this.$t('message.app_send'), icon: 'icon-msnui-cloud-upload'},
        {label: this.$t('message.app_accept'), icon: 'icon-msnui-cloud-download'},
        {label: this.$t('message.app_setting'), icon: 'icon-shezhi2'}
      ]
    },
    navTitle () {
      let pageTitle = [this.$t('message.app_accounts'), this.$t('message.app_send'), this.$t('message.app_accept'), this.$t('message.app_setting')]
      return pageTitle[this.pageIndex]
    },
    errorCodeMsg () {
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
    document.onkeydown = function () {
      if (window.event && window.event.keyCode === 13) {
        window.event.returnValue = false
      }
    }
    form.render('select', 'form1')
    this.isLowVersion()

    // offline mode, currently not used in chrome
    // this.esWallet.enterOfflineMode().then(() => {
    //   this.onLoginFinish()
    // }).catch(e => {
    //   if (e === this.D.error.offlineModeNotAllowed) {
    //     console.warn('offlineModeNotAllowed')
    //     return
    //   }
    //   if (e === this.D.error.offlineModeUnnecessary) {
    //     console.warn('offlineModeUnnecessary')
    //     return
    //   }
    //   if (e === this.D.error.networkProviderError) {
    //     console.warn('networkProviderError')
    //     return
    //   }
    //   console.warn('other error, stop', e)
    // })
  },
  methods: {
    switchPage (index) {
      if (!this.isPreventSwitch) {
        this.pageIndex = index
        this.isAddAccounts = index === 0
      }
    },
    preventPageSwitch () {
      this.isPreventSwitch = true
    },
    allowPageSwitch () {
      this.isPreventSwitch = false
    },
    isLowVersion () {
      let currentVersion = this.getChromeVersion()
      if (currentVersion < 45) {
        layer.msg(this.$t('message.app_version_prompt'), {anim: 6, time: 100000})
        return false
      }
      this.listenLoginStatus()
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
        this.currentUnit = Store.fetch('bitUnit') ? Store.fetch('bitUnit') : this.D.unit.btc.BTC
        this.currentUnitEth = Store.fetch('ethUnit') ? Store.fetch('ethUnit') : this.D.unit.eth.ETH
        this.currentExchangeRate = Store.fetch('exchange') ? Store.fetch('exchange') : this.D.unit.legal.USD
        let currentSkin = Store.fetch('skin') ? Store.fetch('skin') : 'gray'
        this.heardColor = currentSkin + '-skin'
        this.customizeColor = currentSkin + '-customize'
      } else {
        const bitUnit = await Store.setPromise('bitUnit')
        const ethUnit = await Store.setPromise('ethUnit')
        const exchange = await Store.setPromise('exchange')
        const skin = await Store.setPromise('skin')
        this.currentUnit = bitUnit['bitUnit'] ? bitUnit['bitUnit'] : this.D.unit.btc.BTC
        this.currentUnitEth = ethUnit['ethUnit'] ? ethUnit['ethUnit'] : this.D.unit.eth.ETH
        this.currentExchangeRate = exchange['exchange'] ? exchange['exchange'] : this.D.unit.legal.USD
        let currentSkin = skin['skin'] ? skin['skin'] : 'gray'
        this.heardColor = currentSkin + '-skin'
        this.customizeColor = currentSkin + '-customize'
      }
    },
    switchTargetPage (...data) {
      this.pageIndex = data[0]
    },
    setExchangeRate (...data) {
      this.currentExchangeRate = data[0]
    },
    settingColor (...data) {
      this.heardColor = data[0] + '-skin'
      this.customizeColor = data[0] + '-customize'
    },
    setBitUnit (...data) {
      this.currentUnit = data[0]
    },
    setEthUnit (...data) {
      this.currentUnitEth = data[0]
    },
    changeLang () {
      // console.log(this.$t('message.hello'))
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
      this.esWallet.listenStatus((errorNum, status) => {
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
          this.resetStatus = this.resetStatus + 1
          this.pageIndex = 0
          this.isPreventSwitch = false
          layer.msg(this.$t('message.app_plug_out'))
        }
      })
    },
    onLoginFinish () {
      console.log('同步完成')
      this.isShowLogin = false
      this.esWallet.getWalletInfo().then(value => {
        this.walletInfo = value
      }).catch(value => {
        console.warn(value)
        this.displayErrorCode(value)
      })
      this.esWallet.getAccounts().then(value => {
        console.log(value, '获取的账户')
        if (value) this.accounts = this.orderArr(value)
      }).catch(value => {
        console.warn(value)
        layer.msg(this.$t('message.app_error_get_account'), { icon: 2, anim: 6 })
      })
      this.netInfo = this.esWallet.getProviders()
      console.log(this.esWallet.getProviders(), 'net')
    },
    addAccountContent () {
      let btnDisplay = [this.$t('message.app_submit_btn'), this.$t('message.app_cancel_btn')]
      // 获取可用的币类型
      this.esWallet.availableNewAccountCoinTypes().then(value => {
        if (Array.isArray(value) && value.length > 0) {
          this.accountType = value
          this.isHasAccount = true
        } else {
          this.isHasAccount = false
          btnDisplay = null
        }
        const that = this
        layer.open({
          type: 1,
          area: ['567px', '315px'],
          shadeClose: false,
          title: that.$t('message.app_add_accounts_title'),
          btn: btnDisplay,
          content: $('#account-content'),
          yes (index) {
            let loadingIndex = layer.open({
              type: 1,
              anim: 2,
              closeBtn: 0,
              title: false,
              maxmin: false,
              area: ['315px', '100px'],
              content: $('#loading')
            })
            that.esWallet.newAccount(that.selected).then(value => {
              if (that.D.isBtc(that.selected)) that.addAccountTimes = that.addAccountTimes + 1
              layer.close(loadingIndex)
              layer.close(index)
              layer.msg(that.$t('message.app_successful'), { icon: 1 })
              if (Array.isArray(that.accounts) && that.accounts.length > 0) {
                that.accounts.push(value)
                that.accounts = that.orderArr(that.accounts)
              }
            }).catch(value => {
              layer.closeAll()
              console.warn(value)
              layer.msg(that.$t('message.app_error_add_account'), { icon: 2, anim: 6 })
            })
          }
        })
      }).catch(value => {
        console.warn(value)
        this.displayErrorCode(value)
      })
    },
    orderArr (targetArr) {
      const arr = []
      const accountList = []
      for (let val of targetArr) {
        if (!arr.includes(val.coinType)) {
          arr.push(val.coinType)
          accountList.push({type: val.coinType, list: [val]})
        } else {
          for (let item of accountList) {
            if (item.type === val.coinType) {
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
    }
  },
  components: {
    Login,
    Accounts,
    Send,
    Setting,
    Accept
  }
}
</script>

<style>
@import './common/css/iconfont.css' ;
@import './common/css/main.css' ;
</style>

<style lang="less">
  @blue: #2d3451;
  @darkRed1: #6d3028;
  @darkRed2: #B03A5B;
  @darkRed3: #ba6a81;
  @black: #263238;
  @gray: #424650;
  @orange1: #F47023;
  @orange2: #ef7631;
  @orange3: #f99b64;
  @darkGreen: #2e5c62;
  .underline(@color){
    content: '';
    background-color: @color;
    position: absolute;
    z-index: 1;
  }
  .header-skin(@color){
    background:@color;
    color: #fff;
    border-bottom: 1px solid @color;
    border-right: 1px solid @color;
  }
  div{
    font: 14px Helvetica Neue,Helvetica,PingFang SC,\5FAE\8F6F\96C5\9ED1,Tahoma,Arial,sans-serif;
  }
  .bg-black{
    background-color:@black;
  }
  .fly-column{
    background-color: #f5f5f5;
  }
  .logo {
    position: absolute;
    left: 0;
    top: 6px;
    width: 126px;
    height: 46px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .blue-skin {
    .header-skin(@blue);
  }
  .green-skin {
    .header-skin(@darkGreen);
  }
  .black-skin {
    .header-skin(@black);
  }
  .gray-skin {
    .header-skin(@gray);
  }
  /*自定义皮肤样式*/
  .gray-customize {
    .layui-form-radioed>i{
      color: @orange1;
      &:hover{
        color: @orange1;
      }
    }
    .layui-form-select dl dd.layui-this{
      background-color: @orange3;
    }
    .menu-switch li.layui-this a:after{
      .underline(@orange1);
      height: 3px;
      width: calc(100% - 30px);
      bottom: 0;
      left: 5px;
      right: 0;
    }
    .menu-switch li a{
      &:after{
        .underline(@orange1);
        height: 3px;
        width: 0;
        margin: 0 auto;
        bottom: 0;
        left: 5px;
        right: 0;
        transition: width .2s ease,bottom .2s ease;
      }
      &:hover:after{
        width: calc(100% - 30px);
      }
    }
    .site-tree .layui-tree li h2{
      border-left-color: @orange1;
    }
    .site-tree .layui-tree .layui-this .layui-icon{
      color: @orange1;
    }
    .site-tree .layui-tree .layui-this a {
      color: @orange1;
    }
    .layui-bg-green {
      background-color: @orange1!important;
    }
    .layui-elem-quote{
      border-left: 5px solid @orange1;
    }
    .layui-btn {
      background-color: @orange2;
    }
    .layui-btn-primary:hover {
      border-color: @orange1;
      color: #333;
    }
    .layui-laypage .layui-laypage-curr .layui-laypage-em {
      background-color: @orange2;
    }
    .layui-laypage a:hover {
      color: @orange2;
    }
    .site-tree .layui-tree a {
      padding-bottom: 4px;
      position: relative;
      height: 30px;
      &:hover:after{
        width: calc(100% - 10px);
        color: @orange1;
      }
      &:after{
        .underline(@orange1);
        height: 2px;
        width: 0;
        margin: 0 auto;
        bottom: 0;
        left: 0;
        right: 0;
        transition: width .2s ease,bottom .2s ease;
      }
      &:hover{
        color: @orange1;
      }
    }
    a:hover li i {
      color: @orange1!important;
    }
  }
  .blue-customize {
    .layui-form-radio>i:hover, .layui-form-radioed>i {
      color: @darkRed2;
    }
    .layui-form-select dl dd.layui-this{
      background-color: #cb617f;
    }
    .site-tree .layui-tree li h2 {
      border-left-color: @darkRed2;
    }
    .site-tree .layui-tree .layui-this .layui-icon {
      color: @darkRed2;
    }
    .site-tree .layui-tree .layui-this a {
      color: @darkRed2;
    }
    .layui-bg-green {
      background-color: @darkRed3!important;
    }
    .layui-elem-quote{
      border-left: 5px solid @darkRed3;
    }
    .layui-btn {
      background-color: @darkRed3;
    }
    .layui-btn-primary:hover {
      border-color: @darkRed3;
      color: #333;
    }
    .layui-laypage .layui-laypage-curr .layui-laypage-em {
      background-color: @darkRed3;
    }
    .layui-laypage a:hover {
      color: @darkRed3;
    }
  }
  .layui-breadcrumb a:hover {
    color: #999!important
  }
  .add-btn-wrapper{
    display: inline-block;
    height: 40px;
    line-height:40px;
    font-size: 12px;
    float: right;
    margin-right: 10px;
    font-weight: 600;
  }
  .clearfix:before{
    clear: both;
    content: '';
    height: 0;
    line-height: 0;
  }
  .add-btn-wrapper a:hover {
    color: #009688!important
  }
  .add-accounts-content {
    display: none;
  }
  .content-wrapper{
    margin: 30px 12px 10px
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
    margin: 0 10px 0;
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
  .loading-center {
    padding: 32px 0;
  }
  .loading-wrapper{
    margin: auto 12px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    font-size: 14px;
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
  /*crx日志*/
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
