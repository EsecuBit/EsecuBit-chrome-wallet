<template>
  <div class="layui-card">
    <div class="layui-card-header">Transfer Tokens</div>
    <div class="layui-card-body layui-row layui-col-space10">
      <div class="layui-form-item">
        <label class="from-label">Sender (tokens are auto-detected from this account)</label>
        <input type="text" placeholder="Username to send tokens from" lay-verify="isEmpty"
               autocomplete="off" class="layui-input" v-model="senderUsername">
      </div>
      <div class="layui-form-item">
        <label class="from-label">Receiver </label>
        <input type="text" placeholder="Username to receive tokens" lay-verify="isEmpty"
               autocomplete="off" class="layui-input" v-model="receiveUsername">
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
        <button class="layui-btn" lay-submit type="button" @clik="submit">{{$t('message.send_submit_btn')}}</button>
        <button type="button" class="layui-btn layui-btn-primary" @click="resetForm">{{$t('message.send_reset_btn')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
const form = layui.form
export default {
  name: 'TransferTokens',
  data () {
    return {
      senderUsername: '',
      receiveUsername: '',
      amount: '',
      memo: ''
    }
  },
  mounted () {
    this.verifyForm()
  },
  methods: {
    resetForm () {
      this.senderUsername = ''
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
    submit () {
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
    .layui-btn{
      color: #fff;
    }
    .from-label{
      display: block;
      margin-bottom: 6px;
      font-weight: 600;
    }
  }
</style>
