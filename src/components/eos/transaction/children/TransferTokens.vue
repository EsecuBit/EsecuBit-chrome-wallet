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
          <input type="text" placeholder="Username to receive tokens" lay-verify="isEmpty" id="receiverUsername"
                 autocomplete="off" class="layui-input" v-model="receiverUsername">
          <a href="#" class="verify-icon" v-if="isShowIcon">
            <i class="layui-icon-close-fill layui-icon red" v-show="!isVerifyPass" @click="clearReceiverUsername"></i>
            <i class="layui-icon-ok-circle layui-icon green" v-show="isVerifyPass" ></i>
          </a>
        </div>
        <div class="layui-form-item">
          <label class="from-label">Amount</label>
          <input type="number" placeholder="Amount" lay-verify="isEmpty"
                 autocomplete="off" class="layui-input" v-model="amount">
        </div>
        <div class="layui-form-item">
          <label class="from-label">Memo (optional): </label>
          <input type="text" placeholder="Memo" autocomplete="off" class="layui-input" v-model="memo">
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
import { mapState, mapGetters, mapMutations } from 'vuex'
import utils from '../../../../utils/utils'

const form = layui.form
const layer = layui.layer
export default {
  name: 'TransferTokens',
  data () {
    return {
      receiverUsername: '',
      amount: '',
      isShowIcon: false,
      isVerifyPass: true,
      memo: ''
    }
  },
  watch: {
    receiverUsername: {
      handler (newValue, oldValue) {
        this.isShowIcon = true
        try {
          this.currentAccount.checkAddress(newValue)
          this.isVerifyPass = true
        } catch (e) {
          this.isVerifyPass = false
        }
      }
    }
  },
  mounted () {
    this.verifyForm()
  },
  computed: {
    ...mapState({
      'isPreventClick': 'isPreventClick'
    }),
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
    ...mapMutations({
      setIsPreventClick: 'SET_IS_PREVENT_CLICK'
    }),
    resetForm () {
      this.receiverUsername = ''
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
    clearReceiverUsername () {
      this.isShowIcon = false
      this.receiverUsername = ''
    },
    submit () {
      if (!this.receiverUsername || !this.amount || this.isPreventClick) return
      // verify address
      try {
        this.currentAccount.checkAddress(this.receiverUsername)
      } catch (e) {
        layer.msg(this.$t('message.eos_transfer_verify_username'), { icon: 2, anim: 6 })
        document.getElementById('receiverUsername').focus()
      }
      this.setIsPreventClick(true)
      let formData = {
        outputs: [{
          account: this.receiverUsername,
          value: this.amount
        }],
        token: 'EOS',
        comment: this.memo
      }
      layer.closeAll('msg')
      layer.msg(this.$t('message.send_is_trading'), {icon: 0, time: 600000000})
      this.currentAccount.prepareTransfer(formData).then(value => {
        return this.currentAccount.buildTx(value)
      }).then(value => {
        return this.currentAccount.sendTx(value)
      }).then(value => {
        // Empty retransmission status
        this.setIsPreventClick(false)
        layer.closeAll('msg')
        layer.msg(this.$t('message.send_submit_success'), { icon: 1 })
      }).catch(value => {
        this.setIsPreventClick(false)
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
