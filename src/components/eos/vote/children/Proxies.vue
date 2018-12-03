<template>
  <div class="layui-card-body layui-row layui-col-space10">
    <form class="layui-form">
      <div class="layui-form-item">
        <label class="from-label">Username </label>
        <input type="text" placeholder="Enter Proxy EOS Username" lay-verify="isEmpty" v-model="username" autocomplete="off" class="layui-input" readonly>
      </div>
      <div class="layui-form-item">
        <label class="from-label">Proxy</label>
        <input type="text" placeholder="Account that owns the RAM" lay-verify="isEmpty" v-model="ProxyName" autocomplete="off" class="layui-input">
      </div>
      <div class="layui-form-item">
        <button class="layui-btn" lay-submit @click="submit">Vote</button>
        <button type="button" class="layui-btn layui-btn-primary" @click="resetForm">Reset</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import utils from '../../../../utils/utils'
const form = layui.form
const layer = layui.layer
export default {
  name: 'Proxy',
  data () {
    return {
      ProxyName: '',
      isPreventClick: false
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
    username () {
      if (this.currentAccount) {
        return this.currentAccount.label
      }
    }
  },
  methods: {
    resetForm () {
      this.ProxyName = ''
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
      let formData = {
        proxy: this.ProxyName
      }
      this.currentAccount.prepareVote(formData).then(value => this.currentAccount.buildTx(value)).then(value => this.currentAccount.sendTx(value)).then(value => {
        // Empty retransmission status
        this.isPreventClick = false
        layer.closeAll('msg')
        layer.msg(this.$t('message.send_submit_success'), { icon: 1 })
      }).catch(value => {
        this.isPreventClick = false
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
  .layui-form-item{
    padding: 4px;
    margin-bottom: 4px!important;
    .layui-btn{
      color: #fff;
    }
    .layui-form-label{
      width: auto;
      padding-left: 0;
    }
    .layui-input-block{
      margin-left: 0;
    }
    .from-label{
      display: block;
      margin-bottom: 6px;
      font-weight: 600;
    }
  }
</style>
