<template>
  <div class="fly-panel fly-column">
    <div class="layui-container">
      <p style="height: 40px;line-height: 40px">
        <span class="layui-breadcrumb" style="visibility: visible;">
          <a href="#" @click="toHomePage">{{$t('message.app_home')}}</a><span lay-separator="">&gt;</span>
          <a href="#" id="message" class="message" v-text="navTitle"></a>
          <div class="add-btn-wrapper clearfix" v-show="pageIndex === 0">
            <a href="#" class="add-btn" @click="addAccountContent"><i class="layui-icon ">&#xe770;</i>&nbsp;<span>{{$t('message.app_add_accounts')}}</span></a>
          </div>
        </span>
      </p>
    </div>

    <!-- add accounts Pop-up layer -->
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
              <span>{{$t('message.app_error_prompt_msg')}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- add accounts loading-->
    <div class="add-accounts-content" id="loading">
      <div class="loading-center">
        <div class="loading-wrapper">
          <i class="layui-icon layui-anim layui-anim-rotate layui-anim-loop" style="font-size: 30px;"> </i>
          <span>{{$t('message.app_init_new_account')}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '../../utils/utils'
import { mapState, mapMutations, mapGetters } from 'vuex'
const $ = layui.jquery
const layer = layui.layer
const form = layui.form
export default {
  name: 'breadcrumb',
  data () {
    return {
      selected: '',
      accountType: [],
      isHasAccount: true
    }
  },
  computed: {
    ...mapState({
      'accountList': 'accountList',
      'appVersion': 'appVersion',
      'pageIndex': 'pageIndex',
      'customizeColor': 'customizeColor'
    }),
    ...mapGetters({
      'currentAccountType': 'currentAccountType'
    }),
    navTitle () {
      // breadcrumb: get current page
      let defaultPageTitle = [this.$t('message.app_accounts'), this.$t('message.app_send'), this.$t('message.app_accept'), this.$t('message.app_setting')]
      let eosPageTitle = [this.$t('message.app_accounts'), this.$t('message.app_transaction'), this.$t('message.app_vote'), this.$t('message.app_resource'), this.$t('message.app_setting')]
      return this.D.isEos(this.currentAccountType) ? eosPageTitle[this.pageIndex] : defaultPageTitle[this.pageIndex]
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
  mounted () {
    form.render('select', 'form1')
  },
  methods: {
    ...mapMutations({
      setPageIndex: 'SET_PAGE_INDEX',
      setAddAccountTimes: 'SET_ADD_ACCOUNT_TIMES',
      putAccount: 'PUT_ACCOUNT'
    }),
    addAccountContent () {
      let btnDisplay = [this.$t('message.app_submit_btn'), this.$t('message.app_cancel_btn')]
      // Get available currency types
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
            // open loading layer
            let loadingIndex = layer.open({
              type: 1,
              anim: 2,
              closeBtn: 0,
              title: false,
              maxmin: false,
              area: ['315px', '100px'],
              content: $('#loading')
            })
            // add new account operation
            that.esWallet.newAccount(that.selected).then(value => {
              // close loading layer
              layer.close(loadingIndex)
              layer.close(index)
              layer.msg(that.$t('message.app_successful'), { icon: 1 })
            }).catch(value => {
              layer.closeAll()
              console.warn(value)
              layer.msg(that.$t('message.app_error_add_account'), { icon: 2, anim: 6 })
            })
          }
        })
      }).catch(value => {
        utils.displayErrorCode(this, value)
      })
    },
    toHomePage () {
      this.setPageIndex(0)
    }
  }
}
</script>

<style scoped lang="less">
  .fly-column{
    border-bottom: 1px solid #eee;
  }
  .layui-breadcrumb a:hover {
    color: #009688!important;
  }
  .add-accounts-content{
    display: none;
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
