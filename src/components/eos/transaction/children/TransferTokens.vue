<template>
  <div class="layui-card">
    <div class="layui-card-header">Transfer Tokens</div>
    <div class="layui-card-body layui-row layui-col-space10">
      <form class="layui-form">
        <div class="layui-form-item">
          <label class="from-label">Sender (tokens are auto-detected from this account)</label>
          <input type="text" placeholder="Username to send tokens from" lay-verify="isEmpty"
                 autocomplete="off" class="layui-input" v-model="senderUsername" readonly>
        </div>
        <div class="layui-form-item" style="position: relative">
          <label class="from-label">Receiver </label>
          <input type="text" placeholder="Username to receive tokens" lay-verify="isEmpty"
                 autocomplete="off" class="layui-input" v-model="receiveUsername">
          <a href="#" class="verify-icon" v-if="isShowIcon">
            <i class="layui-icon-close-fill layui-icon red" v-show="isVerifyPass" @click="clearReceiveUsername"></i>
            <i class="layui-icon-ok-circle layui-icon green" v-show="!isVerifyPass" ></i>
          </a>
        </div>
        <div class="layui-form-item">
          <label class="from-label">Amount</label>
          <input type="number" placeholder="Amount" lay-verify="isEmpty"
                 autocomplete="off" class="layui-input" v-model="amount">
        </div>
        <div class="layui-form-item">
          <label class="from-label">Memo (optional): </label>
          <input type="text" placeholder="Memo" lay-verify="isEmpty"
                 autocomplete="off" class="layui-input" v-model="memo">
        </div>
        <div class="layui-form-item">
          <button class="layui-btn" lay-submit type="button" @click="submit">{{$t('message.send_submit_btn')}}</button>
          <button type="button" class="layui-btn layui-btn-primary" @click="resetForm">{{$t('message.send_reset_btn')}}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import utils from '../../../../utils/utils'

const form = layui.form
const layer = layui.layer
export default {
  name: 'TransferTokens',
  data () {
    return {
      receiveUsername: '',
      amount: '',
      isShowIcon: false,
      isVerifyPass: true,
      memo: '',
      isPreventClick: false
    }
  },
  watch: {
    receiveUsername: {
      handler (newValue, oldValue) {
        if (newValue) this.isShowIcon = true
      }
    }
  },
  mounted () {
    this.verifyForm()
  },
  computed: {
    ...mapGetters({
      'currentAccount': 'currentAccount',
      'currentAccountType': 'currentAccountType'
    }),
    senderUsername () {
      if (this.currentAccount) {
        return this.currentAccount.label
      }
    }
  },
  methods: {
    resetForm () {
      this.receiveUsername = ''
      this.amount = ''
      this.memo = ''
    },
    verifyForm () {
      let that = this
      form.verify({
        isEmpty (value) {
          if (!value) return that.$t('message.send_form_is_empty')
        }
      })
    },
    clearReceiveUsername () {
      this.isShowIcon = false
      this.receiveUsername = ''
    },
    submit () {
      if (this.isPreventClick) return
      this.isPreventClick = true
      let formData = {
        outputs: [{
          account: this.receiveUsername,
          value: this.amount
        }],
        token: 'EOS',
        comment: this.memo
      }
      this.currentAccount.prepareTransfer(formData).then(value => {
        console.log(value, 'prepareTx')
        return this.currentAccount.buildTx(value)
      }).then(value => {
        console.log(value, 'buildTx')
        return this.currentAccount.sendTx(value)
      }).then(value => {
        // Empty retransmission status
        this.isPreventClick = false
        layer.closeAll('msg')
        layer.msg(this.$t('message.send_submit_success'), { icon: 1 })
        console.log(value, '成功')
      }).catch(value => {
        this.isPreventClick = false
        utils.displayErrorCode(this, value)
      })
    }
  }
}
</script>

<style scoped lang="less">
  @green: #009a61;
  @red: #e74c3c;
  .green{
    color:@green;
  }
  .red{
    color: @red;
  }
  ::-webkit-input-placeholder{
    color: #aaa;
  }
  .layui-card{
    border-radius: 8px;
    border: 1px solid #f0f0f0;
    box-shadow: 1px 3px 10px 0 #e2e2e2;
    .layui-card-header{
      font-size: 16px;
      border-bottom: 1px solid #eee;
    }
  }
  .layui-form-item{
    padding: 4px;
    margin-bottom: 4px!important;
    .layui-btn{
      color: #fff;
    }
    .from-label{
      display: block;
      margin-bottom: 6px;
      font-weight: 600;
    }
  }
  .verify-icon{
    position: absolute;
    bottom: 3px;
    right: 15px;
    height: 38px;
    line-height: 38px;
    .layui-icon{
      font-size: 18px;
    }
  }
</style>
