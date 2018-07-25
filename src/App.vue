<template>
  <div id="app" style="height: 100%">
    <div v-cloak style="height: 100%">
      <div v-show="isLogin" style="height: 100%">
        <Login :status="loginStatus" />
      </div>
      <div v-show="!isLogin">
        <div class="main-admin" >
          <div class="fly-header bg-black" v-bind:class="[heardColor]">
            <div class="layui-container">
              <a class="logo" href="#"> <img src="./common/imgs/logo.png" alt="Wallet Bitcion"></a>
              <!-- 头部区域（可配合layui已有的水平导航） -->
              <ul class="layui-nav fly-nav layui-hide-xs menu-switch">
                <li class="layui-nav-item layui-this"><a href="#" id="set_jqgrid_width" @click="showAddAccount"><i class="icon iconfont icon-zhanghu1"></i>{{$t('message.app_accounts')}}</a></li>
                <li class="layui-nav-item"><a href="#" @click="hiddenAddAccount"><i class="icon iconfont icon-msnui-cloud-upload bigger"></i>{{$t('message.app_send')}}</a></li>
                <li class="layui-nav-item"><a href="#" @click="hiddenAddAccount"><i class="icon iconfont icon-msnui-cloud-download bigger"></i>{{$t('message.app_accept')}}</a></li>
                <li class="layui-nav-item"><a href="#" @click="hiddenAddAccount"><i class="icon iconfont icon-shezhi2"></i>{{$t('message.app_setting')}}</a></li>
              </ul>
            </div>
          </div>
          <div class="fly-panel fly-column">
            <div class="layui-container">
              <p style="height: 40px;line-height: 40px">
                <span class="layui-breadcrumb" style="visibility: visible;">
                  <a href="#">{{$t('message.app_home')}}</a><span lay-separator="">&gt;</span>
                  <a href="#" id="message" class="message">{{$t('message.app_accounts')}}</a>
                  <div class="add-btn-wrapper clearfix" v-show="isAddAccounts">
                    <a href="#" class="add-btn" @click="addAccountContent"><i class="layui-icon ">&#xe770;</i>{{$t('message.app_add_accounts')}}</a>
                  </div>
                 </span>
              </p>
            </div>
          </div>
          <div class="layui-container page-content ">
            <div class="main-tab-content">
              <div class="main-tab-item layui-show">
                <Accounts :account-info ="accounts" :current-unit="currentUnit" :current-unit-eth="currentUnitEth" :current-exchange-rate="currentExchangeRate" :error-code-msg="errorCodeMsg"/>
              </div>
              <div class="main-tab-item">
                <Send :account-info ="accounts" :current-unit="currentUnit" :current-unit-eth="currentUnitEth" :current-exchange-rate="currentExchangeRate" :reset-status="resetStatus" :error-code-msg="errorCodeMsg"/>
              </div>
              <div class="main-tab-item">
                <Accept :account-info ="accounts" :reset-status="resetStatus" :error-code-msg="errorCodeMsg"/>
              </div>
              <div class="main-tab-item">
                <Setting @switchSetting = "switchSetting" @settingColor = "settingColor" @setExchangeRate="setExchangeRate"
                         @setBitUnit="setBitUnit"  @setEthUnit="setEthUnit" :account-info ="accounts" :wallet-info="WalletInfo"/>
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
      isLogin: true,
      loginStatus: null,
      WalletInfo: null,
      accounts: null,
      heardColor: '',
      isAddAccounts: true,
      selected: '',
      isHasAccount: true,
      accountType: [],
      currentUnit: '',
      currentUnitEth: '',
      currentExchangeRate: '',
      resetStatus: false,
      errorCodeMsg: {
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
        201: this.$t('message.error_databaseOpenFailed'),
        202: this.$t('message.error_databaseExecFailed'),
        301: this.$t('message.error_lastAccountNoTransaction'),
        302: this.$t('message.error_accountHasTransactions'),
        401: this.$t('message.error_networkUnavailable'),
        402: this.$t('message.error_networkNotInitialized'),
        403: this.$t('message.error_networkProviderError'),
        404: this.$t('message.error_networkTxNotFound'),
        405: this.$t('message.error_networkFeeTooSmall'),
        501: this.$t('message.error_balanceNotEnough'),
        601: this.$t('message.error_invalidAddress'),
        602: this.$t('message.error_noAddressCheckSum'), // for eth
        603: this.$t('message.error_invalidAddressChecksum'),
        604: this.$t('message.error_valueIsDecimal'),
        10000: this.$t('message.error_notImplemented'),
        10001: this.$t('message.error_unknown'),
        10002: this.$t('message.error_coinNotSupported')
      }
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
    }
  },
  beforeMount () {
    this.init()
  },
  mounted () {
    // 监听选择事件
    // document.oncontextmenu = function () {
    //   event.returnValue = false
    // }
    form.render('select', 'form1')
    this.listenLoginStatus()
    // 菜单点击事件
    $('.menu-switch li a').click(function () {
      if ($(this).parent('li').hasClass('layui-this')) return false
      let tabIndex = $(this).parent().index()
      $('#message').text($(this).text())
      $('.menu-switch li.layui-this').removeClass('layui-this')
      $(this).parent('li').addClass('layui-this')
      $('.main-tab-content .main-tab-item').removeClass('layui-show').eq(tabIndex).addClass('layui-show')
    })
  },
  methods: {
    async init () {
      if (localStorage) {
        this.currentUnit = Store.fetch('bitUnit') ? Store.fetch('bitUnit') : this.D.unit.btc.mBTC
        this.currentUnitEth = Store.fetch('ethUnit') ? Store.fetch('ethUnit') : this.D.unit.eth.GWei
        this.currentExchangeRate = Store.fetch('exchange') ? Store.fetch('exchange') : this.D.unit.legal.USD
      } else {
        const bitUnit = await Store.setPromise('bitUnit')
        const ethUnit = await Store.setPromise('ethUnit')
        const exchange = await Store.setPromise('exchange')
        this.currentUnit = bitUnit['bitUnit'] ? bitUnit['bitUnit'] : this.D.unit.btc.mBTC
        this.currentUnitEth = ethUnit['ethUnit'] ? ethUnit['ethUnit'] : this.D.unit.eth.GWei
        this.currentExchangeRate = exchange['exchange'] ? exchange['exchange'] : this.D.unit.legal.USD
      }
    },
    setExchangeRate (...data) {
      this.currentExchangeRate = data[0]
    },
    switchSetting (...data) {
      $('#message').text(data[0])
    },
    settingColor (...data) {
      this.heardColor = data[0] + '-skin'
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
        if (this.errorCodeMsg[String(errorNum)]) {
          this.displayErrorCode(errorNum)
        }
        if (status === this.D.status.plugIn) this.loginStatus = 1
        if (status === this.D.status.initializing) this.loginStatus = 2
        if (status === this.D.status.syncing) this.loginStatus = 3
        if (status === this.D.status.syncFinish) {
          console.log('正在同步')
          this.isLogin = !this.isLogin
          this.esWallet.getWalletInfo().then(value => {
            this.WalletInfo = value
            console.log(value, 'WalletInfo')
          }).catch(value => {
            console.warn(value)
            this.displayErrorCode(value)
          })
          this.esWallet.getAccounts().then(value => {
            if (value) this.accounts = this.orderArr(value)
            console.log(value)
          }).catch(value => {
            console.warn(value)
            layer.msg(this.$t('message.app_error_get_account'), { icon: 2, anim: 6 })
          })
        }
        if (status === this.D.status.plugOut) {
          this.loginStatus = 99
          this.isLogin = true
          this.resetStatus = true
          layer.msg(this.$t('message.app_plug_out'))
        }
      })
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
          area: ['530px', '315px'],
          shadeClose: true,
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
              layer.close(loadingIndex)
              layer.close(index)
              layer.msg('successful', { icon: 1 })
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
    showAddAccount () {
      this.isAddAccounts = true
    },
    hiddenAddAccount () {
      this.isAddAccounts = false
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

<style scoped>
  div{
    font: 14px Helvetica Neue,Helvetica,PingFang SC,\5FAE\8F6F\96C5\9ED1,Tahoma,Arial,sans-serif;
  }
  .bg-black{
    background-color:#263238;
  }
  .logo {
    position: absolute;
    left: 0;
    top: 6px;
    width: 126px;
    height: 46px;
  }
  .logo img {
    width: 100%;
    height: 100%;
  }
  img {
    max-width: 100%;
  }
  .fly-column{
    background-color: #f5f5f5;
  }
  .blue-skin {
    background:#2d668c;
    color: #fff;
    border-bottom: 1px solid #2d668c;
    border-right: 1px solid #2d668c;
  }
  .red-skin {
    background:#dd4b39;
    border-bottom: 1px solid #dd4b39;
    border-right: 1px solid #dd4b39;
    color: #fff;
  }
  .black-skin {
    background:#263238;
    border-bottom: 1px solid #263238;
    border-right: 1px solid #263238;
    color: #fff;
  }
  .gray-skin {
    background:#4b505d;
    border-bottom: 1px solid #4b505d;
    border-right: 1px solid #4b505d;
    color: #fff;
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
    word-break: break-all;
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
</style>
