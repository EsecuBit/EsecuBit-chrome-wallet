<template>
  <div class="layui-card">
    <div class="layui-card-header">Buy RAM</div>
    <div class="layui-card-body layui-row layui-col-space10 " >
      <form class="layui-form" lay-filter="form">
        <div class="layui-form-item">
          <label class="from-label">RAM Payer</label>
          <input type="text" placeholder="Account paying for RAM" lay-verify="isEmpty"
                 v-model="payerUsername" autocomplete="off" class="layui-input">
        </div>
        <div class="layui-form-item">
          <label class="from-label">RAM Receiver: </label>
          <input type="text" placeholder="Account receiving RAM (may be same as payer to buy for yourself)"
                 v-model="ReceiverUsername" lay-verify="isEmpty" autocomplete="off" class="layui-input">
        </div>
        <div class="layui-form-item">
          <label class="from-label">By in EOS or Bytes?</label>
          <input type="radio" lay-filter="unit" name="unit" value="eos" title="EOS" :checked="unitChecked === 'eos'">
          <input type="radio" lay-filter="unit" name="unit" value="bytes" title="Bytes" :checked="unitChecked === 'bytes'">
        </div>
        <div class="layui-form-item">
          <label class="from-label">Amount of RAM to Buy in EOS</label>
          <input type="number" placeholder="Amount of RAM to Buy in EOS"
                 v-model="amount" lay-verify="isEmpty" autocomplete="off" class="layui-input">
        </div>
        <div class="layui-form-item">
          <button class="layui-btn" lay-submit type="button">立即提交</button>
          <button type="button" class="layui-btn layui-btn-primary" @click="resetForm">重置</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
const form = layui.form
export default {
  name: 'BuyRAM',
  data () {
    return {
      payerUsername: '',
      ReceiverUsername: '',
      amount: '',
      unitChecked: 'eos'
    }
  },
  mounted () {
    this.renderForm()
    this.verifyForm()
  },
  methods: {
    resetForm () {
      this.payerUsername = ''
      this.ReceiverUsername = ''
      this.amount = ''
      this.unitChecked = 'eos'
      this.$nextTick(() => {
        this.renderForm()
      })
    },
    verifyForm () {
      let that = this
      form.verify({
        isEmpty (value) {
          if (!value) return that.$t('message.send_form_is_empty')
        }
      })
    },
    renderForm () {
      form.render('radio', 'form')
      form.on('radio(unit)', data => {
        this.unitChecked = data.value
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
