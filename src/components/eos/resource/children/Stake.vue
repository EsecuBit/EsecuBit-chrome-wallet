<template>
  <div class="layui-card">
    <div class="layui-card-header">Stake NET/CPU</div>
    <div class="layui-card-body layui-row layui-col-space10">
      <form class="layui-form">
        <div class="layui-form-item">
          <label class="from-label">Owner of Stake</label>
          <input type="text" placeholder="Username which owns the EOS"
                 v-model="ownerUsername" lay-verify="isEmpty" autocomplete="off" class="layui-input" readonly>
        </div>
        <div class="layui-form-item" style="position: relative">
          <label class="from-label">Receiver of Stake: </label>
          <input type="text" placeholder="Username to receive NET/CPU" id="receiverStake"
                 v-model="receiverUsername" lay-verify="isEmpty" autocomplete="off" class="layui-input">
          <a href="#" class="verify-icon" v-if="isShowIcon">
            <i class="layui-icon-close-fill layui-icon red" v-show="!isVerifyPass" @click="clearReceiverUsername"></i>
            <i class="layui-icon-ok-circle layui-icon green" v-show="isVerifyPass" ></i>
          </a>
        </div>
        <div class="layui-form-item">
          <label class="from-label">Amount of CPU to Stake (in EOS)</label>
          <input type="number" placeholder="Amount"
                 v-model="CPUStakeAmount" lay-verify="isEmpty" autocomplete="off" class="layui-input">
        </div>
        <div class="layui-form-item">
          <label class="from-label">Amount of NET to Stake (in EOS) </label>
          <input type="number" placeholder="Amount"
                 v-model="NETStakeAmount" lay-verify="isEmpty" autocomplete="off" class="layui-input">
        </div>
        <div class="layui-form-item">
          <button class="layui-btn" type="button" lay-submit @click="submit">立即提交</button>
          <button type="button" class="layui-btn layui-btn-primary" @click="resetForm">重置</button>
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
  name: 'Stake',
  data () {
    return {
      receiverUsername: '',
      CPUStakeAmount: '',
      isVerifyPass: true,
      isShowIcon: false,
      NETStakeAmount: ''
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
    ownerUsername () {
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
      this.CPUStakeAmount = ''
      this.NETStakeAmount = ''
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
      if (this.isPreventClick || !this.receiverUsername || !this.CPUStakeAmount || !this.NETStakeAmount) return
      // verify address
      try {
        this.currentAccount.checkAddress(this.receiverUsername)
      } catch (e) {
        layer.msg(this.$t('message.eos_transfer_verify_username'), { icon: 2, anim: 6 })
        this.receiverUsername = ''
        document.getElementById('receiverStake').focus()
        return
      }
      this.setIsPreventClick(true)
      let formData = {
        delegate: true,
        network: this.NETStakeAmount,
        cpu: this.CPUStakeAmount,
        receiver: this.receiverUsername
      }
      layer.msg(this.$t('message.send_is_trading'), {icon: 0, time: 600000000})
      this.currentAccount.prepareDelegate(formData).then(value => {
        console.log(value, 'prepareTx')
        return this.currentAccount.buildTx(value)
      }).then(value => {
        console.log(value, 'buildTx')
        return this.currentAccount.sendTx(value)
      }).then(value => {
        // Empty retransmission status
        layer.closeAll('msg')
        layer.msg(this.$t('message.send_submit_success'), { icon: 1 })
        this.setIsPreventClick(false)
      }).catch(value => {
        this.setIsPreventClick(false)
        utils.displayErrorCode(this, value)
      })
    }
  }
}
</script>

<style scoped lang="less">
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
    margin-bottom: 4px!important;
    padding: 4px;
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
