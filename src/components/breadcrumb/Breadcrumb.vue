<template>
  <div class="fly-panel fly-column">
    <div class="layui-container">
      <p style="height: 40px;line-height: 40px">
        <span class="layui-breadcrumb" style="visibility: visible;">
          <a href="#" @click="toHomePage">{{$t('message.app_home')}}</a><span lay-separator="">&gt;</span>
          <a href="#" id="message" class="message" v-text="navTitle"></a>
          <div class="add-btn-wrapper clearfix" v-show="isAddAccounts">
            <a href="#" class="add-btn" @click="addAccountContent"><i class="layui-icon ">&#xe770;</i>{{$t('message.app_add_accounts')}}</a>
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
              <span>
                    {{$t('message.app_error_prompt_msg')}}
                  </span>
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
import { mapState, mapMutations } from 'vuex'
const $ = layui.jquery
const layer = layui.layer
const form = layui.form
export default {
  name: 'breadcrumb',
  props: {
    isAddAccounts: {
      type: Boolean,
      default: true
    },
    navTitle: {
      type: String,
      default: ''
    }
  },
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
    })
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
    displayErrorCode (value) {
      layer.closeAll()
      let errorKey = String(value)
      if (this.errorCodeMsg[errorKey]) {
        layer.msg(this.errorCodeMsg[errorKey], {icon: 2, anim: 6})
      } else {
        layer.msg(errorKey, {icon: 2})
      }
    },
    ...mapMutations({
      setPageIndex: 'SET_PAGE_INDEX',
      setAddAccountTimes: 'SET_ADD_ACCOUNT_TIMES'
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
              if (that.D.isBtc(that.selected)) that.setAddAccountTimes()
              // close loading layer
              layer.close(loadingIndex)
              layer.close(index)
              layer.msg(that.$t('message.app_successful'), { icon: 1 })
              if (Array.isArray(that.accountList) && that.accountList.length > 0) {
                that.putAccount(value)
                this.setAccountList(this.orderArr(that.accountList))
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
    toHomePage () {
      this.setPageIndex(0)
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

<style scoped lang="less">
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
