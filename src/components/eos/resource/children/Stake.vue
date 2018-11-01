<template>
  <div class="layui-card">
    <div class="layui-card-header">Stake NET/CPU</div>
    <div class="layui-card-body layui-row layui-col-space10">
      <form class="layui-form">
        <div class="layui-form-item">
          <label class="from-label">Owner of Stake</label>
          <input type="text" placeholder="Username which owns the EOS"
                 v-model="ownerUsername" lay-verify="isEmpty" autocomplete="off" class="layui-input">
        </div>
        <div class="layui-form-item">
          <label class="from-label">Receiver of Stake: </label>
          <input type="text" placeholder="Username to receive NET/CPU"
                 v-model="receiverUsername" lay-verify="isEmpty" autocomplete="off" class="layui-input">
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
          <button class="layui-btn" type="button" lay-submit>立即提交</button>
          <button type="button" class="layui-btn layui-btn-primary" @click="resetForm">重置</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
const form = layui.form
export default {
  name: 'Stake',
  data () {
    return {
      ownerUsername: '',
      receiverUsername: '',
      CPUStakeAmount: '',
      NETStakeAmount: ''
    }
  },
  mounted () {
    this.verifyForm()
  },
  methods: {
    resetForm () {
      this.ownerUsername = ''
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
</style>
