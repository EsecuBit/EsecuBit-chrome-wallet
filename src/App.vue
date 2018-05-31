<template>
  <div id="app" >
    <div v-cloak>
      <div v-show="isLogin">
        <Login :status="loginStatus" />
      </div>
      <div v-show="!isLogin">
        <div class="main-admin" >
          <div class="fly-header bg-black" v-bind:class="[heardColor]">
            <div class="layui-container">
              <a class="logo" href="#"> <img src="./common/imgs/logo.png" alt="Wallet Bitcion"></a>
              <!-- 头部区域（可配合layui已有的水平导航） -->
              <ul class="layui-nav fly-nav layui-hide-xs menu-switch">
                <li class="layui-nav-item layui-this"><a href="#" id="set_jqgrid_width"><i class="icon iconfont icon-zhanghu1"></i>{{$t('message.accounts')}}</a></li>
                <li class="layui-nav-item"><a href="#" ><i class="icon iconfont icon-msnui-cloud-upload bigger"></i>{{$t('message.send')}}</a></li>
                <li class="layui-nav-item"><a href="#" ><i class="icon iconfont icon-msnui-cloud-download bigger"></i>{{$t('message.accept')}}</a></li>
                <li class="layui-nav-item"><a href="#" ><i class="icon iconfont icon-shezhi2"></i>{{$t('message.setting')}}</a></li>
                <span class="layui-nav-bar" style="left: 0; top: 55px; width: 0; opacity: 0;"></span>
              </ul>
            </div>
          </div>
          <div class="fly-panel fly-column">
            <div class="layui-container">
              <p>
        <span class="layui-breadcrumb" style="visibility: visible;">
          <a href="#">{{$t('message.home')}}</a><span lay-separator="">&gt;</span>
          <a href="#" id="message" class="message">Accounts</a>
        </span>
              </p>
            </div>
          </div>
          <div class="layui-container page-content ">
            <div class="main-tab-content">
              <div class="main-tab-item layui-show">
                <Accounts :account-info ="accounts"/>
              </div>
              <div class="main-tab-item">
                <Send/>
              </div>
              <div class="main-tab-item">
                <Accept/>
              </div>
              <div class="main-tab-item">
                <Setting @switchSetting = "switchSetting" @settingColor = "settingColor" :wallet-info="WalletInfo"/>
              </div>
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
import EsWallet from './common/js/wallet/sdk/EsWallet'

const wallet = new EsWallet()
// eslint-disable-next-line
const element = layui.element
// eslint-disable-next-line
const $ = layui.jquery

export default {
  name: 'App',
  data () {
    return {
      what: 'name',
      isLogin: true,
      loginStatus: null,
      WalletInfo: null,
      accounts: null,
      heardColor: ''
    }
  },
  mounted () {
    this.listenLoginStatus()
    // 菜单点击事件
    $('.menu-switch li a').click(function () {
      let tabIndex = $(this).parent().index()
      $('#message').text($(this).text())
      $('.menu-switch li.layui-this').removeClass('layui-this')
      $(this).parent('li').addClass('layui-this')
      $('.main-tab-content .main-tab-item').removeClass('layui-show').eq(tabIndex).addClass('layui-show')
    })
  },
  methods: {
    switchSetting (...data) {
      $('#message').text(data[0])
    },
    settingColor (...data) {
      this.heardColor = data[0] + '-skin'
    },
    test () {
      // console.log(this.$t('message.hello'))
    },
    listenLoginStatus () {
      wallet.listenStatus((errorNum, status) => {
        if (status === 1) this.loginStatus = 1
        if (status === 10) {
          this.isLogin = !this.isLogin
          wallet.getWalletInfo().then(value => {
            this.WalletInfo = value
          })
          wallet.getAccounts().then(value => {
            this.accounts = value
            console.log('ok')
          })
        }
        if (status === 99) {
          this.loginStatus = 99
          this.isLogin = !this.isLogin
        }
      })
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
    color: #01AAED!important;
  }
</style>
