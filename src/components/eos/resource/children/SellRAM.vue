<template>
  <div class="layui-card">
    <div class="layui-card-header">Sell RAM</div>
    <div class="layui-card-body layui-row layui-col-space10">
      <form class="layui-form" lay-filter="form">
        <div class="layui-form-item">
          <label class="from-label">RAM Owner:</label>
          <input type="text" placeholder="Account that owns the RAM"
                 lay-verify="isEmpty" v-model="ownerUsername" autocomplete="off" class="layui-input" readonly>
        </div>
        <div class="layui-form-item">
          <label class="from-label">Amount of RAM to Sell </label>
          <input type="number" placeholder="Amount of RAM to sell in Bytes"
                 lay-verify="isEmpty" v-model="sellAmount" autocomplete="off" class="layui-input">
        </div>
        <div class="layui-form-item">
          <button class="layui-btn" lay-submit type="button" @click="submit">立即提交</button>
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
  name: 'SellRAM',
  data () {
    return {
      sellAmount: ''
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
      this.sellAmount = ''
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
      if (this.isPreventClick || !this.sellAmount) return
      this.setIsPreventClick(true)
      let formData = {
        buy: false,
        ramBytes: this.sellAmount
      }
      layer.msg(this.$t('message.send_is_trading'), {icon: 0, time: 600000000})
      this.currentAccount.prepareBuyRam(formData).then(value => {
        return this.currentAccount.buildTx(value)
      }).then(value => {
        return this.currentAccount.sendTx(value)
      }).then(value => {
        // Empty retransmission status
        this.setIsPreventClick(false)
        layer.closeAll('msg')
        layer.msg(this.$t('message.send_submit_success'), { icon: 1 })
        console.log(value, '成功')
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
</style>
